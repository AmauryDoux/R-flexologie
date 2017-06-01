"use strict";

angular.module("reflexologie")
    .component("horaires", {
        templateUrl: "components/horaires/horaires.html",
        controller: Horaires
    })


function Horaires() {

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