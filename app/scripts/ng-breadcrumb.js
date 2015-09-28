(function() {
    'use strict';
    
    /**
     * Breadcrumb default template.
     */
    var moduleTpls = window.angular.module('ng-breadcrumb-tpls', []);

    moduleTpls.value('$breadcrumbConsts', {
        template: 'breadcrumb/breadcrumb.html'
    });

    moduleTpls.run(['$templateCache', '$breadcrumbConsts',
        function($templateCache, $breadcrumbConsts) {
            $templateCache.put($breadcrumbConsts.template, '' +
            		' <ol class="breadcrumb"> ' +
            		' 	<li ng-repeat="breadcrumb in breadcrumbs" ng-class="{ active: $last }"> ' +
            		'		<a ui-sref="{{ breadcrumb.toState }}" ng-if="!$last" ng-bind="breadcrumb.displayLabel+\' \'"></a> ' +
            		'		<span ng-show="$last" ng-bind="breadcrumb.displayLabel"></span> ' +
            		'	</li> ' +
			        ' </ol> ' +
                '');
        }
    ]);
    
    var module = window.angular.module('ng-breadcrumb', ['ui.router', 'ng-breadcrumb-tpls']);
    
    module.directive('ngBreadcrumb', ['$interpolate', '$breadcrumbConsts', '$state', function($interpolate, $breadcrumbConsts, $state) {
    	return {
    		restrict: "AE",
    		templateUrl: function(elem, attrs) {
                return attrs.templateUrl || $breadcrumbConsts.template;
            },
            scope: {
            	/**
            	 * String - Label to display in breadcrumb. Property can be anything from the state. 
            	 * Default is the state name, with upper case first letter, 
            	 * taking last part of the state after splitting by '.'.
            	 */
                displayLabel: '@',
                /**
                 * String (Optional) - Property to specify, where the abstract state should redirect to - Optional.
                 * If abstract state found, default redirection route is it's parent state.
                 */
                abstractTransitionTo: '@?',
                /**
                 * Boolean (Optional) - To specify whether to hide the abstract states in breadcrumb or not.
                 * Default value is false.
                 */
                hideAbstract: '=?',
                /**
                 * String (Optional) - Property to specify a default home state. If this property is set, 
                 * the specified state will be the first breadcrumb everytime.
                 */
                defaultHome: '@?'
            },
            link: function(scope) {
            	scope.breadcrumbs = [];
            	/**
            	 * Watches state change.
            	 */
            	scope.$on('$stateChangeSuccess', function() {
            		var breadcrumbs=[];
            		
            		/**
            		 * Get current state.
            		 */
            		var current = $state.current.name;
            		
            		/**
            		 * Add default home state.
            		 */
            		addDefaultHomeBreadcrumb();
            		
            		/**
            		 * Add all breadcrumbs for the current state.
            		 */
            		addBreadcrumbs();
            		
            		/**
            		 *  Add default home state first if specified and is a valid state.
            		 */
            		function addDefaultHomeBreadcrumb() {
            			var home = $state.get(scope.defaultHome);
            			/**
            			 * If the current state is not same as default state or 
            			 * not abstract state or if the state is valid continue.
            			 */
                		if(current!==scope.defaultHome && angular.isDefined(home) && home!==null && !home.abstract) {
                			var displayLabel = getDisplayLabel(home);
                			var toState = getRouteForState(home);
                			var breadcrumb = getBreadcrumb(toState, displayLabel);
                			addBreadcrumb(breadcrumb);
                		}
            		}
            		
            		/**
            		 * Add all breadcrumbs for the current state.
            		 */
            		function addBreadcrumbs() {
                		/**
                		 * Get all parent states.
                		 */
                		var includedStaes = $state.$current.includes;
                		
                		angular.forEach(includedStaes, function(value, key) {
                			if(!angular.isUndefined(key)&& key!=='') {
                				var state = $state.get(key);
                				var displayLabel = getDisplayLabel(state);
                				var toState = getRouteForState(state);
                				if(toState!==false) {
                					var breadcrumb = getBreadcrumb(toState, displayLabel);
                					if(!state.abstract || (state.abstract && !scope.hideAbstract)) {
                						addBreadcrumb(breadcrumb);
                					} 
                				}
                			}
                		});
                		scope.breadcrumbs = breadcrumbs;
            		}
            		
            		/**
            		 * To get the display label for the state..
            		 */
            		function getDisplayLabel(state) {
            			var propValue;
            			/**
            			 * If the display-label attribute is not specified, 
            			 * take state name as display name with upper case first letter.
            			 */
            			if (!scope.displayLabel) {
            				propValue = getStateName(state);
                        } else {
                        	/**
                        	 * get state property value for displaying.
                        	 */
                        	propValue = getStatePropertyValue(scope.displayLabel, state);
                        	/**
                        	 * If it returns false, set the state name as display label
                        	 */
                			if(propValue===false) {
                				propValue = getStateName(state);
                			}
                        }
            			return propValue;
            		}
            		
            		/**
            		 * Take state name as display name with upper case first letter, 
            		 * by taking last part of the state after splitting by '.'
            		 */
            		function getStateName(state) {
            			var allStates = getIncludedStateNames(state);
        				var sName = allStates[allStates.length-1];
        				sName = (!!sName) ? sName.charAt(0).toUpperCase() + sName.substr(1) : '';
                        return sName;
            		}
            		
            		/**
            		 * Get the route(state) for state to which the link should redirect to.
            		 */
            		function getRouteForState(state) {
            			/**
            			 * Route to the same state.
            			 */
            			var route =  state.name;
            			/**
            			 * If the state is abstract, redirect to specified or parent state.
            			 */
            			if(state.abstract) {
            				/**
            				 * If abstract-transition-to property specified, get the route for the abstract state.
            				 */
        					if(scope.abstractTransitionTo) {
        						route = getStatePropertyValue(scope.abstractTransitionTo, state);
        						/**
        						 * If route is false, or the given state is not valid, get parent route.
        						 */
        						if(!route || $state.get(route) === null) {
        							route = getParentRoute(state);
        						}
        					} else {
        						/**
        						 * Else, get the route of parent state. 
        						 */
        						route = getParentRoute(state);
        					}
        				}
            			return route;
            		}
            		
            		/**
            		 * Get the immediate parent state route for a state.
            		 */
            		function getParentRoute(state) {
            			var allStates = getIncludedStateNames(state);
            			var totalLen = allStates.length;
            			var parentRoute;
            			/**
            			 * If the state has a parent state.
            			 */
            			if(totalLen>=2) {
            				parentRoute = allStates[totalLen-2];
            				var parentState = $state.get(parentRoute);
            				/**
            				 * Get the route for the parent state (Check again if it's abstract or not, 
            				 * until a non abstract parent state is found or no other non abstract parent state).
            				 */
            				parentRoute = getRouteForState(parentState)
            			} else {
            				return false;
            			}
            			return parentRoute;
            		}
            		
            		/**
            		 * Split the state name by '.' and return the array.
            		 */
            		function getIncludedStateNames(state) {
            			return state.name.split('.');
            		}
            		
            		/**
            		 * Return the value of given property from state.
            		 */
            		function getStatePropertyValue(property, state) {
            			var propValue = state;
            			var dataProp = [];
            			/**
            			 * Split the property by '.' and loop through each to get the property value.
            			 */
            			dataProp = property.split('.');
            			var dataPropLen = dataProp.length;
            			for(var i=0;i<dataPropLen;i++) {
            				if (angular.isDefined(propValue[dataProp[i]])) {
            					propValue = propValue[dataProp[i]];
                            } else {
                            	/**
                            	 * If property value not found, return false.
                            	 */
                            	return false;
                            }
            			}
            			return propValue;
            		}
            		
            		/**
            		 * Creates a breadcrumb JSON, with display label and state to redirect.
            		 */
            		function getBreadcrumb(toState, displayLabel) {
            			/**
            			 * creates the breadcrumb only if the route is valid.
            			 */
            			if(toState) {
            				var breadcrumb = {
                					displayLabel: displayLabel,
                					toState: toState 
                   			};
                			return breadcrumb;
            			}
            			return false;
            			
            		}
            		
            		/**
            		 * Add the breadcrumb to breadcrumbs aray.
            		 */
            		function addBreadcrumb(breadcrumb) {
            			if(breadcrumb) {
            				breadcrumbs.push(breadcrumb);
            			}
            			return breadcrumbs;
            		}
            		
                });
            }
    	};
    }]);
}());
