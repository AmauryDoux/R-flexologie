"use strict";

angular.module("reflexologie")
    .component("auth", {
        templateUrl: "components/authentification/auth.html",
        controller : Auth
    })


function Auth() {
    this.title = "here will be the authentification area. Please add some content here you lazy arses!!";
}
