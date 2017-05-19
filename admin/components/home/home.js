"use strict";

angular.module("reflexologie")
    .component("home", {
        templateUrl: "components/home/home.html",
        controller : home
    })


function home() {
    this.title = "Ceci sera le home";
}