'use strict';

angular.module('starry').controller('splashCtrl', splashCtrl);

splashCtrl.$inject = ['$scope', '$cordovaOauth', '$localStorage', '$state'];

function splashCtrl($scope, $cordovaOauth, $localStorage, $state) {
  
  navigator.geolocation.getCurrentPosition(function (position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    console.log(lat, lng);
  }, function (err){
    console.log(err);
  },{timeout: 10000, enableHighAccuracy:false});

  $scope.login = function() {
    $cordovaOauth.facebook("434572043406554", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
      $localStorage.accessToken = result.access_token;
      $state.go("profile");
  }, function(error) {
      alert(error);
    })
  };
}
