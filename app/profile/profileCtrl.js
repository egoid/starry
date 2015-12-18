'use strict';

angular.module('starry').controller('profileCtrl', profileCtrl);

profileCtrl.$inject = ['$scope', '$http', '$localStorage', '$state'];

function profileCtrl ($scope, $http, $localStorage, $state) {
  $scope.init = function() {
    if($localStorage.hasOwnProperty("accessToken") === true) {
      $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,picture,relationship_status", format: "json" }})
      .then(function(result) {
        console.log(result);
        $scope.profileData = result.data;
      }, function(error) {
        alert("There was a problem getting your profile.  Check the logs for details.");
        console.log(error);
      });
    } else {
      console.log("Not signed in");
    }
  };

  $scope.goMatch = function (){
    $state.go('matches');
  }

};