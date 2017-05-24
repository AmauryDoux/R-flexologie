'use strict';

var app = angular.module("reflexologie", ["ui.router", "ngAnimate", "ngResource"])

    .config(function ($stateProvider, $urlRouterProvider) {
        var states = [
            {
                name: "horaires",
                url: "/horaires",
                component: "horaires"
            },
            {
                name: "rdv",
                url: "/rendezvous",
                component: "rdv"
            }
        ];
        $urlRouterProvider.otherwise("/horaires"); // Page par défaut
        states.forEach(function (state) {
            $stateProvider.state(state);
        });
        
    });


