'use strict';

angular.module("reflexologie")
    .component("home", {
        templateUrl: "components/home/home.html",
        controller: Home
    })
function Home($scope, $http) {
    this.idontknow = "test";

    $scope.addPost = function () {
        var data = {
            jour: $scope.jour,
            heureStart: $scope.heureStart,
            heureEnd: $scope.heureEnd,
            patient: {
                nom: $scope.nom,
                prenom: $scope.prenom,
                email: $scope.email,
                tel: $scope.tel,
                adresse: $scope.adresse,
                commentaire: $scope.com
            },
            status: 0

        }

        sendmail(data);
        return $http.post("/rdv", data);
    }
    function sendmail(rdv) {
        return $http({
            method: 'POST',
            url: '/sendmail',
            contentType: "application/json",
            data: rdv
        });
    };
       $(document).ready(function () {
        $('select').material_select();
    });
  

  $('.chips').material_chip();
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
        'Lundi': null,
        'Mardi': null,
        'Mercredi': null,
        'Jeudi': null, 
        'Vendredi': null
      },
      limit: Infinity,
      minLength: 1
    }
  });
}
