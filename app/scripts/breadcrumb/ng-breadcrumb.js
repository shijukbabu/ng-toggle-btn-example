(function() {
    'use strict';
    
    var moduleTpls = window.angular.module('ng-breadcrumb-tpls', []);

    moduleTpls.value('$breadcrumbConsts', {
        template: 'breadcrumb/breadcrumb.html'
    });

    moduleTpls.run(['$templateCache', '$breadcrumbConsts',
        function($templateCache, $breadcrumbConsts) {
            $templateCache.put($breadcrumbConsts.template, '' +
            		' <ol class="breadcrumb"> ' +
            		' 	<li ng-repeat="crumb in breadcrumbs" ng-class="{ active: $last }"> ' +
            		'		<a ui-sref="{{ crumb.route }}" ng-if="!$last">{{ crumb.displayName}}&nbsp;</a> ' +
            		'		<span ng-show="$last">{{ crumb.displayName }}</span> ' +
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
                displayName: '@',
                abstractTransitionTo: '@?',
                hideAbstract: '=?',
                defaultHome: '@?'
            },
            link: function(scope) {
            	scope.breadcrumbs = [];
            	scope.$on('$stateChangeSuccess', function() {
            		var breadcrumbs=[];
            		var current = $state.current.name;
            		var includedStaes = $state.$current.includes;
            		
            		var home = $state.get(scope.defaultHome);
            		
            		if(current!==scope.defaultHome && angular.isDefined(home) && home!==null && !home.abstract) {
            			var displayName = getDisplayName(home);
            			var route = getStateRoute(home);
            			var breadcrumb = {
   							 displayName: displayName,
   							 route: route 
            			};
            			breadcrumbs.push(breadcrumb);
            		}
            		
            		angular.forEach(includedStaes, function(value, key) {
            			if(!angular.isUndefined(key)&& key!=='') {
            				var state = $state.get(key);
            				var displayName = getDisplayName(state);
            				var route = getStateRoute(state);
            				if(route!==false) {
            					var breadcrumb = {
            							 displayName: displayName,
                                         route: route 
            					};
            					if(state.abstract && !scope.hideAbstract) {
            						breadcrumbs.push(breadcrumb);
            					} else if(!state.abstract) {
            						breadcrumbs.push(breadcrumb);
            					}
            				}
            			}
            		});
            		scope.breadcrumbs = breadcrumbs;
            		
            		/**
            		 * To get the display name.
            		 */
            		function getDisplayName(state) {
            			var propValue;
            			if (!scope.displayName) {
                            // if the displayname-property attribute was not specified, default to the state's name
            				propValue = displayStateName(state);
                        }
            			propValue = getdisplayPropertyValue(state);
            			if(propValue===false) {
            				propValue = displayStateName(state);
            			}
            			return propValue;
            		}
            		
            		function displayStateName(state) {
            			var allStates = getIncludedStates(state);
        				var sName = allStates[allStates.length-1];
        				sName = (!!sName) ? sName.charAt(0).toUpperCase() + sName.substr(1) : '';
                        return sName;
            		}
            		
            		function getdisplayPropertyValue(state) {
            			return getStatePropertyValue(scope.displayName, state);
            		}
            		
            		function getStateRoute(state) {
            			var route =  state.name;
            			if(state.abstract) {
        					if(scope.abstractTransitionTo) {
        						route = getStatePropertyValue(scope.abstractTransitionTo, state);
        						if(!route) {
        							route = getParentRoute(state);
        						}
        					} else {
        						route = getParentRoute(state);
        					}
        				}
            			return route;
            		}
            		
            		function getParentRoute(state) {
            			var allStates = getIncludedStates(state);
            			var totalLen = allStates.length;
            			var parentRoute;
            			if(totalLen>=2) {
            				parentRoute = allStates[totalLen-2];
            				var parentState = $state.get(parentRoute);
            				parentRoute = getStateRoute(parentState)
            			} else {
            				return false;
            			}
            			return parentRoute;
            		}
            		
            		function getStatePropertyValue(property, state) {
            			var propValue = state;
            			var dataProp = [];
            			dataProp = property.split('.');
            			var dataPropLen = dataProp.length;
            			for(var i=0;i<dataPropLen;i++) {
            				if (angular.isDefined(propValue[dataProp[i]])) {
            					propValue = propValue[dataProp[i]];
                            } else {
                            	return false;
                            }
            			}
            			return propValue;
            		}
            		
            		function getIncludedStates(state) {
            			return state.name.split('.');
            		}
                });
            }
    	};
    }]);
}());