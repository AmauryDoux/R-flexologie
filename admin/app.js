'use strict';


const config = ["$stateProvider", "$urlRouterProvider", Config];

angular

    .module("reflexologie", ["ui.router", "ngAnimate", "ngResource", "ui.materialize", 'ui.calendar'])

    .config(config)

function Config($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: "horaires",
            url: "/horaires",
            component: "horaires"
        },
        {
            name: "rdv",
            url: "/rdv",
            component: "rdv"
        },

    ];

    $urlRouterProvider.otherwise("/rdv"); // Page par défaut

    states.forEach(function (state) {
        $stateProvider.state(state);
    });

};
