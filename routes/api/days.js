var express = require('express');
var router = express.Router();
var models = require('../../models');
var Day = models.Day;
var Activity = models.Activity;
var Promise = require('bluebird');

router.get('/', function(req,res,next) {
  Day.find()
  .populate('hotel')
  .populate('activity')
  .populate('restaurant')
  .exec()
  .then(function(days) {
    res.json(days);
  });
});

router.post('/:number', function(req, res, next) {
  Day.create({number: req.params.number})
  .then(function(day) {
    // var id = day._id;
    // res.redirect('/api/days/' + id);
    console.log('IS THERE ANYBODY OUT THERE.')
    return res.json(day);

  })
  // .catch(next);
});

router.get('/:id', function(req, res, next) {
  res.json(req.day);
});

router.post('/:id/:type', function(req, res, next) {
  console.log(req.body);
  var type = req.params.type;
  if(type === 'hotel') req.day.hotel = req.body.id;
  else {
    if (!(req.day[type].some(function (attr) {
      return attr._id.toString() === req.body.id;
    }))) {
      req.day[type].push(req.body.id);
    }
  }


  req.day.save()
  .then(function(day) {
    console.log(day);
    return day.populate(req.params.type);
  })
  .then(function (day) {
    console.log(day);
    res.json(day);
  })
  // .catch(next);
});

router.delete('/:id/hotel/:hotelId', function(req,res, next) {
  var dayId = req.params.id;
  var typeId = req.params.hotelId;
  req.day.hotel = null;
  req.day.save().then(function(day) {
    res.json(day);
  }).catch(next);
});

router.delete('/:id/restaurant/:restaurantId', function(req,res, next) {
  var dayId = req.params.id;
  var typeId = req.params.restaurantId;
  req.day.restaurant.pull({_id: typeId});

  req.day.save()
  .then(function() {
    res.end();
  })
  // Day.update(
  //   {_id: dayId},
  //   {$pull: {restaurant: {_id: typeId}}
  // }).exec().then(function(day) {
  //   res.end();
  // })
  // .catch(next);
});

router.delete('/:id', function(req, res, next) {
  Day.remove({_id: req.params.id})
  .then(function() {
    res.end();
  });
});

router.delete('/:id/activity/:activityId', function(req,res, next) {

  var dayId = req.params.id;
  var typeId = req.params.activityId;
  console.log(dayId);
  console.log(typeId);
  req.day.activity.pull({_id: typeId})
  req.day.save()
  .then(function() {
    res.end();
  })
  // Day.update(
  //   {_id: dayId},
  //   {$pull: {activity: {_id: typeId}}
  // }, function(err) {
  //   if(err) return next(err);
  //   res.end();
  // })
  // .catch(next);
});

router.delete('/', function(req, res, next) {
  Day.remove({}).then(function() {
    res.end();
  })
  // .catch(next);
})


router.param('id', function(req, res, next, id) {
  Day.findById(id)
  .populate('hotel')
  .populate('restaurant')
  .populate('activity')
  .then(function(day) {
    req.day = day;
    next();
  })
  .catch(next);
});

module.exports = router;
