var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Promise = require('bluebird');

var UserSchema = new mongoose.Schema({
  name: String,
  trips: [{
    days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}],
    name: String
  }]
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.deepPop = function (str) {
  return new Promise(function (resolve, reject) {
    this.deepPopulate(str, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
};







module.exports = mongoose.model('User', UserSchema);