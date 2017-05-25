"use strict";

angular.module("reflexologie")
    .component("horaires", {
        templateUrl: "components/horaires/horaires.html",
        controller: Horaires
    })


function Horaires() {

    this.title = "hello";
}