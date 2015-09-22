'use strict';

/**
 * @ngdoc overview
 * @name ngToggleBtnApp
 * @description
 * # ngToggleBtnApp
 *
 * Main module of the application.
 */
angular
  .module('ngToggleBtnApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ng-toggle.btn'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
