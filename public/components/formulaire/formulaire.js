'use strict';

angular.module("reflexologie")
    .component("formulaire", {
        templateUrl: "components/formulaire/formulaire.html",
        controller: Formulaire
    })
function Formulaire($scope, $http) {
  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
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
  
  

}
