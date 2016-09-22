var mongoose = require('mongoose');

var smsHistory = new mongoose.Schema({
  sentFrom: String,
  recipients: [String],
  when: Date,
  message: String
});

module.exports = mongoose.model('smsHistory', smsHistory);
