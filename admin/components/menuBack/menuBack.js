"use strict";

angular.module("reflexologie")
    .component("menuBack", {
        templateUrl: "components/menuBack/menuBack.html",
        controller : Menu
    })


function Menu() {
    this.horaires= "horaires";
    this.rdv= "rdv";
}