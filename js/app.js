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

starry.controller("ProfileController", function($scope, $http, $localStorage, $ionicModal, $location) {
    $scope.init = function() {
        $scope.picture = localStorage.picture;
        $scope.profileData = JSON.parse(localStorage.userInfo);
        $scope.picSrc = localStorage.thumbnails.split('*');
// https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-0/p130x130/11241227_10206612510421245_659372137424057066_n.jpg?oh=d583df23920d3105f6066e4a17cb1976&oe=5718FAC0*https://scontent.xx.fbcdn.net/hphotos-xla1/v/t1.0-0/p75x225/12065774_10207761104335375_4907252572583060039_n.jpg?oh=d233141d3d3248b2dc6cd9f555963e30&oe=56E3D9BF*https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-0/p75x225/11949485_10207398270144747_1687363442998491573_n.jpg?oh=82eddf49d17c3ebe71829635a4dc6383&oe=571BE125*https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-0/p130x130/12246604_10207924770786934_573014206688380251_n.jpg?oh=4067662d00e04c9459148525f5ece605&oe=56D3E594*https://scontent.xx.fbcdn.net/hphotos-xpl1/v/t1.0-0/p180x540/10410255_10205969612589201_5811437726703451810_n.jpg?oh=8d5eb25d0886262318bd26561fd6f49e&oe=571AFC88*https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-0/p130x130/10492373_10205388114292107_5106108563495855934_n.jpg?oh=ebc1ff0863d941e5e493485d3306ad3f&oe=56D51769*https://scontent.xx.fbcdn.net/hphotos-xaf1/t31.0-0/p480x480/11140215_10206332674065511_2401713357547557871_o.jpg*https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-0/p75x225/10472138_10205969609669128_5933879988109569829_n.jpg?oh=57735b03f9e227e373c367f2c844360f&oe=56DC6838*https://scontent.xx.fbcdn.net/hphotos-xpl1/t31.0-0/p480x480/11160615_10206845225598979_8375125541281179266_o.jpg*https://scontent.xx.fbcdn.net/hphotos-ash2/v/t1.0-0/p320x320/10405653_10205695759143036_2058040746944167581_n.jpg?oh=85659b83ceecaa532f7a77ed254c0669&oe=56D6840B*https://scontent.xx.fbcdn.net/hphotos-prn2/v/t1.0-0/p180x540/10593196_10204657771313989_3531034029949351630_n.jpg?oh=1aad260fe28ddd5a5f79e1d612a5061e&oe=56D8EBD0*https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-0/p180x540/10696163_10204657770833977_8523666647232165584_n.jpg?oh=4ce8234d1553c6638e313276bb7fc4f3&oe=56DA2938*https://scontent.xx.fbcdn.net/hphotos-xpt1/v/t1.0-0/p320x320/10574247_10204375757023808_8182464141074166397_n.jpg?oh=2f88bccc377786040efd8f810f33e374&oe=56E2A40C*https://scontent.xx.fbcdn.net/hphotos-prn2/v/t1.0-0/p480x480/10574221_10204324216535328_8024628439483196345_n.jpg?oh=049a78d7f6982f306907933d68331bdb&oe=571FA695*https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-0/p180x540/10480974_10204276161773989_4010885047560649737_n.jpg?oh=0ae133d2b3ac678fad16608442fa3145&oe=56D5F478*https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-0/p180x540/10420016_10204276172094247_7090221466928893471_n.jpg?oh=e99cfa58751791bc7cbb690ac9b0a5ef&oe=56DE6E76*https://scontent.xx.fbcdn.net/hphotos-ash4/v/t1.0-0/p180x540/10928_10204276161053971_5296865147560352684_n.jpg?oh=5307018d7dace5ba8b79095c409731ef&oe=57153392*https://scontent.xx.fbcdn.net/hphotos-xlf1/v/t1.0-0/p480x480/10378943_10203930236246067_5017797112644687005_n.jpg?oh=f1f8b8807aaf3d52f4b1a3cf66f40f26&oe=56D56D70*https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-0/p130x130/10500320_10204265248261158_6388169939257692982_n.jpg?oh=b7c581f6ee4d6ec7a60e77e9bad313ef&oe=5710E55A*https://scontent.xx.fbcdn.net/hphotos-frc3/v/t1.0-0/p320x320/10421109_10203945283062228_199380666066838406_n.jpg?oh=793d9803bb2fc868585facc63e70991e&oe=57221DF8*https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-0/p180x540/10355763_10204276161493982_8526979915419326135_n.jpg?oh=0d6cdf9e565f12f257de75d75be4853c&oe=571DFB35*        
    };
//PROFILE CONTROLLER FUNCTIONS
    $scope.edit = function(elemId) {
        var x =document.getElementById(elemId)
        x.setAttribute('contenteditable', 'true')
    };
    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });  
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
                //GETS ALL USER PHOTO'S ID'S AND STORES IN PICS;
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
                    //STORES USER PHOTO URLS IN LOCALSTORAGE
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
                //NEW FACEBOOK LOGIN? CREATE FIREBASE DATA
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
                //STORE CURRENTLY LOGGED IN USER ID
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

