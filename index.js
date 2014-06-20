'use strict';

/**
 *  VERN VSL (Vern Search Layer)
 *
 *  Web Agent for VSL.
 *
 *  Attributes:
 *  template-url: The template to override default
 */

angular.module('vern.vsl', [])
  .directive('vslAgent', function($modal, $parse, $rootScope) {
    var tUrl, defaultTemplateUrl = 'template/vsl/agent.html';

    return {
      restrict: 'AE',
      templateUrl: function(tElement, tAttr) {
        tUrl = defaultTemplateUrl;
        if (tAttr.templateUrl) {
          tUrl = tAttr.templateUrl;
        }
        return tUrl;
      },
      controller: function($scope, $element, $attrs) {

      },
      link: function(scope, element, attrs) {

      }
    }
  });

angular.module('template/vsl/agent.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/vsl/agent.html',
      '<div class="vsl-agent">' +
      '</div>');
}]);