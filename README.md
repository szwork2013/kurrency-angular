# Kurrency JSAPI Angular Library

Depends on angular >= 1.2, it will be downloaded at runtime if you are using the script standalone or from www.kurrency.co.

# Getting Started

```
bower install kurrency-angular --save
```

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

## Sessions

In order to call most of the API functions you must have established a session with Kurrency. This session lasts as long as the browser session and will be deleted once the user closes the browser. Server side, the session information can be retained for up to 30 days for use in analytics, lost carts, or incomplete orders.

`kurrency.session.get(callback(err, session))`

Performs a GET session. If there is no `Session-Id`, one will be procured if the `Access-Token` is accepted.

`kurrency.sessions.save(session, callback(err, session))`

Saves the current session data.

## Cart

`kurrency.cart.get(callback(err, cart))`

`kurrency.cart.add(product, quantity, callback(err, cart))`

`kurrency.cart.update(product, quantity, callback(err, cart))`

`kurrency.cart.remove(product, callback(err, cart))`

`kurrency.cart.empty(callback(err, cart))`

`kurrency.cart.replace(new_cart, callback(err, cart))`

## Authentication

Authentication will create a User with an `Authentication-Key` based on the current API `Access-Token`.

`kurrency.auth.login(email, password, callback(err, user))`

`kurrency.auth.register(data, callback(err, user))`

`kurrency.auth.forgotPassword(email, callback(err, success))`

## Addresses

`kurrency.addresses.list(callback(err, addresses))`

`kurrency.addresses.create(data, callback(err, address))`

`kurrency.addresses.edit(address, callback(err, address))`

`kurrency.addresses.remove(address, callback(err, address))`

## Payment Methods

`kurrency.payment_methods.list(callback(err, payment_methods))`

`kurrency.payment_methods.create(data, callback(err, payment_method))`

`kurrency.payment_methods.edit(address, callback(err, payment_method))`

`kurrency.payment_methods.remove(address, callback(err, payment_method))`

## Products

`kurrency.products.list(options, callback(err, products))`

## Product Lines

`kurrency.product_lines.list(options, callback(err, product_lines))`

## Orders

`kurrency.orders.list(options, callback(err, orders))`

`kurrency.orders.create(data, callback(err, order))`

`kurrency.orders.taxes(value, shipment, callback(err, tax))`

## Shipping

`kurrency.shipping.rates(data, callback(err, rates)`

data is an object:

```javascript
{
  ship_to: {
    address: {
      address_1: '',
      address_2: '',
      address_3: '',
      city: '',
      state_code: '',
      country_code: '',
      postal_code: ''
    }
  },
  products: <session.data.cart>
}
```

# AngularJS Directives

This Kurrency library comes with several AngularJS directives for things like handling the menu widget, product, and product line listings. It also has a useful imager tool for resizing images in the CDN.

## Menu Widget

Should be placed near the ending </body> tag

`<kurrency-menu></kurrency-menu>`

## Product Widget

`<kurrency-product id="'53ff8b2a35ed366c2b939f58'"></kurrency-product>`


## Imager

Place anywhere in your project

`<kurrency-image src="product.images[0]" options="{size: '300x200'}" alt="product.name"></kurrency-image>

Or for a static URL:

`<kurrency-image src="'http://mywebsite.com/path/to/image.jpg" options="{size: '300x200'}" alt="product.name"></kurrency-image>


# License

The Affero General Public License (AGPL)

Copyright (c) 2014, typefoo a division of uh-sem-blee, Co. (www.uh-sem-blee.com)

This program is free software: you can redistribute it and/or modify it under the terms of the Affero GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the Affero GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.