"use strict";

angular.module("reflexologie")
    .component("menuBack", {
        templateUrl: "components/menuBack/menuBack.html",
        controller : Menu
    })

function Menu($scope, $http) {

    // this.horaires= "horaires";
    // this.rdv= "rdv";

	$scope.logout = function () {
        return $http.get("/logout");
    }

}

// function Menu() {
//     this.horaires= "horaires";
//     this.rdv= "rdv";
// }