(function() {
    'use strict';

    var module = window.angular.module('ng-breadcrumb-tpls', []);

    module.value('$breadcrumbConsts', {
        template: 'breadcrumb/breadcrumb.html'
    });

    module.run(['$templateCache', '$breadcrumbConsts',
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
}());