'use strict';

/**
 * @ngdoc function
 * @name ngToggleBtnApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ngToggleBtnApp
 */
angular.module('ngToggleBtnApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
