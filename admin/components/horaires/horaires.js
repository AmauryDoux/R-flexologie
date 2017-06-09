"use strict";

angular.module("reflexologie")
  .component("horaires", {
    templateUrl: "components/horaires/horaires.html",
    controller: Horaires
  })


function Horaires($scope, $compile, $timeout, uiCalendarConfig, $http, $resource) {


  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  /* event source that pulls from google.com */
  $scope.eventSource = {};
  $scope.events = []
  /* event source that contains custom events on the scope */
  $resource("/rdvjour").get().$promise.then(function (R) {
    for (var i = 0; i < R.rdv.length; i++) {
      if (new Date(R.rdv[i].start).getTime() < new Date().getTime()) {
        $http.delete("/rdvjour/" + R.rdv[i]._id).then(function (r) { })
      }
      else {
        $scope.events.push(R.rdv[i])
      }

    }

  })
  /* event source that calls a function on every view switch */
  $scope.eventsF = function (start, end, timezone, callback) {
    var s = new Date(start).getTime() / 1000;
    var e = new Date(end).getTime() / 1000;
    var m = new Date(start).getMonth();
    var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
    callback(events);
  };

  $scope.calEventsExt = {
  };



  /* alert on eventClick */
  $scope.alertOnEventClick = function (date, jsEvent, view, event) {
    console.log(jsEvent)
    $scope.remove = function () {
      var searchTerm = date._id,
        index = -1;
      for (var i = 0, len = this.events.length; i < len; i++) {
        if (this.events[i]._id === searchTerm) {
          index = i;
          break;
        }
      }
      $scope.events.splice(index, 1);
      $http.delete("/rdvjour/" + date._id)

    };
    $scope.alertMessage = ((new Date(date.start).getDate()) + ' ' + (new Date(date.start).getMonth() + 1) + ' ' + (new Date(date.start).getHours() - 2) + ' ' + (new Date(date.start).getMinutes()) + ' ' + (new Date(date.end).getHours() - 2) + ' ' + (new Date(date.end).getMinutes()) + ' was clicked ');
  };
  /* alert on Drop */
  $scope.alertOnDrop = function (date, event, delta, revertFunc, jsEvent, ui, view) {
    let puting = {
      title: date.title,
      start: date.start._d,
      end: date.end._d
    }
    $http.put("/rdvjour/" + date._id, puting);
  };
  /* alert on Resize */
  $scope.alertOnResize = function (date, delta, revertFunc, jsEvent, ui, view) {
    let puting = {
      title: date.title,
      start: date.start._d,
      end: date.end._d
    }
    $http.put("/rdvjour/" + date._id, puting);
  };
  /* add and removes an event source of choice */
  $scope.addRemoveEventSource = function (sources, source) {
    var canAdd = 0;
    angular.forEach(sources, function (value, key) {
      if (sources[key] === source) {
        sources.splice(key, 1);
        canAdd = 1;
      }
    });
    if (canAdd === 0) {
      sources.push(source);
    }
  };
  /* add custom event*/

  /* remove event */

  /* Change View */
  $scope.changeView = function (view, calendar) {

    uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
  };
  /* Change View */
  $scope.renderCalendar = function (calendar) {
    $timeout(function () {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    });
  };
  /* Render Tooltip */
  $scope.eventRender = function (event, element, view) {
    element.attr({
      'tooltip': event.title,
      'tooltip-append-to-body': true
    });
    $compile(element)($scope);
  };
  const vm = $scope
  /* config object */
  $scope.uiConfig = {
    calendar: {
      slotLabelInterval: '01:00:00',
      allDaySlot: false,
      defaultView: 'agendaWeek',
      minTime: '09:00:00',
      maxTime: '19:00:00',
      lang: 'fr',
      height: 600,
      selectable: true,
      selectHelper: true,
      select: function (start, end) {
        var data = {
          title: "rendez-vous libre",
          start: start._d,
          end: end._d
        }
        $http.post("/RdvJour", data);
        $resource("/rdvjour").get().$promise.then(function (T) {
          for (var i = 0; i < T.rdv.length; i++) {
            vm.events.push(T.rdv[i])
          }
        })
      },
      editable: true,
      header: {
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      eventClick: $scope.alertOnEventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      eventRender: $scope.eventRender
    }
  };


  /* event sources array*/
  $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
}