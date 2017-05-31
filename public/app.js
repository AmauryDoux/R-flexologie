'use strict';

const config = ["$stateProvider", "$urlRouterProvider", Config];

angular

    .module("reflexologie", ["ui.router", "ngAnimate", "ngResource", "ui.materialize"])

    .config(config)


function Config($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: "home",
            url: "/",
            component: "home"
        }
    ];

    $urlRouterProvider.otherwise("/"); // Page par défaut
    states.forEach(function (state) {
        $stateProvider.state(state);
    });
};
