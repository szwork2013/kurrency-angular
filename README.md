# Kurrency JSAPI Angular Library

Depends on angular >= 1.2

# Getting Started

Add the script to your site

```html
<script src="bower_components/dist/kurrency-angular.js"></script>
```

Configure your app

```js
angular.module('ExampleApp', ['kurrency'])
  .config(['kurrencyConfig', function(kurrencyConfig) {
    kurrencyConfig.cache = true; // enable caching of data
    kurrencyConfig.local = false; // set true for local kurrency server testing
    kurrencyConfig.accessToken = 'EFGHIJ123456789'; // get from your Kurrency account dashboard
    kurrencyConfig.mode = 'test' // or live
  }])
```

Use it in another service or controller

```js
angular.module('ExampleApp').controller('TestController', function($scope, kurrency) {
  $scope.product_lines = [];
  $scope.products = [];
  
  kurrency.session.get(function(err, session) {
    if(err) {
      return console.log(err);
      // handle your error better than that!
    }
    
    kurrency.product_lines.list({}, function(err, lines) {
      if(err) {
        return console.log(err);
      }
      
      $scope.product_lines = lines;
      kurrency.products.list({conditions: {active: true, category: lines[0].name}}, function(err, products) {
        if(err) {
          return console.log(err);
        }
        
        // do something with products
      });
    });
  });
});
```

# API Documentation



# License

The Affero General Public License (AGPL)

Copyright (c) 2014, typefoo a division of uh-sem-blee, Co. (www.uh-sem-blee.com)

This program is free software: you can redistribute it and/or modify it under the terms of the Affero GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the Affero GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.