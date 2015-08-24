'use strict';
/* global $ */

$(document).ready(function() {
  $.ajax({
    url: '/api/users',
    method: 'GET',
    success: function (user) {
      var $tripSelect = $('#trip-select');
      user.trips.forEach(function (trip) {
        $tripSelect.append('<option value=' + trip._id + '>' + trip.name + '</option>')
      });
    }
  });
});