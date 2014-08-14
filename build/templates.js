w[KURRENCY_CONFIG.ANGULAR].module('kurrency').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('kurrency-templates/kurrency-menu.html',
    "<div class=\"kurrency-menu\">\n" +
    "  <div class=\"kurrency-cart\"></div>\n" +
    "  <div class=\"kurrency-actions\"></div>\n" +
    "</div>"
  );

}]);
