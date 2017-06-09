"use strict";

angular.module("reflexologie")
    .component("menuBack", {
        templateUrl: "components/menuBack/menuBack.html",
        controller : Menu
    })


function Menu($scope, $http, $window) {
    this.horaires= "horaires";
    this.rdv= "rdv";

    $scope.logout = function(){
        $http.get("/logout").then(function(S){});
        $window.location.reload();
    }
}