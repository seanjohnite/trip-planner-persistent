var express = require('express');
var router = express.Router();
var models = require('../../models');
var User = models.User;

var Promise = require('bluebird');

router.get('/', function (req, res, next) {
  User.find().exec()
  .then(function (userArr) {
    res.json(userArr[0]);
  });
});

module.exports = router;