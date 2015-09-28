(function() {
    'use strict';
    
    /**
     * ng-visible directive.
     */

    var module = window.angular.module('ng-visisble', []);
    
	/**
	 * Directive to apply style visible. 
	 */
	module.directive('ngVisible', function () {
		 return function (scope, element, attr) {
		     scope.$watch(attr.ngVisible, function (visible) {
		         element.css('visibility', visible ? 'visible' : 'hidden');
		     });
		 };
	});
}());
