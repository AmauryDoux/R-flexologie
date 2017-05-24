"use strict";

angular.module("reflexologie")
    .component("home", {
        templateUrl: "components/home/home.html",
        controller: home
    })


function home($scope, $resource) {
    $(document).ready(function () {
        $('.modal').modal();
    });
    $scope.toast = function toast() {
        Materialize.toast('Rendez-vous validé, un email est envoyé', 4000)
    }
    $scope.nope = function nope() {
        Materialize.toast('Rendez-vous annulé, un email est envoyé', 4000)
    }
    $(document).ready(function () {
        $('.collapsible').collapsible();
    });

    var ListRdv = $resource('/rdv');
    const vm = this;
    ListRdv.get().$promise.then(function(Rdv){
         vm.rdvs = Rdv.rdv;
         console.log(Rdv.rdv)
    })
}