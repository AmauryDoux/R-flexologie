"use strict";

angular.module("reflexologie")
    .component("home", {
        templateUrl: "components/home/home.html",
        controller: home
    })


function home($scope) {
    this.title = "Ceci sera le home";
    $(document).ready(function () {
        $('.modal').modal();
    });
    $scope.toast = function toast() {
        Materialize.toast('Rendez-vous validé, un email est envoyé', 4000)
    }
     $scope.nope = function nope() {
        Materialize.toast('Rendez-vous annulé, un email est envoyé', 4000)
    }
      $(document).ready(function(){
    $('.collapsible').collapsible();
  });
}