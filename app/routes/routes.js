'use strict';

angular.module('starry').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider  
    .state('splash', {
      url: '/splash',
      templateUrl: 'app/splash/splash.html',
      controller: 'splashCtrl as card'
    })  
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'profileCtrl'
    })
    .state('matches', {
      url: '/matches',
      templateUrl: 'app/memberMatch/match.html',
      controller: 'memberMatchCtrl'
    })
    
  $urlRouterProvider.otherwise('/splash');
});