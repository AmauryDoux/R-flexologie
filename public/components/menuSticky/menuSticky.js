'use strict';

angular.module("reflexologie")
    .component("menuSticky", {
        templateUrl: "components/menuSticky/menuSticky.html",
        controller: MenuSticky
    })
function MenuSticky() {
    $(document).ready(function () {
        $('.menu').pushpin({
            top: $('.menu').offset().top,
            bottom: 10000
        });
    });
    this.presCaroline = "presCaroline";
    this.formulaire = "formulaire";

}
