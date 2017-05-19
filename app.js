'use strict';

var app = angular.module("reflexologie", ["ui.router", "express","bulma"]);

app.config(function($stateProvider, $urlRouterProvider) {
    var states = [{
            name: "home",
            url: "/home",
            component: "home"
        },
        {
            name: "admin",
            url: "/admin",
            component: "admin"
        },
    ];
    $urlRouterProvider.otherwise("/home"); // Page par défaut
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});
