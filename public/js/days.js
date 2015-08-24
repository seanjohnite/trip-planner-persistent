'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [],
      currentDay,
      attractions = ["hotel", "restaurant", "activity"];

  function firstDay () {

  }

  function addDay () {
    var number = days.length + 1;
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
    $.ajax({
      url: '/api/days/' + currentDay,
      method: 'DELETE',
      success: function() {
        var index = days.indexOf(currentDay);
        days.splice(index, 1);
        switchDay(index);
      },
      error: function(errorObj) {
        console.error(errorObj.message);
        console.error(errorObj.stack);
      }
    })
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
    // console.log(currentDay.id);

    // if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    $.ajax({
      url: '/api/days/' + currentDay + '/' + type,
      method: 'POST',
      data: {id: attractionId},
      success: function (responseDay) {
        renderDay(currentDay);
      },
      error: function (errorObj) {
        console.error(errorObj.message);
        console.error(errorObj.stack);
      }
    });

  };

  exports.removeAttraction = function (type, attractionId) {
    // var index = currentDay[attraction.type].indexOf(attraction);
    // if (index === -1) return;

    // currentDay[attraction.type].splice(index, 1);
    //send delete ajax request
    $.ajax({
      url: '/api/days/' + currentDay + '/' + type + '/' + attractionId,
      method: 'DELETE',
      success: function() {
        renderDay(currentDay);
      },
      error: function(errorObj) {
        console.error(errorObj.message);
        console.error(errorObj.stack);
      }
    })
  };

  function renderDay(dayId) {
    mapModule.eraseMarkers();
    dayId = dayId || currentDay;
    $.ajax({
      url: '/api/days/' + dayId,
      method: 'GET',
      cache: false,
      success: function (day) {
        attractions.forEach(function(type){
          var $list = $('#itinerary ul[data-type="' + type + '"]');
          $list.empty();
          if (type === "hotel" && day.hotel) {
            $list.append(itineraryHTML(day.hotel,'hotel'));
            mapModule.drawAttraction(day.hotel);
          } else if (day[type]) {
            day[type].forEach(function(attraction){
              $list.append(itineraryHTML(attraction, type));
              mapModule.drawAttraction(attraction);
            });
          }
        });
      },
      error: function (errorObj) {
        console.log('Error Thrown');
        throw errorObj;
      }
    });
  }

  function itineraryHTML (attraction, type) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }
  function loadDays() {
    $.ajax({
      url: '/api/days',
      method: 'GET',
      success: function(daysArr) {
        days = daysArr.map(function(element) {
          return element._id.toString();
        })
        if(!days.length) addDay();
        else switchDay(days.length - 1);
      },
      error: function (errorObj) {
        console.log('Error Thrown');
        throw errorObj;
      }
    })
  }

  function removeDays() {
    $.ajax({
      url: '/api/days',
      method: 'DELETE',
      success: function() {
        days = [];
        addDay();
      },
      error: function(errorObj) {
        console.error(errorObj.message);
        console.error(errorObj.stack);
      }
    })
  }

  $(document).ready(function () {
    console.log("starting");
    loadDays();
    // if(!days[0]) addDay(1);
    $('.day-buttons').on('click', '.new-day-btn', function() {
      addDay();
    });
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
    $('.removeAllDays').on('click', removeDays);
  });

  return exports;
}());
