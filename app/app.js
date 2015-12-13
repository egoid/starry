// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var starry = angular.module('starter', ['gajus.swing' , 'ionic', 'firebase', 'ngStorage', 'ngCordova']);
var fb = null;


starry.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        fb = new Firebase("https://starry-starry.firebaseio.com/");
    });
});

starry.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider  
        .state('splash', {
            url: '/splash',
            templateUrl: 'templates/splash.html',
            controller: 'SplashController as card'

        })
        .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
        })    
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })
        .state('feed', {
            url: '/feed',
            templateUrl: 'templates/feed.html',
            controller: 'FeedController as card'
        });
    $urlRouterProvider.otherwise('/splash');
});
starry.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location, $ionicModal, $firebaseAuth, $location) {

    $scope.login = function() {
        $cordovaOauth.facebook("434572043406554", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/profile");
        }, function(error) {
            $location.path("/profile");
            console.log(error);
        })
    }


    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    })

    $scope.register = function(email, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({ email: email, password: password }).then(function() {
            return fbAuth.$authWithPassword({
                email: email,
                password: password
            })
        }).then(function(authData) {
            $location.path("/profile");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    } 
});

starry.controller("ProfileController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            console.log("Not signed in");
        }
    };

});
starry.controller("FeedController", function ($scope) {
    var stack;

    stack = gajus.Swing.Stack();

    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
        stack.createCard(targetElement);

        targetElement.classList.add('in-deck');
    });

    stack.on('throwout', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

        e.target.classList.remove('in-deck');
    });

    stack.on('throwin', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

        e.target.classList.add('in-deck');
    });

})
starry.controller("SplashController", function ($scope, $cordovaOauth, $localStorage, $location, $ionicModal, $firebaseAuth, $location) {
    $scope.init = function() {
        $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC5kjfXM3a3lt5QryC5gCA_ejK3-Ve89_0', function(data, status) {
            console.log(data)
            $localStorage.geo = data;
        })
    }
    var stack;

    stack = gajus.Swing.Stack();

    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
        stack.createCard(targetElement);

        targetElement.classList.add('in-deck');
    });

    stack.on('throwout', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

        e.target.classList.remove('in-deck');
        $scope.login();
    });

    stack.on('throwin', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

        e.target.classList.add('in-deck');
         $scope.login();
    });
    $scope.login = function() {
    $cordovaOauth.facebook("434572043406554", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
        $localStorage.accessToken = result.access_token;
        $location.path("/profile");
    }, function(error) {
        alert(error);
        })
    };



})

