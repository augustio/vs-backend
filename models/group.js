const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const groupSchema = Schema({
  name: {type: String, required: true, max: 100},
  code: {type: String, required: true, index: true, uniqueCaseInsensitive: true, unique: true, max: 50}
});

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Group', groupSchema);
