"use strict";

angular.module("reflexologie")
    .component("rdv", {
        templateUrl: "components/rdv/rdv.html",
        controller: Rdv
    })

function Rdv($scope, $resource, $http, $sce) {

    const vm = this;
    $scope.trustSrc = function (src) {
        src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyATjR_53yrD5MEaLfbpsfh3NyMAIK2crxo&q=" + this.rdv.patient.adresse;
        return $sce.trustAsResourceUrl(src);
    }
    $scope.deleted = function () {

        let i = vm.rdvs.indexOf(this.rdv);
        vm.rdvs.splice(i, 1);
        return $http.delete("/rdv/" + this.rdv._id)
    }
    $scope.toast = function toast() {
        Materialize.toast('Rendez-vous validé, un email est envoyé', 4000);
        let i = vm.rdvs.indexOf(this.rdv);
        vm.rdvs[i].status = 1;
        sendmail(this.rdv);
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
        let i = vm.rdvs.indexOf(this.rdv);
        vm.rdvs[i].status = 2; 
        sendmailCancel(this.rdv);
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
    ListRdv.get().$promise.then(function (Rdv) {
        vm.rdvs = Rdv.rdv;
    })
    function sendmail(rdv) {
        return $http({
            method: 'POST',
            url: '/sendmailVal',
            contentType: "application/json",
            data: rdv
        });
    };
    function sendmailCancel(rdv) {
        return $http({
            method: 'POST',
            url: '/sendmailSupr',
            contentType: "application/json",
            data: rdv
        });
    };
}


