'use strict';

var app = angular.module("reflexologie", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: "admin",
            url: "/admin",
            component: "admin"
        }
    ];
    $urlRouterProvider.otherwise("/home"); // Page par défaut
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});
