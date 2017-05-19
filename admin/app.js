'use strict';

var app = angular.module("reflexologie", ["ui.router", "ngAnimate"]);

app.config(function($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: "home",
            url: "/home",
            component: "home"
        }
    ];
    $urlRouterProvider.otherwise("/home"); // Page par défaut
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});
