var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var ActivitySchema = new mongoose.Schema({
  name: String,
  place: [PlaceSchema],
  age_range: String
});

ActivitySchema.set('toJSON', { getters: true, virtuals: true });

ActivitySchema.virtual('loc').get(function () {
  if(!this.place.length) return;
  else return [this.place[0].location[0], this.place[0].location[1]];
});

module.exports = mongoose.model('Activity', ActivitySchema);