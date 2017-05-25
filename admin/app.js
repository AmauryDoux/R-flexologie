'use strict';

var app = angular.module("reflexologie", ["ui.router", "ngAnimate", "ngResource", "ui.materialize"])
    .directive('repeatDone', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatDone);
            }
        }
    })
    .config(function ($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: "home",
            url: "",
            component: "home"
        }
    ];
    $urlRouterProvider.otherwise(""); // Page par défaut
    states.forEach(function (state) {
        $stateProvider.state(state);
    });

});


