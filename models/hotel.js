var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var HotelSchema = new mongoose.Schema({
  name: String,
  place: [PlaceSchema],
  num_stars: { type: Number, min: 1, max: 5 },
  amenities: { type: [String], get: toCommaString, set: fromCommaString }
});

HotelSchema.set('toJSON', { getters: true, virtuals: true });

HotelSchema.virtual('loc').get(function () {
  return [this.place[0].location[0], this.place[0].location[1]];
});

function toCommaString(amenities) {
  return amenities.join(', ');
}

function fromCommaString(amenities) {
  return amenities.split(', ');
}

module.exports = mongoose.model('Hotel', HotelSchema);