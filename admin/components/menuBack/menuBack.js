"use strict";

angular.module("reflexologie")
    .component("menuBack", {
        templateUrl: "components/menuBack/menuBack.html",
        controller : menu
    })


function menu() {
    this.title = "Ceci sera le menu";
}