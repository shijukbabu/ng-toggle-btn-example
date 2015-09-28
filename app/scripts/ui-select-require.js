(function() {
    'use strict';
    
    /**
     * UI select - directive for required options.
     */
    var module = window.angular.module('ui-select-require', []);
    
	/**
	 * Directive to validate input for Selectize.
	 */
	module.directive('requireChoice', function () {
		 return {
		     require: 'ngModel',
		     link: function postLink(scope, element, attrs, ngModel) {
		         ngModel.$validators.required = function (value) {
		         	return !(angular.isUndefined(value) || value === null || value === '');
		         };
		     }
		 };
	});
	/**
	 * Directive to validate input for select2 for multi select.
	 */
	module.directive('requireMultiple', function () {
		 return {
		     require: 'ngModel',
		     link: function postLink(scope, element, attrs, ngModel) {
		         ngModel.$validators.required = function (value) {
		             return angular.isArray(value) && value.length > 0;
		         };
		     }
		 };
	});
}());
