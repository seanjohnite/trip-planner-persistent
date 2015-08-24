var express = require('express');
var router = express.Router();
var models = require('../../models');
var Day = models.Day;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;

var Promise = require('bluebird');

router.get('/', function (req, res, next) {
  Promise.all([
    Hotel.find().exec(),
    Restaurant.find().exec(),
    Activity.find().exec()
  ])
  .then(function (attArr) {
    res.json({
      hotel: attArr[0],
      restaurant: attArr[1],
      activity: attArr[2]
    });
  });
});

module.exports = router;