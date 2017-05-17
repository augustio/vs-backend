const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const groupSchema = Schema({
  name: {type: String, required: true, max: 100}
});

groupSchema.index({name: 1}, {unique: true});
groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Group', groupSchema);
