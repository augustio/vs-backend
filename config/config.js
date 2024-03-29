//Application configuration file

let database_URL = "mongodb://localhost:27017/vs_db";
let env = process.env.NODE_ENV;

if(env == 'development'){
  database_URL = "mongodb://83.136.249.208:27017/vs_db";
}

exports.dbURL = database_URL;

exports.TOKEN_SECRET = "v1t4753n553cr3tk3y";

exports.REALM_NAME = "ospp-engine",

exports.WAMP_ROUTER_URL = "ws://185.38.3.239:8000/ws",

exports.PIPELINE_KEYS = ["rpeaks","rrintervals","pvcevents","hrvfeatures"],

exports.OPEN_URL = "com.ospp.session.open",

exports.CLOSE_URL = "com.ospp.session.close"
