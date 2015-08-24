var express = require('express');
var router = express.Router();
var models = require('../../models');
var Day = models.Day;
var Activity = models.Activity;
var Promise = require('bluebird');

router.get('/', function(req,res,next) {
  Day.find().exec()
  .then(function(days) {
    res.json(days);
  });
});

router.post('/:number', function(req, res, next) {
  Day.create({number: req.params.number})
  .then(function(day) {
    // var id = day._id;
    // res.redirect('/api/days/' + id);
    res.json(day);
  });
});

router.get('/:id', function(req, res, next) {
  res.json(req.day);
});

router.post('/:id/:type', function(req, res, next) {
  // console.log(req.body);
  var type = req.params.type;
  console.log(type)
  console.log(req.day[type]);
  if(type === 'hotel') req.day.hotel = req.body.id;
  else req.day[type].push(req.body.id);

  req.day.save()
  .then(function(day) {
    res.json(day);
  });
});


router.param('id', function(req, res, next, id) {
  Day.findById(id)
  .then(function(day) {
    req.day = day;
    next();
  })
  .catch(next);
});

module.exports = router;
