'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [],
      currentDay,
      attractions = ["hotel", "restaurant", "activity"];

  function firstDay () {
    
  }

  function addDay (number) {
    $.ajax({
      url: '/api/days/' + number,
      method: 'POST',
      success: function (responseDay) {
        days.push(responseDay._id);
        switchDay(days.length - 1);
      },
      error: function (errorObj) {
        throw errorObj;
      }
    });    
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay(days[index]);
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(type, attractionId) {


    // if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    $.ajax({
      url: '/api/days/' + currentDay + '/' + type,
      method: 'POST',
      data: {id: attractionId},
      success: function (responseDay) {
        renderDay(currentDay);
      },
      error: function (errorObj) {
        throw errorObj;
      }
    });
    
  };

  exports.removeAttraction = function (type, attractionId) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(dayId) {
    mapModule.eraseMarkers();
    dayId = dayId || currentDay;
    $.ajax({
      url: '/api/days/' + dayId,
      method: 'GET',
      success: function (day) {
        attractions.forEach(function(type){
          var $list = $('#itinerary ul[data-type="' + type + '"]');
          $list.empty();
          if (type === "hotel" && day.hotel) {
            $list.append(itineraryHTML(day.hotel));
            mapModule.drawAttraction(day.hotel);
          } else if (day[type]) {
            day[type].forEach(function(attraction){
              $list.append(itineraryHTML(attraction));
              mapModule.drawAttraction(attraction);
            });
          }
        });
      },
      error: function (errorObj) {
        throw errorObj;
      }
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function () {
    console.log("starting");
    addDay(1);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
