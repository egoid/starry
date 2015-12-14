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
            localStorage.accessToken = result.access_token;
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
        if(localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.accessToken, fields: "id,name,gender,location,picture,relationship_status", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
            $http.get("https://graph.facebook.com/v2.5/me/photos", {params: {access_token: localStorage.accessToken, type: "uploaded", field: "url"}}).then(function(results) {
              console.log(results.data)
            }, function(err) {
                $scope.photo = error;
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
          window.fbAsyncInit = function() {
              FB.init({
                appId      : 434572043406554,
                cookie     : true,  // enable cookies to allow the server to access 
                                    // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.2' // use version 2.2
              });
              FB.login(function(response) {
                localStorage.accessToken = response.authResponse.accessToken;
                 statusChangeCallback(response);
                
                console.log(response)
              }, {scope: "user_photos,publish_actions"});
              // FB.getLoginStatus(function(response) {
              //   console.log(response)
              // });
          };
          function statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            if (response.status === 'connected') {

              testAPI();
            } else if (response.status === 'not_authorized') {
              document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
            } else {
              document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
            }
          };
          function testAPI() {
            FB.api("/me/photos", {type: "uploaded"}, function(results) {
                localStorage.pics="";
                for (key in results.data) {
                    localStorage.pics+=(results.data[key].id+"_")
                }
            });
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me/permissions', function(response) {
                if (response['data'][0]['user_photos']) {
                    console.log('has the win!')
                }
            });
            FB.api('/me', function(response) {
              console.log('Successful login for: ' + response.name);
              document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
            });
          }
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));


        $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC5kjfXM3a3lt5QryC5gCA_ejK3-Ve89_0', function(data, status) {
            console.log(data)
            $localStorage.geo = data;
        });

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
    $cordovaOauth.facebook("434572043406554", ["email", "user_website", "user_location", "user_relationships", "user_photos"]).then(function(result) {
        $localStorage.accessToken = result.access_token;
        $location.path("/profile");
    }, function(error) {
        $location.path("/profile");
        
        })
    };
});

