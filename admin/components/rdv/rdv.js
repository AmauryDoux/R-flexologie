"use strict";

angular.module("reflexologie")
    .component("rdv", {
        templateUrl: "components/rdv/rdv.html",
        controller: Rdv
    })


function Rdv($scope, $resource, $http) {


    $scope.deleted = function () {
        return $http.delete("/rdv/" + this.rdv._id)
    }
    $scope.toast = function toast() {
        Materialize.toast('Rendez-vous validé, un email est envoyé', 4000)
        return $http.put('/rdv/' + this.rdv._id, {
            jour: this.rdv.jour,
            heureStart: this.rdv.heureStart,
            heureEnd: this.rdv.heureEnd,
            patient: {
                nom: this.rdv.patient.nom,
                prenom: this.rdv.patient.prenom,
                email: this.rdv.patient.email,
                tel: this.rdv.patient.tel,
                adresse: this.rdv.patient.adresse,
                commentaire: this.rdv.patient.commentaire
            },
            status: 1
        })

    }
    $scope.nope = function nope() {
        Materialize.toast('Rendez-vous annulé, un email est envoyé', 4000)
         return $http.put('/rdv/' + this.rdv._id, {
            jour: this.rdv.jour,
            heureStart: this.rdv.heureStart,
            heureEnd: this.rdv.heureEnd,
            patient: {
                nom: this.rdv.patient.nom,
                prenom: this.rdv.patient.prenom,
                email: this.rdv.patient.email,
                tel: this.rdv.patient.tel,
                adresse: this.rdv.patient.adresse,
                commentaire: this.rdv.patient.commentaire
            },
            status: 2
        })
    }
    $(document).ready(function () {
        $('.collapsible').collapsible();
    });

    var ListRdv = $resource('/rdv');
    const vm = this;
    ListRdv.get().$promise.then(function (Rdv) {
        vm.rdvs = Rdv.rdv;
        vm.infos = Rdv.rdv;
    })
}