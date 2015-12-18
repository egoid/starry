'use strict';

angular.module('starry').service('firebaseSvc', firebaseSvc);

function firebaseSvc (){
  var fb = new Firebase("https://larpameet.firebaseio.com/");

  this.returnFB = function (){
    return fb;
  }
}