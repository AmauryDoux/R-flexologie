"use strict";

angular.module("reflexologie")
    .component("logout", {
        // templateUrl: "components/menuBack/menuBack.html",
        templateUrl: "",
        controller : Logout
    })

function Logout($scope, $resource, $http, $sce) {
	
    $scope.logout = function () {
    	return $http.get("logout");
    	console.log("YOU CLICK!!!");
    }

}
