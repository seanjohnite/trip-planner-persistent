'use strict';
/* global $ daysModule all_hotels all_restaurants all_activities */

$(document).ready(function() {

  $.ajax({
    url: '/api/attractions',
    method: 'GET',
    success: function (attrObj) {
      Object.keys(attrObj).forEach(function (type) {
        var select = $('#' + type + '-select')
        attrObj[type].forEach(function (attraction) {
          select.append('<option value=' + attraction._id + '>' + attraction.name + '</option>')
        });
      });
    }
  });

  // var attractionsByType = {
  //   hotels:      all_hotels,
  //   restaurants: all_restaurants,
  //   activities:  all_activities
  // };

  // function findByTypeAndId (type, id) {
  //   var attractions = attractionsByType[type],
  //       selected;
  //   attractions.some(function(attraction){
  //     if (attraction._id === id) {
  //       selected = attraction;
  //       selected.type = type;
  //       return true;
  //     }
  //   });
  //   return selected;
  // }

  $('#attraction-select').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        id = $button.siblings('select').val();
    if ($button.hasClass('disabled')) return;
    $button.addClass('disabled');
    daysModule.addAttraction(type, id, $button);
  });

  $('#itinerary').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        id = $button.data('id');
    if ($button.hasClass('disabled')) return;
    daysModule.removeAttraction(type, id);
  });

});
