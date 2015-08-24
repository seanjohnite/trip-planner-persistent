var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

var DaySchema = new mongoose.Schema({
  number: {type: Number, required: true},
  hotel: {type: ObjectId, ref: 'Hotel'},
  // hotel: {type: String},
  restaurant: [{type: ObjectId, ref: 'Restaurant'}],
  activity:  [{type: ObjectId, ref: 'Activity'}],
});

module.exports = mongoose.model('Day', DaySchema);
