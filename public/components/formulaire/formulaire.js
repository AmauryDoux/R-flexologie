'use strict';

angular.module("reflexologie")
    .component("formulaire", {
        templateUrl: "components/formulaire/formulaire.html",
        controller: Formulaire
    })
function Formulaire($scope, $http, $compile, $timeout, uiCalendarConfig, $resource) {
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
        $scope.alertMessage = {
            id: date._id,
            start: date.start,
            end: date.end
        };
        if (date.start._d.getMinutes() < 10) {
            var minutesT = "0" + date.start._d.getMinutes()
        }
        else {
            var minutesT = date.start._d.getMinutes()
        }
        if (date.end._d.getMinutes() < 10) {
            var minuteseT = "0" + date.end._d.getMinutes()
        }
        else {
            minuteseT = date.end._d.getMinutes()
        }
        var tab = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
        $scope.message = {
            annee: date.start._d.getFullYear(),
            jour: date.start._d.getDate(),
            mois: tab[date.start._d.getMonth()],
            heureStart: date.start._d.getHours() - 2,
            minuteStart: minutesT,
            heureEnd: date.end._d.getHours() - 2,
            minuteEnd: minuteseT

        }
        Materialize.toast('Rendez vous Selectionner le ' + $scope.message.jour + " " + $scope.message.mois + " " + $scope.message.annee + " de " + $scope.message.heureStart + ":" + $scope.message.minuteStart + " à " + $scope.message.heureEnd + ":" + $scope.message.minuteEnd, 4000)
    }
    /* alert on Drop */
    $scope.alertOnDrop = function (date, event, delta, revertFunc, jsEvent, ui, view) {
        let puting = {
            title: date.title,
            start: date.start._d,
            end: date.end._d
        }
    };
    /* alert on Resize */
    $scope.alertOnResize = function (date, delta, revertFunc, jsEvent, ui, view) {
        let puting = {
            title: date.title,
            start: date.start._d,
            end: date.end._d
        }
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
            height: 640,
            selectable: false,
            selectHelper: false,
            aspectRatio: 6,
            select: function (start, end) {
                var data = {
                    title: "rendez-vous libre",
                    start: start._d,
                    end: end._d
                }
                $resource("/rdvjour").get().$promise.then(function (T) {
                    for (var i = 0; i < T.rdv.length; i++) {
                        if (T.rdv[i].start.getTime() > new Date().getTime()) {
                            $http.delete("/rdvjour/" + $scope.alertMessage.id).then(function (r) { })
                        }
                        else {
                            vm.events.push(T.rdv[i])
                        }

                    }
                })
            },
            editable: false,
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
    $('#Modal').on('shown.bs.modal', function () {
        $("#calendar").fullCalendar('render');
    });
    $(document).ready(function () {
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
    });
    $scope.addPost = function () {
        var data = {
            jour: $scope.alertMessage.start,
            heureStart: $scope.alertMessage.start,
            heureEnd: $scope.alertMessage.end,
            patient: {
                nom: $scope.nom,
                prenom: $scope.prenom,
                email: $scope.email,
                tel: $scope.tel,
                adresse: $scope.adresse,
                commentaire: $scope.com
            },
            status: 0

        }
        $scope.multi = true
        sendmail(data);
        $http.post("/rdv", data).then(function (s) { });
        var searchTerm = $scope.alertMessage.id,
            index = -1;
        for (var i = 0, len = this.events.length; i < len; i++) {
            if (this.events[i]._id === searchTerm) {
                index = i;
                break;
            }
        }
        $scope.events.splice(index, 1);
        $http.delete("/rdvjour/" + $scope.alertMessage.id).then(function (r) { })
        Materialize.toast('Un email vous à été envoyé', 4000) //
    }
    function sendmail(rdv) {
        return $http({
            method: 'POST',
            url: '/sendmail',
            contentType: "application/json",
            data: rdv
        });
    };

    $scope.multi = false

}
