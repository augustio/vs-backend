const autobahn = require('autobahn');
const _ = require('lodash');
const RecordAnalysis = require('../models/recordAnalysis');
const Record = require('../models/record');
const OSPPSession = require('../models/osppSession')
const config = require('../config/config');

module.exports = {
  analyse: (req, res, next) => {
    if(req.body.type != 'ECG'){
      return next();
    }
    console.log("Waiting for connection to OSPP live engine...");
    console.log(config.WAMP_ROUTER_URL);
    let connection = new autobahn.Connection({
      url: config.WAMP_ROUTER_URL,
      realm: config.REALM_NAME
    });
    connection.open();
    connection.onopen = (session) => {
      console.log("Connected to OSPP Live Engine.");
      console.log("\n");
      console.log("PATIENT ID: " + req.body.patientId);
      let sessionId, streamUrl, outputUrl;
      let t1,t2;
      let pipeline_keys = ["rpeaks","rrintervals","pvcevents","hrvfeatures", "afibevents"];
      let patient_id = req.body.patientId;
      let _id = `${req.body.patientId}_${req.body.type}_${req.body.recStart}`;
      let endSession = false;
      let data = {
        ch1: req.body.chOne,
        ch2: req.body.chTwo,
        ch3: req.body.chThree,
        start_time_stamp: req.body.start,
        end_time_stamp: req.body.end,
        request_id: _id
      };
      OSPPSession.findOne({_id})
        .exec((err, ses) => {
          if(ses){
            console.log('Saved session: ', ses);
            sessionId = ses.sessionConfigParams.sessionId;
            streamUrl = ses.sessionConfigParams.streamUrl;
            outputUrl = ses.sessionConfigParams.outputUrl;
            console.log("Session params retrieved: " + sessionId + "\n" + streamUrl + "\n" + outputUrl + "\n");
            if(req.body.recEnd > 0){
              endSession = true;
              OSPPSession.deleteOne({_id})
                .exec(err => { console.log(err); })
            }
            subscribeToResults();
            publishData();
          }else{
            session.call(config.OPEN_URL, [{pipeline_keys, patient_id}])
              .then( res => {
                let resultCode = _.get(res, 'status.result_code', 0);
                if(resultCode === 100){
                  session.subscribe(res.config.url, onReceiveConfig);
                  console.log('Subscribing to Alarms');
                  session.subscribe(res.config.alarmUrl, onReceiveAlarm);
                }else{
                  connection.close();
                }
              },
              err => {
                console.log(err);
                connection.close();
              });
              if(req.body.recEnd > 0){
                endSession = true;
              }
            }
          });

          const onReceiveConfig = response => {
            console.log("Configuration Info received from OSPP.");
            let ses = response[0];
            let resultCode = _.get(ses, 'status.resultCode', -1);
            if(resultCode === 1){
              sessionId = ses.config.sessionId;
              streamUrl = ses.config.streamUrl;
              outputUrl = ses.config.outputUrl;
              console.log(ses.config);

              if(!endSession){
                let newOsppSession = new OSPPSession({
                  _id,
                  sessionConfigParams: ses.config
                });
                newOsppSession.save(err => {
                  if(err){ console.log(err); }
                });
              }

              subscribeToResults();
              publishData();
            }else{
              console.log(
                "Pipeline configuration is failed. Reason : " + config.status.resultMsg
              );
              connection.close();
            }
          }

          const onReceiveAlarm = response => {
            console.log("Alarm received from OSPP.");
            console.log(response);
            Record.findOne({_id})
              .exec((err, rec) => {
                if(rec){
                  let alarms = [0,0,0];
                  response.forEach(a => {
                    alarms[a.severity] += 1;
                  });
                  rec.set({alarms});
                  rec.save(err => {
                    if(err) { console.log(err); }
                  });
                }
              });
            RecordAnalysis.findOne({_id})
              .exec((err, analysis) => {
                if(analysis){
                  analysis.set({alarms: response});
                  analysis.save(err => {
                    if(err) { console.log(err); }
                  });
                }else if(err){
                  console.log(err);
                }else{
                  let analysisObj = {};
                  Object.assign(analysisObj, {alarms: response}, {_id});
                  let newAnalysis = new RecordAnalysis(analysisObj);
                  newAnalysis.save(err => {
                    if(err) { console.log(err); }
                  });
                }
              });
          }

          const subscribeToResults = () => {
            console.log('Subscribing to Analysis pipelines');
            session.subscribe(outputUrl, onReceiveResults);
          }

          const publishData = () => {
            console.log("Publishing vitalsens data to OSPP Engine");
            t1 = new Date().getTime() / 1000;
            session.publish(streamUrl, [data]);
          }

          const onReceiveResults = res => {
            t2 = new Date().getTime() / 1000;
            let totalTime = t2 - t1;
            let timeKey = 'processingTime';

            let output = res[0];
            let resultCode = _.get(output, 'status.result_code', 0);
            console.log("Results Received from OSPP Engine, "+"Code: "+resultCode);
            if(resultCode === 100){
              let analysisUpdate = {};
              analysisUpdate.rrIntervals = _.get(output, 'results.rrintervals.signal', []);
              analysisUpdate.hrvFeatures = _.get(output, 'results.hrvfeatures.features', {});
              analysisUpdate.pvcEvents = _.get(output, 'results.pvcevents', {});
              analysisUpdate.rPeaks = _.get(output, 'results.rpeaks', {});
              analysisUpdate.afibEvents = _.get(output, 'results.afibevents', {});

              RecordAnalysis.findOne({_id})
                .exec((err, analysis) => {
                  if(analysis){
                    analysis.set(analysisUpdate);
                    analysis.save(err => {
                      if(err) { console.log(err); }
                    });
                  }else if(err){
                    console.log(err);
                  }else{
                    let analysisObj = {};
                    Object.assign(analysisObj, analysisUpdate, {_id});
                    let newAnalysis = new RecordAnalysis(analysisObj);
                    newAnalysis.save(err => {
                      if(err) { console.log(err); }
                    });
                  }
                });
            }

            let engineTime = parseFloat(output[timeKey]);

            console.log("\n\t ------ Summary ------\n");
            console.log("A) OSPP Engine Procesing Time : " + engineTime.toFixed(4) + " seconds");
            console.log("B) Data Transmission Time (Both ways) : " + (totalTime - engineTime).toFixed(4) + " seconds");
            console.log("C) Request Execution Time : " + (totalTime).toFixed(4) + " seconds");

            if(endSession){
              setTimeout(closeSession,500);
            }else{
              console.log('Session still open, record data upload not complete');
              connection.close();
            }
          }

          const closeSession = () => {
            console.log("Closing the Session.");
            session.call(config.CLOSE_URL, [sessionId])
              .then(res => {
                console.log(res.status.resultMsg + " - Session ID : " + sessionId);
              },
              err => {
                if (err.error !== 'wamp.error.no_such_procedure') {
                  console.log('Session close request failed.');
                }
              });
              next();
          }
    };
    connection.onclose = (reason, details) => {
      console.log("Connection closed with the reason: " + reason + "\n");
      next();
    };
  }
}
