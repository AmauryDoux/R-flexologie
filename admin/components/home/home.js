"use strict";

angular.module("reflexologie")
    .component("home", {
        templateUrl: "components/home/home.html",
        controller : home
    })


function home() {
    this.title = "Ceci sera le home";
      $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });

}