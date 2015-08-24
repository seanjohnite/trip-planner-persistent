var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var RestaurantSchema = new mongoose.Schema({
  name: String,
  place: [PlaceSchema],
  price: { type: Number, min: 1, max: 5 },
  cuisines: { type: [String], get: toCommaString, set: fromCommaString }
});

RestaurantSchema.virtual('loc').get(function () {
  if(!this.place.length) return;
  else return [this.place[0].location[0], this.place[0].location[1]];
});


RestaurantSchema.set('toJSON', { getters: true, virtuals: true });

function toCommaString(cuisines) {
  return cuisines.join(', ');
}

function fromCommaString(cuisines) {
  return cuisines.split(', ');
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);