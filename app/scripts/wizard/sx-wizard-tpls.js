(function() {
    'use strict';

    var module = window.angular.module('sx.wizard.tpls', []);

    module.value('$wizardConsts', {
        template: '$sx-ngtk/wizard/wizard.html'
    });

    module.run(['$templateCache', '$wizardConsts',
        function($templateCache, $wizardConsts) {
            $templateCache.put($wizardConsts.template, '' +
                '<div class="modal-header wizard-header">' +
                '    <button type="button" class="close" ng-click="cancel()">' +
                '        <span aria-hidden="true">&times;</span>' +
                '    </button>' +
                '    <h3 class="modal-title">{{_title}}</h3>' +
                '    <ul class="wizard-breadcrumb">' +
                '         <li ng-repeat="stepId in $stepsOrder" class="wizard-step-navigator" ng-class="{\'active\': $current.step.id === stepId, \'completed\': $steps[stepId].isComplete, \'entered\': $steps[stepId].entered }" style="width:calc({{100/$stepsOrder.length}}%);">' +
                '            <a ng-click="$current.step.id !== stepId && $steps[stepId].entered && goById(stepId, false)"> ' +
                '				<span class="wizard-step-number" ng-bind="$index + 1">' +
                '			   	</span>' +	
                '				<span class="wizard-step-title"  ng-bind="$steps[stepId].title"></span></a>' + 
                '         </l>' +
                '	 </ul>'+
                '  <div class="step-title text-info">{{$current.step.title}}</div>' +
                '</div>' +
                '<div class="modal-body wizard-body">' +
                '  <div ng-show="_shadow && (_entering || _leaving)" class="shadow">' +
                '    <div class="outer">' +
                '      <div class="middle text-info">' +
                '        <div class="inner">' +
                '          <h1><i class="icon-spin glyphicon glyphicon-arrows-cw"></i></h1>' +
                '        </div>' +
                '        <div class="inner">' +
                '          <h3 ng-show="_entering">Loading...</h3>' +
                '          <h3 ng-show="_leaving">Validating...</h3>' +
                '        </div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <div class="step-container" ' +
                '       sx-wizard="$data" ' +
                '       sx-wizard-steps="$steps" ' +
                '       sx-wizard-current-step="$current" ' +
                '       sx-wizard-buttons="$buttons" ' +
                '       sx-wizard-show-shadow="showShadow()" ' +
                '       sx-wizard-hide-shadow="hideShadow()" ' +
                '       sx-wizard-init="go(0, false)">' +
                '  </div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '  <div class="btn-group pull-left">' +
                '    <button class="btn btn-default" ' +
                '            ng-repeat="button in $current.step.$context.navigation.buttons"' +
                '            ng-disabled="_entering || _leaving" ' +
                '            ng-click="goById(button.stepFn(), false)">{{button.text}}</button>' +
                '  </div>' +
                '  <div class="btn-group">' +
                '    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>' +
                '    <button class="btn btn-default" ' +
                '            ng-disabled="_entering || _leaving || _history.length <= 0" ' +
                '            ng-click="previous()">Previous</button>' +
                '    <button class="btn btn-primary"' +
                '            ng-if="$stepsOrder.indexOf($current.step.id) < $stepsOrder.length - 1" ' +
                '            ng-disabled="_entering || _leaving" ' +
                '            ng-click="next()">Next</button>' +
                '    <button class="btn btn-success" ' +
                '            ng-if="_showFinishButton" ' +
                '            ng-disabled="_entering || _leaving" ' +
                '            ng-click="success()">Finish</button>' +
                '  </div>' +
                '</div>' +
                '');
        }
    ]);
}());