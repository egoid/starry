'use strict';

angular.module('starry').controller("splashCtrl", splashCtrl);
splashCtrl.$inject = ['$scope', '$http', '$cordovaOauth', '$localStorage', '$state' ];
function splashCtrl ($scope, $http, $cordovaOauth, $localStorage, $state) {

    $scope.login = function() {
      // console.log('aook')


        // window.cordovaOauth = $cordovaOauth;
        // window.http = $http;
        //   window.fbAsyncInit = function() {
        //       FB.init({
        //         appId      : 434572043406554,
        //         cookie     : true,  // enable cookies to allow the server to access 
        //                             // the session
        //         xfbml      : true,  // parse social plugins on this page
        //         version    : 'v2.2' // use version 2.2
        //       });
        //   }

  
    };

    navigator.geolocation.getCurrentPosition(function (position){
       var lat = position.coords.latitude;
       var lng = position.coords.longitude;
       console.log(lat, lng);
     }, function (err){
       console.log(err);
     },{timeout: 10000, enableHighAccuracy:false});

    // $scope.login = FB.login(function(response) {
    // console.log('FDSJHISURLHGILDF')
    // // console.log(response);
    // localStorage.access_token = (response);
    // // statusChangeCallback(response);
    // $location.path("/profile")
    // }, {scope: "user_photos,publish_actions"});

      function statusChangeCallback(response) {
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
        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.access_token, fields: "id,name,gender,location,picture", format: "json" }}).then(function(result) {
            fb.on("value", function(snapshot) {
                if (snapshot.child(result.data.id).exists() === "false" ) {
                //NEW FACEBOOK LOGIN? CREATE FIREBASE DATAe) {
                    fb.set({
                        [result.data.id]: {
                            [result.data.id]: "userid",
                            full_name: result.data.name ,
                            location: result.data.location.name,
                            picture: result.data.picture.data.url,
                            gender: result.data.gender,
                            bio: "what's your story?",
                            geo: "",
                            matches: {},
                        }
                    })
                };
                //STORE CURRENTLY LOGGED IN USER ID
                fb.child(result.data.id).once("value", function(snapshot) {
                    var str = snapshot.val();
                    str.id = result.data.id;
                    str.picture = result.data.picture.data.url;
                    localStorage.userData = JSON.stringify(str);
                    console.log(JSON.stringify(snapshot.val()));
                });
            })

        });
                    // $.http("https://graph.facebook.com/v2.5/result.data.id/picture").then(function(response) {
                    //     console.log(response)
                    //     // localStorage.picture = JSON.stringify(response);

                    // }, function(error) {
                    //     console.log(error);
                    // });
            // FB.api("/me/photos", {type: "uploaded"}, function(results) {
            //     var pics="";
            //     for (key in results.data) {
            //         pics+=(results.data[key].id+"_")
            //     };
            //     localStorage.profilePictures = '';
            //     localStorage.thumbnails = ''
            //     //GETS ALL USER PHOTO'S ID'S AND STORES IN PICS;
            //     var x = pics.split('_');
            //     x.forEach(function(url){
            //         var url = "/"+url;
            //         FB.api(url, {fields: "images,picture"}, function (response) {
                        
            //             var imgUrl = response.images[4].source;
            //             var thumbUrl = response.picture;
            //             localStorage.thumbnails+=(imgUrl + "*");
            //             localStorage.profilePictures+=(imgUrl + "*");
            //         })
                    //STORES USER PHOTO URLS IN LOCALSTORAGE

                
            };
//GETS ALL USER PHOTOS URLS ID'S AND STORES IN LOCAL STORAGE
            // console.log('Welcome!  Fetching your information.... ');
            // FB.api('/me/permissions', function(response) {
            //     if (response['data'][0]['user_photos']) {
            //         console.log('has the win!')
            //     }
            // });

          }
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));

// CORDOVA OAUTH FOR APPS

