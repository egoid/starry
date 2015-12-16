var starry = angular.module('starter', ['gajus.swing' , 'ionic', 'firebase', 'ngStorage', 'ngCordova']);
var fb = null;

starry.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        fb = new Firebase("https://larpameet.firebaseio.com/");
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

starry.controller("ProfileController", function($scope, $http, $localStorage, $location) {
    $scope.init = function() {
        $scope.picture = localStorage.picture;
        $scope.profileData = JSON.parse(localStorage.userInfo);
    };
//PROFILE CONTROLLER FUNCTIONS
    $scope.edit = function(elemId) {
        var x =document.getElementById(elemId)
        x.setAttribute('contenteditable', 'true')
    };
    $scope.save = function(name,bio) {
        var updateName = document.getElementById(name).innerText;
        var updateBio = document.getElementById(bio).innerText;
        fb.child($scope.profileData.id).update({full_name: updateName});
        fb.child($scope.profileData.id).update({bio: updateBio});
        $scope.profileData.full_name = updateName;
        $scope.profileData.bio = updateBio;
    };

});
starry.controller("SplashController", function ($scope, $http, $cordovaOauth, $localStorage, $location, $firebaseAuth, $location) {
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
                var pics="";
                for (key in results.data) {
                    pics+=(results.data[key].id+"_")
                };
//GETS ALL USER PHOTO'S ID'S
                localStorage.profilePictures = '';
                localStorage.thumbnails = '';
                var x = pics.split('_');
                x.forEach(function(url){
                    var url = "/"+url;
                    FB.api(url, {fields: "images,picture"}, function (response) {
                        var imgUrl = response.images[4].source;
                        var thumbUrl = response.picture;
                        localStorage.thumbnails+=(thumbUrl + "*");
                        localStorage.profilePictures+=(imgUrl + "*");
                    })
                })
            });
//GETS ALL USER PHOTOS URLS ID'S AND STORES IN LOCAL STORAGE
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me/permissions', function(response) {
                if (response['data'][0]['user_photos']) {
                    console.log('has the win!')
                }
            });
//GETS USER PROFILE PIC AND STORES IN LOCAL
            FB.api('/me/picture', {type: "large"}, function(response) {
                localStorage.picture = response.data.url;
            });
          }
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));

//STORE GEO DATA
        $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC5kjfXM3a3lt5QryC5gCA_ejK3-Ve89_0', function(data, status) {
            console.log(data)
            $localStorage.geo = data;
        });
//CHECKS IF USER ALREADY HAS FIREBASE DATA, THEN STORES PROFILE DATA IN LOCAL STORAGE
        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.accessToken, fields: "id,name,gender,location,picture", format: "json" }}).then(function(result) {
            fb.on("value", function(snapshot) {
                if (snapshot.child(result.data.id).exists() === false) {
                    fb.set({
                        [result.data.id]: {
                            full_name: result.data.name ,
                            location: result.data.location.name,
                            picture: result.data.picture.data.url,
                            gender: result.data.gender,
                            photos: [],
                            bio: "what's your story?",
                            description: [],
                            matches: {},
                        }
                    })
                };
                fb.child(result.data.id).once("value", function(snapshot) {
                    var str = snapshot.val();
                    str.id = result.data.id;
                    localStorage.userInfo = JSON.stringify(str);
                    console.log(JSON.stringify(snapshot.val()))
                })
            })
            console.log(result.data)
            // $scope.profileData = result.data;
        }, function(error) {
            alert("There was a problem getting your profile.  Check the logs for details.");
            console.log(error);
        });
    }
//CODE FOR SPLASH SCREEN SWIPE (replace with ionic cards ? )
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
//CORDOVA OAUTH FOR APPS
    $scope.login = function() { 
    $cordovaOauth.facebook("434572043406554", ["user_photos, publish_actions"]).then(function(result) {
        $localStorage.accessToken = result.access_token;
        $location.path("/profile");
    }, function(error) {
        $location.path("/profile");
        
        })
    };
});

