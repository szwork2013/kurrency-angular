/*
 * kurrency-angular
 * https://github.com/typefoo/kurrency-angular

 * Version: 0.1.26 - 2015-01-09
 * License: AGPL
 */
/**
 *  Kurrency AngularJS Library
 *
 *  Service (factory) for kurrency operations utilizing the JSAPI
 *
 *  Kurrency is a product of typefoo. Copyright 2013 uh-sem-blee, Co.
 *  You may distribute and reproduce this file, but may not claim ownership or manipulate
 *  for your own use.
 *
 */
(function (w, d) {
  'use strict';
  if (!w.KURRENCY_CONFIG) {
    w.KURRENCY_CONFIG = {
      ANGULAR: 'angular',
      MENU: {},
      STRIPEJS: true
    };
  } else {
    if (!w.KURRENCY_CONFIG.ANGULAR) {
      w.KURRENCY_CONFIG.ANGULAR = 'angular';
    }
  }
  if (!w.KURRENCY_CONFIG.STRIPEJS) {
    var stripe_scrip = d.createElement('script');
    stripe_scrip.type = 'text/javascript';
    stripe_scrip.async = true;
    stripe_scrip.src = 'https://js.stripe.com/v2/';
    d.getElementsByTagName('body')[0].appendChild(stripe_scrip);
    if (stripe_scrip.readyState) {
      stripe_scrip.onreadystatechange = function () {
        if (stripe_scrip.readyState == 'loaded' || stripe_scrip.readyState == 'complete') {
          stripe_scrip.onreadystatechange = null;
        }
      };
    } else {
      stripe_scrip.onload = function () {
      };
    }
  }
  if (!w[w.KURRENCY_CONFIG.ANGULAR] && (typeof w.KURRENCY_CONFIG.REQUIRE_ANGULAR === 'undefined' || w.KURRENCY_CONFIG.REQUIRE_ANGULAR === true)) {
    var scrip = d.createElement('script');
    scrip.type = 'text/javascript';
    scrip.async = true;
    scrip.src = '//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.min.js';
    d.getElementsByTagName('body')[0].appendChild(scrip);
    if (scrip.readyState) {
      scrip.onreadystatechange = function () {
        if (scrip.readyState == 'loaded' || scrip.readyState == 'complete') {
          scrip.onreadystatechange = null;
          setupKurrency();
        }
      };
    } else {
      scrip.onload = function () {
        setupKurrency();
      };
    }
  } else {
    setupKurrency();
  }
  function setupKurrency() {
    w[KURRENCY_CONFIG.ANGULAR].module('KurrencyApp', []);
    w[KURRENCY_CONFIG.ANGULAR].module('KurrencyApp').run([
      '$templateCache',
      function ($templateCache) {
        'use strict';
        $templateCache.put('kurrency-templates/kurrency-menu.html', '<div class="kurrency-menu" ng-class="{\'logged-in\': kurrency.auth.loggedIn(), \'open\': menuService.showing}">\n' + '  <ul class="menu-wrapper">\n' + '    <li ng-repeat="mi in menuService.menu" ng-show="menuService.checkShowing(mi)" ng-class="menuService.checkButtonClass(mi)">\n' + '      <ng-include src="mi.buttonTemplateUrl"></ng-include>\n' + '    </li>\n' + '  </ul>\n' + '  <div class="kurrency-loading" ng-class="{active: (apiLoading > 0)}"><div class="loading-indicator">Loading...</div></div>\n' + '  <div class="kurrency-sidebar {{sidebar.className}}" ng-repeat="sidebar in menuService.sidebars" ng-class="{active: menuService.show(sidebar.tag)}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="menuService.back" ng-click="menuService.toggle(menuService.back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="menuService.close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <div ng-include="sidebar.templateUrl"></div>\n' + '      <a ng-show="config.display_logo" href="https://www.kurrency.co" target="_blank" class="logo">powered by <img src="https://assets.kurrency.io/images/kurrency_logo.png"></a>\n' + '    </div>\n' + '  </div>\n' + '</div>');
        $templateCache.put('kurrency-templates/kurrency-popover.html', '<span ng-transclude></span>\n' + '<div class="kurrency-popover">\n' + '  <span ng-bind="kurrencyPopover"></span>\n' + '</div>');
        $templateCache.put('kurrency-templates/kurrency-product.html', '<div class="kurrency-product">\n' + '  <div class="kurrency-product-container">\n' + '    <kurrency-image src="product.images[0]" options="{size: \'300x200\'}" alt="product.name"></kurrency-image>\n' + '  </div>\n' + '  <div class="kurrency-product-container">\n' + '    <div class="column">\n' + '      <h2 ng-bind="product.name"></h2>\n' + '      <h3 ng-show="product.sub_title" ng-bind="product.sub_title"></h3>\n' + '      <span class="price" ng-bind="kurrencyMenuService.getPrice(product)"></span>\n' + '    </div>\n' + '    <div class="column">\n' + '      <div ng-show="product.attributes">\n' + '        <div ng-repeat="variant in product.attributes">\n' + '          <div ng-if="variant.type == \'select\'">\n' + '            <select class="form-control" ng-model="variant.$selected" ng-change="kurrencyMenuService.setVariant(product, variant.name, variant.$selected)" ng-options="option as variantDisplay(option) for option in variant.options"><option value>Select a {{variant.name}}</option></select>\n' + '          </div>\n' + '          <div ng-if="variant.type == \'multi\'">\n' + '            <div class="variant-option checkbox" ng-repeat="option in variant.options" ng-hide="!option.name.length">\n' + '              <label><input type="checkbox" ng-click="kurrencyMenuService.setMultiVariant(product, variant.name, option)">{{option.name}}</label>\n' + '            </div>\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '      <button class="add-to-cart" type="button" ng-click="kurrencyMenuService.addToCart(product, 1)">Buy Now</button>\n' + '    </div>\n' + '    <p ng-bind-html="product.short_description"></p>\n' + '  </div>\n' + '</div>');
        $templateCache.put('kurrency-templates/menu/account.html', '<h1>My Account</h1>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'account\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<p>Shipping Addresses</p>\n' + '<ul class="addresses-list">\n' + '  <li class="address" ng-repeat="address in addressList">\n' + '    <div class="clearfix" ng-show="!address.$editing">\n' + '      <div class="left">\n' + '        <div><span ng-bind="address.name | limitTo:18"></span></div>\n' + '        <div><span ng-bind="(address.email | limitTo:18) + \'...\'"></span></div>\n' + '        <div><span ng-bind="address.phone | limitTo:18"></span></div>\n' + '      </div>\n' + '      <div class="right">\n' + '        <div><span ng-bind="address.address.address_1 | limitTo:18"></span></div>\n' + '        <div><span ng-bind="address.address.city + \', \' + address.address.state_code | limitTo:18"></span></div>\n' + '        <div><span ng-bind="address.address.postal_code + \', \' + address.address.country_code"></span></div>\n' + '      </div>\n' + '    </div>\n' + '    <div class="edit-holder" ng-show="address.$editing">\n' + '      <form ng-submit="updateAddress(address)">\n' + '        <input class="kurrency-input" type="text" ng-model="address.name" placeholder="Your Name">\n' + '        <input class="kurrency-input" type="text" ng-model="address.company_name" placeholder="(optional) Company Name">\n' + '        <input class="kurrency-input" type="text" ng-model="address.address.address_1" placeholder="Enter your address" ng-change="lookupGeoCode(address.address.address_1, address.address.postal_code, address)">\n' + '        <div ng-show="geocodeComplete">\n' + '          <input class="kurrency-input" type="text" ng-model="address.address.address_2" placeholder="(optional) Address Line 2">\n' + '          <input class="kurrency-input" type="text" ng-model="address.address.city" placeholder="Enter your city">\n' + '          <select class="kurrency-input" ng-model="address.address.state_code" ng-options="state.value as state.name for state in stateList"><option value>Select a State</option></select>\n' + '          <select class="kurrency-input" ng-model="address.address.country_code" ng-options="country.value as country.name for country in countryList"><option value>Select a Country</option></select>\n' + '        </div>\n' + '        <input class="kurrency-input" type="text" ng-model="address.address.postal_code" placeholder="Enter your postal/zip code" ng-change="lookupGeoCode(address.address.address_1, address.address.postal_code, address)">\n' + '        <button class="kurrency-button small half cancel" ng-click="address.$editing = false">Cancel</button>\n' + '        <button class="kurrency-button small half submit" ng-click="saveAddress(address)">Save</button>\n' + '      </form>\n' + '    </div>\n' + '    <div ng-show="!address.$editing">\n' + '      <button class="kurrency-button small half edit" ng-click="address.$editing = true">Edit</button>\n' + '      <button class="kurrency-button small half delete" ng-click="deleteAddress(address)">Delete</button>\n' + '    </div>\n' + '  </li>\n' + '</ul>\n' + '<p>Payment Methods</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'payment_methods\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<ul class="payment-methods">\n' + '  <li class="payment-method" ng-repeat="payment_method in paymentMethodList">\n' + '    <div class="clearfix" ng-show="!payment_method.$editing">\n' + '      <div class="left" ng-bind="payment_method.nickname"></div>\n' + '      <div class="right" ng-bind="getPaymentMethodType(payment_method)"></div>\n' + '    </div>\n' + '    <div class="edit-holder" ng-show="payment_method.$editing">\n' + '      <form ng-submit="updatePaymentMethod(payment_method)">\n' + '        <input class="kurrency-input" type="text" ng-model="payment_method.nickname" placeholder="Nickname">\n' + '        <button class="kurrency-button small half cancel" ng-click="payment_method.$editing = false">Cancel</button>\n' + '        <button class="kurrency-button small half submit" ng-click="savePaymentMethod(payment_method)">Save</button>\n' + '      </form>\n' + '    </div>\n' + '    <div ng-show="!payment_method.$editing">\n' + '      <button class="kurrency-button small half edit" ng-click="payment_method.$editing = true">Edit</button>\n' + '      <button class="kurrency-button small half delete" ng-click="deletePaymentMethod(payment_method)">Delete</button>\n' + '    </div>\n' + '  </li>\n' + '</ul>');
        $templateCache.put('kurrency-templates/menu/button-cart.html', '<a ng-click="menuService.toggle(\'cart\')" kurrency-popover="shoppingCartPopoverText" showing="{{cartAddActive}}" ng-class="menuService.checkClass(\'cart\')"><span class="kicon-cart"></span><span class="count">{{quantity_total}}</span></a>');
        $templateCache.put('kurrency-templates/menu/button.html', '<a ng-href="{{menuService.getUri(mi)}}" ng-click="mi.onClick ? mi.onClick() : menuService.toggle(mi.tag)" kurrency-popover="mi.name" class="menuService.checkClass(mi.tag)"><span class="{{mi.icon}}"></span></a>');
        $templateCache.put('kurrency-templates/menu/cart.html', '<h1>Shopping Cart</h1>\n' + '<div ng-show="!cart || !cart.length">\n' + '  <p>You have nothing in your cart</p>\n' + '  <button type="button" class="kurrency-button" ng-click="menuService.close()">Continue Shopping</button>\n' + '</div>\n' + '<div ng-show="cart && cart.length">\n' + '  <ul class="cart-products">\n' + '    <li class="cart-product" ng-repeat="product in cart">\n' + '      <div class="clearfix">\n' + '        <div class="left">\n' + '          <div class="name" ng-bind="product.name"></div>\n' + '        </div>\n' + '        <div class="right">\n' + '          <div class="price"><span ng-bind-html="displayProductPrice(product)"></span></div>\n' + '        </div>\n' + '      </div>\n' + '      <div class="clearfix">\n' + '        <div class="left">\n' + '          <div class="variants" ng-repeat="v in product.variants">{{v.name}}: {{v.value}}</div>\n' + '          <div class="quantity">Count: <input ng-model="product.qty" ng-change="updateQuantity(product)"></div>\n' + '        </div>\n' + '        <div class="right">\n' + '          <div class="variants" ng-repeat="v in product.variants" ng-bind-html="displayVariantPrice(v)"></div>\n' + '          <div class="remove"><a href ng-click="removeProduct(product)">remove</a></div>\n' + '        </div>\n' + '      </div>\n' + '    </li>\n' + '    <li class="cart-product total">\n' + '      <div class="left">Product Total</div>\n' + '      <div class="right product-total">{{product_total/100 | currency}}</div>\n' + '    </li>\n' + '  </ul>\n' + '  <button type="button" class="kurrency-button checkout-button" ng-click="menuService.toggle(\'checkout\', \'cart\')">Checkout</button>\n' + '</div>');
        $templateCache.put('kurrency-templates/menu/checkout-2.html', '<h1>Checkout</h1>\n' + '<p>Please complete the form below to finish checkout</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'checkout\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form>\n' + '  <div ng-show="addressList.length > 0">\n' + '    <p>Select from a billing address you have saved</p>\n' + '    <select class="kurrency-input" ng-model="checkout.billing.ship_to" ng-options="address as address.address.address_1 for address in addressList" ng-change="changedAddress()"><option value>New Address</option></select>\n' + '  </div>\n' + '  <div>\n' + '    <button type="button" class="kurrency-button small" ng-click="copyShippingAddress()" ng-hide="shippingAddressCopied">Copy Shipping Address</button>\n' + '  </div>\n' + '  <div>\n' + '    <p>Enter your email address</p>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.email" placeholder="Your email address">\n' + '  </div>\n' + '  <div>\n' + '    <p>Enter a billing address</p>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.name" placeholder="Your Name">\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.company_name" placeholder="(optional) Company Name">\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.address.address_1" placeholder="Enter your address" ng-change="lookupGeoCode(checkout.billing.ship_to.address.address_1, checkout.billing.ship_to.address.postal_code, checkout.billing)">\n' + '    <div ng-show="geocodeComplete">\n' + '      <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.address.address_2" placeholder="(optional) Address Line 2">\n' + '      <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.address.city" placeholder="Enter your city">\n' + '      <select class="kurrency-input" ng-model="checkout.billing.ship_to.address.state_code" ng-options="state.value as state.name for state in stateList"><option value>Select a State</option></select>\n' + '      <select class="kurrency-input" ng-model="checkout.billing.ship_to.address.country_code" ng-options="country.value as country.name for country in countryList"><option value>Select a Country</option></select>\n' + '    </div>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.billing.ship_to.address.postal_code" placeholder="Enter your postal/zip code" ng-change="lookupGeoCode(checkout.billing.ship_to.address.address_1, checkout.billing.ship_to.address.postal_code, checkout.billing)">\n' + '  </div>\n' + '  <button type="submit" class="kurrency-button contact-button" ng-click="menuService.toggle(\'checkout-3\', \'checkout-2\')">Continue</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/checkout-3.html', '<h1>Checkout</h1>\n' + '<p>Please complete the form below to finish checkout</p>\n' + '<form>\n' + '  <div ng-show="requiresShipping">\n' + '    <p>Select a shipping method</p>\n' + '    <div ng-repeat="package in packages">\n' + '      <select class="kurrency-input" ng-model="selectedRate" ng-disabled="rates.length <= 0" ng-options="rate as ((rate.cost | currency) + \' - \' + rate.name) for rate in package.rates">\n' + '        <option value="">Please Wait...</option>\n' + '      </select>\n' + '    </div>\n' + '  </div>\n' + '  <div ng-show="paymentMethodList.length > 0">\n' + '    <p>Select a payment method</p>\n' + '    <select class="kurrency-input" ng-model="checkout.payment_method" ng-options="payment_method as (getPaymentMethodType(payment_method) + \': \' + payment_method.nickname) for payment_method in paymentMethodList"><option value>New Credit Card</option></select>\n' + '  </div>\n' + '  <div ng-show="!checkout.payment_method || !checkout.payment_method._id">\n' + '    <p>Enter your payment information</p>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.payment_method.card.name" placeholder="Name on card">\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.payment_method.card.card_number" placeholder="Card number">\n' + '    <select class="kurrency-input" class="expiration" ng-model="checkout.payment_method.card.expiration_month" ng-options="option.value as option.name for option in expirationMonths"><option value>Expiration Month</option></select>\n' + '    <select class="kurrency-input" class="expiration" ng-model="checkout.payment_method.card.expiration_year" ng-options="option.value as option.name for option in expirationYears"><option value>Expiration Year</option></select>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.payment_method.card.security_code" placeholder="Security code on back">\n' + '  </div>\n' + '  <div class="order-total">\n' + '    <ul class="cart-products">\n' + '      <li class="cart-product total">\n' + '        <div class="left">Product Total</div>\n' + '        <div class="right product-total">{{product_total/100 | currency}}</div>\n' + '      </li>\n' + '      <li class="cart-product total">\n' + '        <div class="left">Tax Total</div>\n' + '        <div class="right product-total">{{tax_total/100 | currency}}</div>\n' + '      </li>\n' + '      <li class="cart-product total">\n' + '        <div class="left">Shipping Total</div>\n' + '        <div class="right product-total">{{shipping_total/100 | currency}}</div>\n' + '      </li>\n' + '      <li class="cart-product final total">\n' + '        <div class="left">Final Total</div>\n' + '        <div class="right product-total">{{final_total/100 | currency}}</div>\n' + '      </li>\n' + '    </ul>\n' + '  </div>\n' + '  <div class="alerts">\n' + '    <div ng-repeat="alert in messages[\'checkout-3\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '  </div>\n' + '  <button type="submit" class="kurrency-button contact-button" ng-click="completeOrder()">Complete Order</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/checkout-complete.html', '<h1>Order Complete!</h1>\n' + '<p>Thank you for placing an order, you should receive an email confirmation soon</p>\n' + '<button type="button" class="kurrency-button" ng-click="menuService.close()">Continue Shopping</button>');
        $templateCache.put('kurrency-templates/menu/checkout.html', '<h1>Checkout</h1>\n' + '<p>Please complete the form below to finish checkout</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'checkout\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form>\n' + '  <div ng-show="!kurrency.auth.loggedIn()">\n' + '    <p>Have an account?</p>\n' + '    <button class="kurrency-button small" type="button" ng-click="menuService.toggle(\'login\', \'checkout\', \'checkout\')">Login Now</button>\n' + '  </div>\n' + '  <div ng-show="addressList.length > 0">\n' + '    <p>Select from a shipping address you have saved</p>\n' + '    <select class="kurrency-input" ng-model="checkout.shipment.ship_to" ng-options="address as address.address.address_1 for address in addressList" ng-change="changedAddress()"><option value>New Address</option></select>\n' + '  </div>\n' + '  <div>\n' + '    <p>Enter your email address</p>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.email" placeholder="Your email address">\n' + '  </div>\n' + '  <div ng-show="requiresShipping">\n' + '    <p>Enter a shipping address</p>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.name" placeholder="Your Name">\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.company_name" placeholder="(optional) Company Name">\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.address.address_1" placeholder="Enter your address" ng-change="lookupGeoCode(checkout.shipment.ship_to.address.address_1, checkout.shipment.ship_to.address.postal_code, checkout.shipment)">\n' + '    <div ng-show="geocodeComplete">\n' + '      <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.address.address_2" placeholder="(optional) Address Line 2">\n' + '      <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.address.city" placeholder="Enter your city">\n' + '      <select class="kurrency-input" ng-model="checkout.shipment.ship_to.address.state_code" ng-options="state.value as state.name for state in stateList"><option value>Select a State</option></select>\n' + '      <select class="kurrency-input" ng-model="checkout.shipment.ship_to.address.country_code" ng-options="country.value as country.name for country in countryList"><option value>Select a Country</option></select>\n' + '    </div>\n' + '    <input class="kurrency-input" type="text" ng-model="checkout.shipment.ship_to.address.postal_code" placeholder="Enter your postal/zip code" ng-change="lookupGeoCode(checkout.shipment.ship_to.address.address_1, checkout.shipment.ship_to.address.postal_code, checkout.shipment)">\n' + '  </div>\n' + '  <button type="submit" class="kurrency-button contact-button" ng-click="saveAddress(checkout.shipment.ship_to); menuService.toggle(\'checkout-2\', \'checkout\')">Continue</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/contact.html', '<h1>Contact Us</h1>\n' + '<p>Fill out the form below and we\'ll respond as soon as possible</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'contact\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form ng-submit="sendContact()">\n' + '  <input class="kurrency-input" type="text" ng-model="contact.name" placeholder="Enter your name">\n' + '  <input class="kurrency-input" type="email" ng-model="contact.email" placeholder="Enter your email">\n' + '  <textarea rows="3" class="kurrency-input" ng-model="contact.message" placeholder="Enter a message or concern to send to us"></textarea>\n' + '  <button type="submit" class="kurrency-button contact-button">Contact</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/forgot-password.html', '<h1>Forgot My Password</h1>\n' + '<p>Enter your email address and we will send you instructions to reset your password</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'forgot-password\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form ng-submit="forgotPassword()">\n' + '  <input class="kurrency-input" type="text" ng-model="forgot.email" placeholder="Enter your email address">\n' + '  <button class="kurrency-button send-password-instructions" type="submit" class="login-button">Send Instructions</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/register.html', '<h1>Register</h1>\n' + '<p>Enter the fields below to get started</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'register\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form ng-submit="registerUser()">\n' + '  <input class="kurrency-input" type="text" ng-model="register.first_name" placeholder="Enter your first name">\n' + '  <input class="kurrency-input" type="text" ng-model="register.last_name" placeholder="Enter your last name">\n' + '  <input class="kurrency-input" type="email" ng-model="register.email" placeholder="Enter your email">\n' + '  <input class="kurrency-input" type="password" ng-model="register.password" placeholder="Enter a password">\n' + '  <button type="submit" class="kurrency-button register-button">Register</button>\n' + '  <p>Already have an account?</p>\n' + '  <button type="button" class="kurrency-button small login-button" ng-click="menuService.toggle(\'login\', \'register\')">Sign in now</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/sign-in.html', '<h1>Sign In</h1>\n' + '<p>Sign into your Kurrency account.</p>\n' + '<div class="alerts">\n' + '  <div ng-repeat="alert in messages[\'login\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '</div>\n' + '<form ng-submit="loginUser()">\n' + '  <input class="kurrency-input" type="text" ng-model="login.username" placeholder="Enter your username or email">\n' + '  <input class="kurrency-input" type="password" ng-model="login.password" placeholder="Enter your password">\n' + '  <button type="submit" class="kurrency-button login-button">Sign In</button>\n' + '  <div class="spacer"></div>\n' + '  <button type="button" class="kurrency-button small forgot-password" ng-click="menuService.toggle(\'forgot-password\', \'login\')">Forgot your password?</button>\n' + '  <p>Don\'t have an account?</p>\n' + '  <button type="button" class="kurrency-button small register-button" ng-click="menuService.toggle(\'register\', \'login\')">Register Now</button>\n' + '</form>');
        $templateCache.put('kurrency-templates/menu/wishlist.html', '<h1>Wishlist</h1>\n' + '<div ng-show="!wishlist || !wishlist.length">\n' + '  <p>You have nothing in your wishlist</p>\n' + '  <button type="button" class="kurrency-button" ng-click="menuService.close()">Continue Shopping</button>\n' + '</div>\n' + '<div ng-show="wishlist && wishlist.length">\n' + '  <ul>\n' + '    <li ng-repeat="product in cart">\n' + '\n' + '    </li>\n' + '  </ul>\n' + '  <button type="button" class="kurrency-button share-wishlist-button" ng-click="menuService.toggle(\'share-wishlist\', \'wishlist\')">Share my wishlist</button>\n' + '</div>');
      }
    ]);
    w[KURRENCY_CONFIG.ANGULAR].module('KurrencyApp').constant('kurrencyConfig', {
      cache: false,
      local: false,
      accessToken: 'ABC123',
      mode: 'test',
      display_logo: true,
      phrases: { cart_empty: 'You don\'t have anything in your cart' },
      display_price_breakdown: true,
      months: [
        {
          name: 'January',
          value: 1
        },
        {
          name: 'February',
          value: 2
        },
        {
          name: 'March',
          value: 3
        },
        {
          name: 'April',
          value: 4
        },
        {
          name: 'May',
          value: 5
        },
        {
          name: 'June',
          value: 6
        },
        {
          name: 'July',
          value: 7
        },
        {
          name: 'August',
          value: 8
        },
        {
          name: 'September',
          value: 9
        },
        {
          name: 'October',
          value: 10
        },
        {
          name: 'November',
          value: 11
        },
        {
          name: 'December',
          value: 12
        }
      ],
      years: [
        {
          name: new Date().getFullYear(),
          value: new Date().getFullYear()
        },
        {
          name: new Date().getFullYear() + 1,
          value: new Date().getFullYear() + 1
        },
        {
          name: new Date().getFullYear() + 2,
          value: new Date().getFullYear() + 2
        },
        {
          name: new Date().getFullYear() + 3,
          value: new Date().getFullYear() + 3
        },
        {
          name: new Date().getFullYear() + 4,
          value: new Date().getFullYear() + 4
        },
        {
          name: new Date().getFullYear() + 5,
          value: new Date().getFullYear() + 5
        },
        {
          name: new Date().getFullYear() + 6,
          value: new Date().getFullYear() + 6
        },
        {
          name: new Date().getFullYear() + 7,
          value: new Date().getFullYear() + 7
        }
      ],
      states: [
        {
          'name': 'Alberta',
          'value': 'AB'
        },
        {
          'name': 'Alabama',
          'value': 'AL'
        },
        {
          'name': 'Alaska',
          'value': 'AK'
        },
        {
          'name': 'American Samoa',
          'value': 'AS'
        },
        {
          'name': 'Arizona',
          'value': 'AZ'
        },
        {
          'name': 'Arkansas',
          'value': 'AR'
        },
        {
          'name': 'British Columbia',
          'value': 'BC'
        },
        {
          'name': 'California',
          'value': 'CA'
        },
        {
          'name': 'Colorado',
          'value': 'CO'
        },
        {
          'name': 'Connecticut',
          'value': 'CT'
        },
        {
          'name': 'Delaware',
          'value': 'DE'
        },
        {
          'name': 'District Of Columbia',
          'value': 'DC'
        },
        {
          'name': 'Federated States Of Micronesia',
          'value': 'FM'
        },
        {
          'name': 'Florida',
          'value': 'FL'
        },
        {
          'name': 'Georgia',
          'value': 'GA'
        },
        {
          'name': 'Guam',
          'value': 'GU'
        },
        {
          'name': 'Hawaii',
          'value': 'HI'
        },
        {
          'name': 'Idaho',
          'value': 'ID'
        },
        {
          'name': 'Illinois',
          'value': 'IL'
        },
        {
          'name': 'Indiana',
          'value': 'IN'
        },
        {
          'name': 'Iowa',
          'value': 'IA'
        },
        {
          'name': 'Kansas',
          'value': 'KS'
        },
        {
          'name': 'Kentucky',
          'value': 'KY'
        },
        {
          'name': 'Louisiana',
          'value': 'LA'
        },
        {
          'name': 'Manitoba',
          'value': 'MB'
        },
        {
          'name': 'Maine',
          'value': 'ME'
        },
        {
          'name': 'Marshall Islands',
          'value': 'MH'
        },
        {
          'name': 'Maryland',
          'value': 'MD'
        },
        {
          'name': 'Massachusetts',
          'value': 'MA'
        },
        {
          'name': 'Michigan',
          'value': 'MI'
        },
        {
          'name': 'Minnesota',
          'value': 'MN'
        },
        {
          'name': 'Mississippi',
          'value': 'MS'
        },
        {
          'name': 'Missouri',
          'value': 'MO'
        },
        {
          'name': 'Montana',
          'value': 'MT'
        },
        {
          'name': 'New Brunswich',
          'value': 'NB'
        },
        {
          'name': 'Nebraska',
          'value': 'NE'
        },
        {
          'name': 'Newfoundland and Labrador',
          'value': 'NL'
        },
        {
          'name': 'Nevada',
          'value': 'NV'
        },
        {
          'name': 'New Hampshire',
          'value': 'NH'
        },
        {
          'name': 'New Jersey',
          'value': 'NJ'
        },
        {
          'name': 'New Mexico',
          'value': 'NM'
        },
        {
          'name': 'New York',
          'value': 'NY'
        },
        {
          'name': 'North Carolina',
          'value': 'NC'
        },
        {
          'name': 'North Dakota',
          'value': 'ND'
        },
        {
          'name': 'Nova Scotia',
          'value': 'NS'
        },
        {
          'name': 'Northern Mariana Islands',
          'value': 'MP'
        },
        {
          'name': 'Ohio',
          'value': 'OH'
        },
        {
          'name': 'Oklahoma',
          'value': 'OK'
        },
        {
          'name': 'Ontario',
          'value': 'ON'
        },
        {
          'name': 'Oregon',
          'value': 'OR'
        },
        {
          'name': 'Palau',
          'value': 'PW'
        },
        {
          'name': 'Pennsylvania',
          'value': 'PA'
        },
        {
          'name': 'Prince Edward Island',
          'value': 'PE'
        },
        {
          'name': 'Puerto Rico',
          'value': 'PR'
        },
        {
          'name': 'Quebec',
          'value': 'QB'
        },
        {
          'name': 'Rhode Island',
          'value': 'RI'
        },
        {
          'name': 'South Carolina',
          'value': 'SC'
        },
        {
          'name': 'South Dakota',
          'value': 'SD'
        },
        {
          'name': 'Saskatchewan',
          'value': 'SK'
        },
        {
          'name': 'Tennessee',
          'value': 'TN'
        },
        {
          'name': 'Texas',
          'value': 'TX'
        },
        {
          'name': 'Utah',
          'value': 'UT'
        },
        {
          'name': 'Vermont',
          'value': 'VT'
        },
        {
          'name': 'Virgin Islands',
          'value': 'VI'
        },
        {
          'name': 'Virginia',
          'value': 'VA'
        },
        {
          'name': 'Washington',
          'value': 'WA'
        },
        {
          'name': 'West Virginia',
          'value': 'WV'
        },
        {
          'name': 'Wisconsin',
          'value': 'WI'
        },
        {
          'name': 'Wyoming',
          'value': 'WY'
        },
        {
          'name': 'Yukon',
          'value': 'YT'
        }
      ],
      countries: [
        {
          name: 'United States',
          value: 'US'
        },
        {
          name: 'Canada',
          value: 'CA'
        }
      ]
    }).factory('kurrency', [
      '$rootScope',
      '$http',
      'kurrencyConfig',
      '$q',
      function ($rootScope, $http, kurrencyConfig, $q) {
        function Request(kurrency, opts) {
          var $scope = this;
          $scope.options = {};
          if (!kurrency) {
            return console.log('Missing Kurrency object');
          }
          var defaults = {
              type: 'get',
              url: '',
              path: '',
              baseUrl: kurrency.options.baseUrl || '',
              data: {},
              dataType: 'json',
              headers: {
                'Access-Token': kurrency.options.accessToken,
                'Authentication-Key': kurrency.options.authenticationKey ? kurrency.options.authenticationKey : undefined,
                'Session-Id': kurrency.options.session ? kurrency.options.session._id : undefined,
                'Kurrency-Mode': kurrency.options.mode ? kurrency.options.mode : 'test'
              },
              commonError: function (res, status, error) {
                console.log(res);
              }
            };
          $scope.cleanData = function (data) {
            if (!data) {
              return data;
            }
            var newData = w[KURRENCY_CONFIG.ANGULAR].copy(data);
            if (typeof newData !== 'object') {
              return newData;
            }
            for (var i in newData) {
              if (i.charAt(0) === '$' && i !== '$or' && i !== '$not' && i !== '$ne' && i !== '$and' && i !== '$gt' && i !== '$gte' && i !== '$lt' && i !== '$gte' && i !== '$in' && i !== '$nin' && i !== '$exists' && i !== '$type' && i !== '$mod' && i !== '$regex' && i !== '$text' && i !== '$where' && i !== '$geoIntersects' && i !== '$geoWithin' && i !== '$nearSphere' && i !== '$near' && i !== '$box' && i !== '$centerSphere' && i !== '$center' && i !== '$geometry' && i !== '$maxDistance' && i !== '$minDistance' && i !== '$polygon' && i !== '$uniqueDocs' && i !== '$all' && i !== '$elemMatch' && i !== '$size' && i !== '$meta' && i !== '$slice' && i !== '$options') {
                delete newData[i];
              }
              if (typeof newData[i] === 'object') {
                newData[i] = $scope.cleanData(newData[i]);
              }
            }
            return newData;
          };
          $scope.config = function (opts) {
            $scope.options = w[KURRENCY_CONFIG.ANGULAR].extend({}, defaults, opts);
            return $scope;
          };
          $scope.req = function (type, url, data, error) {
            $rootScope.$broadcast('apiLoading', true);
            var opts = w[KURRENCY_CONFIG.ANGULAR].extend({}, $scope.options);
            if (kurrency.options.user) {
              opts.headers['authentication-key'] = kurrency.options.user.authenticationKey;
            }
            opts.method = type;
            opts.url = url;
            if (data) {
              data = $scope.cleanData(data);
            }
            if (type === 'post' || type === 'put') {
              opts.data = JSON.stringify(data);
              opts.contentType = 'application/json';
            } else {
              opts.params = data;
              if (opts.params && typeof opts.params.conditions === 'object') {
                opts.params.conditions = JSON.stringify(opts.params.conditions);
              }
            }
            var req = $http(opts);
            req.success(function () {
              $rootScope.$broadcast('apiLoading', false);
            });
            req.error(function (res) {
              $rootScope.$broadcast('apiLoading', false);
              $rootScope.$broadcast('apiError', res);
              if (error) {
                return error(res);
              }
            });
            return req;
          };
          $scope.get = function (url, data, error) {
            if (typeof data === 'function') {
              error = data;
              data = null;
            }
            return $scope.req('get', url, data, error);
          };
          $scope.post = function (url, data, error) {
            if (typeof data === 'function') {
              error = data;
              data = null;
            }
            return $scope.req('post', url, data, error);
          };
          $scope.put = function (url, data, error) {
            if (typeof data === 'function') {
              error = data;
              data = null;
            }
            return $scope.req('put', url, data, error);
          };
          $scope.del = function (url, data, error) {
            if (typeof data === 'function') {
              error = data;
              data = null;
            }
            return $scope.req('delete', url, data, error);
          };
          return $scope.config(opts);
        }
        function Stor() {
          var $scope = this;
          var useLocalStorage = false;
          if (typeof Storage !== 'undefined') {
            try {
              sessionStorage['validStorage'] = true;
              useLocalStorage = true;
            } catch (e) {
              useLocalStorage = false;
            }
          }
          if (useLocalStorage) {
            $scope.set = function (name, value) {
              if (typeof value === 'object') {
                sessionStorage[name] = JSON.stringify(value);
              } else {
                sessionStorage[name] = value;
                return sessionStorage[name];
              }
              return sessionStorage[name];
            };
            $scope.get = function (name) {
              var ret;
              try {
                ret = JSON.parse(sessionStorage[name]);
              } catch (e) {
                ret = sessionStorage[name];
              }
              return ret;
            };
            $scope.remove = function (name) {
              delete sessionStorage[name];
              return null;
            };
          } else {
            $scope.set = function (name, value) {
              var expires = '';
              var outVal = typeof value === 'object' ? JSON.stringify(value) : escape(value);
              document.cookie = escape(name) + '=' + outVal + expires + '; path=/';
            };
            $scope.get = function (name) {
              var nameEQ = escape(name) + '=';
              var ca = document.cookie.split(';');
              for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ')
                  c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                  var out;
                  try {
                    out = JSON.parse(c.substring(nameEQ.length, c.length));
                  } catch (e) {
                    out = decodeURIComponent(c.substring(nameEQ.length, c.length));
                  }
                  return out;
                }
              }
              return null;
            };
            $scope.remove = function (name) {
              $scope.create(name, '', -1);
            };
          }
          return $scope;
        }
        var Kurrency = function (opts) {
          var $scope = this;
          $scope.options = {};
          $scope.Stor = Stor;
          $scope.Request = Request;
          var storage = $scope.storage = new $scope.Stor();
          var baseUrls = $scope.baseUrls = {
              test: 'http://0.0.0.0:3458/jsapi',
              production: 'https://api.kurrency.io/api/jsapi'
            };
          var cache = {
              products: {},
              product_lines: {}
            };
          if (!window.angular) {
            throw Error('angular is missing');
          }
          var defaults = {
              caching: true,
              local: false,
              accessToken: '',
              authenticationKey: null,
              session: null,
              user: null,
              mode: 'test',
              baseUrl: baseUrls[this.local ? 'test' : 'production']
            };
          $scope.config = function (opts) {
            $scope.options = w[KURRENCY_CONFIG.ANGULAR].extend(defaults, opts);
            if ($scope.options.local) {
              $scope.options.baseUrl = baseUrls.test;
            } else {
              $scope.options.baseUrl = baseUrls.production;
            }
            $scope.options.user = storage.get('user');
            return $scope;
          };
          $scope.handleError = function (res) {
            if (res && res.responseCode === 403) {
              storage.remove('session');
              $scope.options.session = null;
            }
            $rootScope.$broadcast('kurrencyError', res);
          };
          /*
           *
           * Session methods
           *
           */
          function session(options) {
            if (options) {
              $scope.config(options);
            }
          }
          session.prototype.get = function (cb, force) {
            if (!cb) {
              return $scope.options.session;
            }
            $scope.options.session = storage.get('session');
            if (!$scope.options.session || force) {
              var req = new Request($scope).get($scope.options.baseUrl + '/session', null, $scope.handleError);
              req.success(function (res) {
                $scope.options.session = res.pkg.data;
                storage.set('session', $scope.options.session);
                return cb(null, $scope.options.session);
              });
            } else {
              return cb(null, $scope.options.session);
            }
          };
          session.prototype.save = function (session, cb) {
            $scope.options.session = session;
            var req = new Request($scope).post($scope.options.baseUrl + '/session', session.data, $scope.handleError);
            req.success(function (res) {
              $scope.options.session = res.pkg.data;
              storage.set('session', $scope.options.session);
              return cb(null, $scope.options.session);
            });
          };
          /*
           *
           * Cart methods
           *
           */
          function cart(options) {
            if (options) {
              $scope.config(options);
            }
          }
          cart.prototype.get = function (cb) {
            $scope.session.get(function (err, session) {
              if (!session.data.cart) {
                session.data.cart = [];
                $scope.session.save(session, function (err, session) {
                  return cb(null, session.data.cart);
                });
              } else {
                return cb(null, session.data.cart);
              }
            });
          };
          cart.prototype.add = function (product, qty, cb) {
            var variants = JSON.stringify(product.variants);
            $scope.cart.get(function (err, cart) {
              for (var i = 0; i < cart.length; i++) {
                if (cart[i]._id === product._id && JSON.stringify(cart[i].variants) === variants) {
                  cart[i].qty += parseInt(qty, 10);
                  return $scope.session.get(function (err, session) {
                    session.data.cart = cart;
                    $scope.session.save(session, function (err, session) {
                      return cb(null, cart);
                    });
                  });
                }
              }
              cart.push({
                _id: product._id,
                name: product.name,
                sub_title: product.sub_title,
                qty: parseInt(qty, 10),
                image: product.images[0],
                weight: product.weight,
                dimensions: product.dimensions,
                price: product.price,
                product_lines: product.product_lines,
                requires_shipping: product.requires_shipping,
                allow_presale: product.allow_presale,
                taxable: product.taxable,
                variants: w[KURRENCY_CONFIG.ANGULAR].copy(product.variants)
              });
              $scope.session.get(function (err, session) {
                session.data.cart = cart;
                $scope.session.save(session, function (err, session) {
                  return cb(null, cart);
                });
              });
            });
          };
          cart.prototype.update = function (product, qty, cb) {
            $scope.cart.get(function (err, cart) {
              for (var i = 0; i < cart.length; i++) {
                if (cart[i]._id === product._id) {
                  cart[i].qty = parseInt(qty);
                  break;
                }
              }
              $scope.session.get(function (err, session) {
                session.data.cart = cart;
                $scope.session.save(session, function (err, session) {
                  return cb(null, cart);
                });
              });
            });
          };
          cart.prototype.remove = function (product, cb) {
            $scope.cart.get(function (err, cart) {
              for (var i = 0; i < cart.length; i++) {
                if (cart[i]._id === product._id) {
                  cart.splice(i, 1);
                  break;
                }
              }
              $scope.session.get(function (err, session) {
                session.data.cart = cart;
                $scope.session.save(session, function (err, session) {
                  return cb(null, cart);
                });
              });
            });
          };
          cart.prototype.empty = function (cb) {
            $scope.session.get(function (err, session) {
              session.data.cart = [];
              $scope.session.save(session, function (err, session) {
                return cb(null, []);
              });
            });
          };
          cart.prototype.replace = function (cart, cb) {
            $scope.session.get(function (err, session) {
              session.data.cart = cart;
              $scope.session.save(session, function (err, session) {
                if (err) {
                  return cb(err, null);
                }
                return cb(null, session.data.cart);
              });
            });
          };
          /*
           *
           * Authentication methods
           *
           */
          function auth(options) {
            if (options) {
              $scope.config(options);
            }
          }
          auth.prototype.register = function (data, cb) {
            var req = new Request($scope).post($scope.options.baseUrl + '/register', data, $scope.handleError);
            req.success(function (res) {
              session.user_id = res.pkg.data._id;
              $scope.session.get(function (err, session) {
                $scope.auth.setUser(res.pkg.data);
                $rootScope.$broadcast('kurrencyRegistered', res.pkg.data);
                return cb(null, res.pkg.data);
              }, true);
            });
          };
          auth.prototype.login = function (username, password, cb) {
            var req = new Request($scope).post($scope.options.baseUrl + '/login', {
                username: username,
                password: password
              }, $scope.handleError);
            req.success(function (res) {
              $scope.session.get(function (err, session) {
                $scope.auth.setUser(res.pkg.data);
                $rootScope.$broadcast('kurrencySignIn', res.pkg.data);
                return cb(null, res.pkg.data);
              }, true);
            });
          };
          auth.prototype.forgotPassword = function (email, cb) {
            var req = new Request($scope).post($scope.options.baseUrl + '/forgot-password', { email: email }, $scope.handleError);
            req.success(function (res) {
              $rootScope.$broadcast('kurrencyForgotPassword', res);
              return cb(null, res);
            });
          };
          auth.prototype.signOut = function () {
            storage.remove('session');
            storage.remove('user');
            $scope.options.session = null;
            $scope.options.user = null;
            $rootScope.$broadcast('kurrencySignOut', true);
          };
          auth.prototype.loggedIn = function () {
            return storage.get('user');
          };
          auth.prototype.setUser = function (user) {
            storage.set('user', user);
            $scope.options.user = user;
            return user;
          };
          /*
           *
           * Address methods
           *
           */
          function addresses(options) {
            if (options) {
              $scope.config(options);
            }
          }
          addresses.prototype.list = function (cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).get($scope.options.baseUrl + '/addresses', null, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          addresses.prototype.create = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).post($scope.options.baseUrl + '/addresses', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          addresses.prototype.edit = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).put($scope.options.baseUrl + '/addresses', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          addresses.prototype.remove = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).del($scope.options.baseUrl + '/addresses', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          /*
           *
           * Payments methods
           *
           */
          function payment_methods(options) {
            if (options) {
              $scope.config(options);
            }
          }
          payment_methods.prototype.list = function (cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).get($scope.options.baseUrl + '/transaction-accounts', null, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.create = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).post($scope.options.baseUrl + '/transaction-accounts', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.edit = function (data, cb) {
            // User can edit the nickname
            $scope.session.get(function (err, session) {
              var req = new Request($scope).put($scope.options.baseUrl + '/transaction-accounts', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.remove = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).del($scope.options.baseUrl + '/transaction-accounts', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          /*
           *
           * Product methods
           *
           */
          function products(options) {
            if (options) {
              $scope.config(options);
            }
          }
          products.prototype.list = function (options, cb) {
            $scope.session.get(function (err, session) {
              var stringOptions = JSON.stringify(options);
              if (cache.products[stringOptions]) {
                return cb(null, cache.products[stringOptions]);
              }
              var req = new Request($scope).get($scope.options.baseUrl + '/products', options, $scope.handleError);
              req.success(function (res) {
                if ($scope.options.caching === true) {
                  cache.products[stringOptions] = res.pkg.data;
                }
                return cb(null, res.pkg.data);
              });
            });
          };
          products.prototype.total = function (options, cb) {
            $scope.session.get(function (err, session) {
              var stringOptions = JSON.stringify(options);
              var req = new Request($scope).post($scope.options.baseUrl + '/products/total', options, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          /*
           *
           * Product Line methods
           *
           */
          function product_lines(options) {
            if (options) {
              $scope.config(options);
            }
          }
          product_lines.prototype.list = function (options, cb) {
            $scope.session.get(function (err, session) {
              var stringOptions = JSON.stringify(options);
              if (cache.product_lines[stringOptions]) {
                return cb(null, cache.product_lines[stringOptions]);
              }
              var req = new Request($scope).get($scope.options.baseUrl + '/product-lines', options, $scope.handleError);
              req.success(function (res) {
                if ($scope.options.caching === true) {
                  cache.product_lines[stringOptions] = res.pkg.data;
                }
                return cb(null, res.pkg.data);
              });
            });
          };
          product_lines.prototype.total = function (options, cb) {
            $scope.session.get(function (err, session) {
              var stringOptions = JSON.stringify(options);
              var req = new Request($scope).post($scope.options.baseUrl + '/product-lines/total', options, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          /*
           *
           * Order methods
           *
           */
          function orders(options) {
            if (options) {
              $scope.config(options);
            }
          }
          orders.prototype.list = function (options, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).get($scope.options.baseUrl + '/orders', options, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          orders.prototype.create = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).post($scope.options.baseUrl + '/orders', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          orders.prototype.taxes = function (value, shipment, cb) {
            var params = {
                value: value,
                ship_to: shipment.ship_to
              };
            $scope.session.get(function (err, session) {
              if (err) {
                return cb(err, null);
              }
              var req = new Request($scope).post($scope.options.baseUrl + '/orders/taxes', params, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          /*
           *
           * Shipping methods
           *
           */
          function shipping(options) {
            if (options) {
              $scope.config(options);
            }
          }
          function getProductWeight(p) {
            var weight = p.weight;
            if (!p.variants) {
              p.variants = [];
            }
            for (var i = 0; i < p.variants.length; i++) {
              if (p.variants[i].weight && p.variants[i].weight.length > 0) {
                weight += parseInt(p.variants[i].weight, 10);
              }
            }
            return weight;
          }
          function getProductPrice(p) {
            var price = p.price;
            if (!p.variants) {
              p.variants = [];
            }
            for (var i = 0; i < p.variants.length; i++) {
              if (p.variants[i].price && p.variants[i].price > 0) {
                price += parseInt(p.variants[i].price, 10);
              }
            }
            return price;
          }
          shipping.prototype.rates = function (data, cb) {
            if (!data.products) {
              return cb(new Error('Missing products'), null);
            }
            var params = w[KURRENCY_CONFIG.ANGULAR].copy(data);
            delete params.products;
            params.packages = [{
                weight: 0,
                price: 0
              }];
            params.products = [];
            for (var i = 0; i < data.products.length; i++) {
              params.packages[0].weight += getProductWeight(data.products[i]) * data.products[i].qty;
              params.packages[0].price += getProductPrice(data.products[i]) * data.products[i].qty;
              params.products.push({
                _id: data.products[i]._id,
                qty: data.products[i].qty
              });
            }
            $scope.session.get(function (err, session) {
              var req = new Request($scope).post($scope.options.baseUrl + '/shipping/rates', params, $scope.handleError);
              req.success(function (res) {
                var rates = res.pkg.data;
                rates.sort(function (a, b) {
                  return a.cost - b.cost;
                });
                return cb(null, rates);
              });
            });
          };
          /*
           *
           * Shipment Model
           *
           */
          function shipment(options) {
            var $scope = this;
            $scope.rate = null;
            $scope.ship_to = {
              name: undefined,
              company_name: undefined,
              attention_to: undefined,
              email: undefined,
              phone: undefined,
              address: {
                address_1: undefined,
                address_2: undefined,
                address_3: undefined,
                city: undefined,
                postal_code: undefined,
                state_code: undefined,
                country_code: 'US'
              }
            };
            $scope.setRate = function (r) {
              $scope.rate = r;
              return $scope;
            };
            $scope.setShipTo = function (ship_to) {
              $scope.ship_to.name = ship_to.name;
              $scope.ship_to.company_name = ship_to.company_name;
              $scope.ship_to.attention_to = ship_to.attention_to;
              $scope.ship_to.email = ship_to.email;
              $scope.ship_to.phone = ship_to.phone;
              if (ship_to.address) {
                $scope.ship_to.address = ship_to.address;
              }
              return $scope;
            };
            $scope.setAddress = function (address) {
              $scope.ship_to.address = address;
            };
            $scope = w[KURRENCY_CONFIG.ANGULAR].extend($scope, options);
            return $scope;
          }
          /*
           *
           * Customer Model
           *
           */
          function customer(options) {
            var $scope = this;
            $scope._id = undefined;
            $scope.ship_to = {
              name: undefined,
              company_name: undefined,
              attention_to: undefined,
              email: undefined,
              phone: undefined,
              address: {
                address_1: undefined,
                address_2: undefined,
                address_3: undefined,
                city: undefined,
                postal_code: undefined,
                state_code: undefined,
                country_code: 'US'
              }
            };
            $scope.setShipTo = function (ship_to) {
              $scope.ship_to.name = ship_to.name;
              $scope.ship_to.company_name = ship_to.company_name;
              $scope.ship_to.attention_to = ship_to.attention_to;
              $scope.ship_to.email = ship_to.email;
              $scope.ship_to.phone = ship_to.phone;
              if (ship_to.address) {
                $scope.ship_to.address = ship_to.address;
              }
              return $scope;
            };
            $scope.setAddress = function (address) {
              $scope.ship_to.address = address;
            };
            $scope = w[KURRENCY_CONFIG.ANGULAR].extend($scope, options);
            return $scope;
          }
          /*
           *
           * Payment Method Model
           *
           */
          function payment_method(options) {
            var $scope = this;
            $scope.type = 'credit_card';
            $scope.card = {};
            $scope.bank_account = {};
            $scope = w[KURRENCY_CONFIG.ANGULAR].extend($scope, options);
            return $scope;
          }
          /*
           *
           * Credit Card Model, extends Payment Method
           *
           */
          function credit_card(options) {
            var $scope = new payment_method({ type: 'credit_card' });
            $scope._id = undefined;
            $scope.card_token = null;
            $scope = w[KURRENCY_CONFIG.ANGULAR].extend($scope, options);
            /*
             * Tokenize a card in Stripe/Balanced
             *
             *
             */
            $scope.tokenizeCard = function (card_data, key) {
              Stripe.setPublishableKey(key);
              var defer = $q.defer();
              Stripe.card.createToken({
                name: card_data.name,
                number: card_data.number,
                cvc: card_data.cvc,
                exp_month: card_data.exp_month,
                exp_year: card_data.exp_year,
                address_zip: card_data.address_zip
              }, function (status, resp) {
                if (resp.error) {
                  return defer.reject(resp.error);
                }
                $scope.card_token = resp.id;
                defer.resolve(resp.id);
              });
              return defer.promise;
            };
            return $scope;
          }
          /*
           *
           * Bank Account Model, extends Payment Method
           *
           */
          function bank_account(options) {
            var $scope = new payment_method({ type: 'bank_account' });
            $scope._id = undefined;
            $scope.bank_account.name = undefined;
            $scope.bank_account.account_number = undefined;
            $scope.bank_account.routing_number = undefined;
            $scope.bank_account.type = 'checking';
            $scope = w[KURRENCY_CONFIG.ANGULAR].extend($scope, options);
            return $scope;
          }
          $scope.session = new session();
          $scope.cart = new cart();
          $scope.auth = new auth();
          $scope.addresses = new addresses();
          $scope.payment_methods = new payment_methods();
          $scope.products = new products();
          $scope.product_lines = new product_lines();
          $scope.orders = new orders();
          $scope.shipping = new shipping();
          $scope.shipment = shipment;
          $scope.customer = customer;
          $scope.credit_card = credit_card;
          $scope.bank_account = bank_account;
          return $scope.config(opts);
        };
        return new Kurrency(kurrencyConfig);
      }
    ]).config(function ($sceProvider) {
      $sceProvider.enabled(false);
    }).factory('kurrencyMenuService', [
      'kurrency',
      'kurrencyConfig',
      '$rootScope',
      '$filter',
      function (kurrency, kurrencyConfig, $rootScope, $filter) {
        var $scope = this;
        $scope.menu = [];
        $scope.cart = [];
        $scope.sidebars = [];
        $scope.showing = null;
        $scope.back = null;
        $scope.next = null;
        kurrency.cart.get(function (err, cart) {
          $scope.cart = cart;
        });
        $rootScope.$on('cartUpdated', function (evt, cart) {
          $scope.cart = cart;
        });
        $scope.close = function () {
          $scope.showing = null;
          $rootScope.$broadcast('menuClosed', true);
        };
        $scope.toggle = function (val, back, next) {
          if ($scope.showing === val) {
            $scope.showing = null;
          } else {
            $scope.showing = val;
          }
          if (back) {
            $scope.back = back;
          } else {
            $scope.back = null;
          }
          if (next) {
            $scope.next = next;
          } else {
            $scope.next = null;
          }
          $rootScope.$broadcast('menuToggled', {
            val: val,
            back: back,
            next: next
          });
        };
        $scope.show = function (val) {
          return val === $scope.showing;
        };
        $scope.addMenuItem = function (item, position) {
          if (!position) {
            position = $scope.menu.length;
          }
          var defaults = {
              name: null,
              tag: null,
              uri: null,
              buttonTemplateUrl: 'kurrency-templates/menu/button.html',
              showLoggedIn: false,
              showLoggedOut: false,
              onClick: null
            };
          item = w[KURRENCY_CONFIG.ANGULAR].extend({}, defaults, item);
          $scope.menu.splice(position, 0, item);
          return $scope;
        };
        $scope.addSidebar = function (item) {
          var defaults = {
              tag: null,
              className: null,
              templateUrl: null
            };
          item = w[KURRENCY_CONFIG.ANGULAR].extend({}, defaults, item);
          $scope.sidebars.push(item);
          return $scope;
        };
        $scope.getUri = function (item) {
          if (item.uri && item.uri.length > 0) {
            return item.uri;
          }
          return null;
        };
        $scope.addToCart = function (product, qty, variants) {
          if (variants && variants.length) {
            product.variants = variants;
          }
          kurrency.cart.add(product, qty, function (err, cart) {
            if (err) {
              $rootScope.$emit('cartError', err);
              return console.log(err);
            }
            $rootScope.$emit('cartUpdated', cart);
          });
        };
        $scope.getPrice = function (product) {
          if (!product) {
            return 'N/A';
          }
          var p = product.price;
          if (!product.variants) {
            return $filter('currency')(p / 100);
          }
          for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].price) {
              p += parseInt(product.variants[i].price, 10);
            }
          }
          return $filter('currency')(p / 100);
        };
        $scope.setVariant = function (product, name, value) {
          if (!product.variants) {
            product.variants = [];
          }
          for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].name === name) {
              if (value === null) {
                product.variants.splice(i, 1);
                return;
              }
              product.variants[i].value = value.name;
              product.variants[i].price = value.price;
              product.variants[i].weight = value.weight;
              return product;
            }
          }
          product.variants.push({
            name: name,
            value: value.name,
            price: value.price,
            weight: value.weight
          });
          return product;
        };
        $scope.setMultiVariant = function (product, name, option) {
          if (!product.variants) {
            product.variants = [];
          }
          for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].name === name && product.variants[i].value === option.name) {
              product.variants.splice(i, 1);
              return;
            }
          }
          product.variants.push({
            name: name,
            value: option.name,
            price: option.price,
            weight: option.weight
          });
          return product;
        };
        $scope.checkShowing = function (item) {
          var loggedIn = kurrency.auth.loggedIn();
          if (loggedIn && item.showLoggedIn) {
            return true;
          }
          if (!loggedIn && item.showLoggedOut) {
            return true;
          }
          return false;
        };
        $scope.clearMenu = function () {
          $scope.menu = [];
          return $scope;
        };
        $scope.clearSidebar = function () {
          $scope.sidebars = [];
          return $scope;
        };
        $scope.checkClass = function (c) {
          if ($scope.showing === c) {
            return { active: true };
          }
          return '';
        };
        $scope.checkButtonClass = function (item) {
          if (item.tag === 'cart') {
            if (!$scope.cart || !$scope.cart.length) {
              return {
                cart: true,
                'cart-empty': true
              };
            }
            return {
              cart: true,
              'cart-empty': $scope.cart.length <= 0
            };
          } else {
            var obj = {};
            obj[item.tag] = true;
            return obj;
          }
        };
        $scope.addSidebar({
          tag: 'login',
          className: 'kurrency-login',
          templateUrl: 'kurrency-templates/menu/sign-in.html'
        }).addSidebar({
          tag: 'account',
          className: 'kurrency-account',
          templateUrl: 'kurrency-templates/menu/account.html'
        }).addSidebar({
          tag: 'cart',
          className: 'kurrency-cart',
          templateUrl: 'kurrency-templates/menu/cart.html'
        }).addSidebar({
          tag: 'checkout',
          className: 'kurrency-checkout',
          templateUrl: 'kurrency-templates/menu/checkout.html'
        }).addSidebar({
          tag: 'checkout-2',
          className: 'kurrency-checkout',
          templateUrl: 'kurrency-templates/menu/checkout-2.html'
        }).addSidebar({
          tag: 'checkout-3',
          className: 'kurrency-checkout',
          templateUrl: 'kurrency-templates/menu/checkout-3.html'
        }).addSidebar({
          tag: 'checkout-complete',
          className: 'kurrency-checkout',
          templateUrl: 'kurrency-templates/menu/checkout-complete.html'
        }).addSidebar({
          tag: 'forgot-password',
          className: 'kurrency-forgot-password',
          templateUrl: 'kurrency-templates/menu/forgot-password.html'
        }).addSidebar({
          tag: 'register',
          className: 'kurrency-register',
          templateUrl: 'kurrency-templates/menu/register.html'
        });
        /*
         $scope.addSidebar({
           tag: 'wishlist',
           className: 'kurrency-wishlist',
           templateUrl: 'kurrency-templates/menu/wishlist.html'
         }).addSidebar({
           tag: 'contact',
           className: 'kurrency-contact',
           templateUrl: 'kurrency-templates/menu/contact.html'
         });
        */
        $scope.addMenuItem({
          name: 'Sign In',
          tag: 'login',
          icon: 'kicon-login',
          template: 'kurrency-templates/menu/sign-in.html',
          showLoggedIn: false,
          showLoggedOut: true
        }).addMenuItem({
          name: 'Account',
          tag: 'account',
          icon: 'kicon-account',
          template: 'kurrency-templates/menu/account.html',
          showLoggedIn: true,
          showLoggedOut: false
        }).addMenuItem({
          name: 'Shopping Cart',
          tag: 'cart',
          buttonTemplateUrl: 'kurrency-templates/menu/button-cart.html',
          template: 'kurrency-templates/menu/cart.html',
          showLoggedIn: true,
          showLoggedOut: true
        });
        //Wishlist
        /*
         kurrencyMenuService.addMenuItem({
         name: 'Wishlist',
         tag: 'wishlist',
         icon: 'kicon-wishlist',
         template: 'kurrency-templates/menu/wishlist.html',
         showLoggedIn: true,
         showLoggedOut: true
         });
         */
        //Contact
        /*
         kurrencyMenuService.addMenuItem({
         name: 'Contact',
         tag: 'contact',
         icon: 'kicon-contact',
         template: 'kurrency-templates/menu/contact.html',
         showLoggedIn: true,
         showLoggedOut: true
         });
         */
        $scope.addMenuItem({
          name: 'Sign Out',
          tag: 'sign-out',
          icon: 'kicon-sign_out',
          onClick: function (evt) {
            kurrency.auth.signOut();
          },
          showLoggedIn: true,
          showLoggedOut: false
        });
        return $scope;
      }
    ]).directive('kurrencyPopover', function () {
      return {
        scope: {
          kurrencyPopover: '=',
          showing: '@'
        },
        restrict: 'A',
        transclude: true,
        templateUrl: function (tElement, tAttrs) {
          var url = 'kurrency-templates/kurrency-popover.html';
          if (tAttrs.templateUrl) {
            url = tAttrs.templateUrl;
          }
          return url;
        },
        link: function (scope, element, attr) {
          var popover = w[KURRENCY_CONFIG.ANGULAR].element(element[0].querySelector('.kurrency-popover'));
          element.bind('mouseover', function (evt) {
            scope.showing = true;
            scope.$apply();
          });
          element.bind('mouseout', function (evt) {
            scope.showing = false;
            scope.$apply();
          });
          scope.$watch(function () {
            return scope.showing;
          }, function () {
            scope.showing = scope.showing === 'true' || scope.showing === true;
            if (scope.showing === true) {
              popover.addClass('active');
            } else {
              popover.removeClass('active');
            }
          }, true);
        }
      };
    }).directive('kurrencyImage', [
      'kurrency',
      'kurrencyConfig',
      '$parse',
      function (kurrency, kurrencyConfig, $parse) {
        return {
          restrict: 'E',
          scope: {
            src: '=',
            options: '=?',
            alt: '='
          },
          template: '<img ng-src="{{newSrc}}" alt="{{alt}}">',
          link: function (scope, element, attr) {
            scope.newSrc = null;
            scope.$watch(function () {
              return scope.src;
            }, function () {
              if (!scope.src) {
                return;
              }
              scope.newSrc = buildUrl(scope.src, scope.options);
            });
            function buildUrl(src, options) {
              var base = kurrencyConfig.local ? kurrency.baseUrls.test : kurrency.baseUrls.production;
              var url = base + '/imager?access-token=' + kurrencyConfig.accessToken + '&url=' + encodeURIComponent(src);
              if (options.size) {
                url += '&size=' + options.size;
              }
              if (options.effect) {
                url += '&effect=' + options.effect;
              }
              if (options.force) {
                url += '&force=true';
              }
              return url;
            }
          }
        };
      }
    ]).directive('kurrencyProduct', [
      'kurrency',
      'kurrencyConfig',
      'kurrencyMenuService',
      '$filter',
      function (kurrency, kurrencyConfig, kurrencyMenuService, $filter) {
        return {
          restrict: 'E',
          scope: { id: '=' },
          templateUrl: function (tElement, tAttrs) {
            var url = 'kurrency-templates/kurrency-product.html';
            if (tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }
            return url;
          },
          replace: true,
          link: function (scope, element, attr) {
            scope.kurrency = kurrency;
            scope.config = kurrencyConfig;
            scope.product = {};
            scope.kurrencyMenuService = kurrencyMenuService;
            kurrency.products.list({ _id: scope.id }, function (err, products) {
              scope.product = products[0];
              if (scope.product.attributes && scope.product.attributes.length) {
                for (var i = 0; i < scope.product.attributes.length; i++) {
                  if (scope.product.attributes[i].type === 'select') {
                    scope.product.attributes[i].$selected = null;
                  } else if (scope.product.attributes[i].type === 'multi') {
                    scope.product.attributes[i].$selected = [];
                  }
                  if (scope.product.attributes[i].required) {
                    if (!scope.product.attributes[i].default) {
                      scope.product.attributes[i].$selected = scope.product.attributes[i].options[0];
                      scope.product = kurrencyMenuService.setVariant(scope.product, scope.product.attributes[i].name, scope.product.attributes[i].options[0]);
                    } else {
                      for (var j = 0; j < scope.product.attributes[i].options.length; j++) {
                        if (scope.product.attributes[i].options[j].name === scope.product.attributes[i].default) {
                          scope.product.attributes[i].$selected = scope.product.attributes[i].options[j];
                          scope.product = kurrencyMenuService.setVariant(scope.product, scope.product.attributes[i].name, scope.product.attributes[i].options[j]);
                        }
                      }
                    }
                  } else {
                    for (var j = 0; j < scope.product.attributes[i].options.length; j++) {
                      if (scope.product.attributes[i].options[j].name === scope.product.attributes[i].default) {
                        scope.product.attributes[i].$selected = scope.product.attributes[i].options[j];
                        scope.product = kurrencyMenuService.setVariant(scope.product, scope.product.attributes[i].name, scope.product.attributes[i].options[j]);
                      }
                    }
                  }
                }
              }
            });
            scope.variantDisplay = function (v) {
              var out = v.name;
              if (!kurrencyConfig.display_price_breakdown) {
                return out;
              }
              if (v.price) {
                out += ' ' + (v.price > 0 ? 'add ' : 'subtract ') + $filter('currency')(v.price / 100);
              }
              return out;
            };
          }
        };
      }
    ]).directive('kurrencyMenu', [
      'kurrency',
      'kurrencyConfig',
      'kurrencyMenuService',
      '$timeout',
      '$window',
      '$document',
      '$rootScope',
      '$filter',
      function (kurrency, kurrencyConfig, kurrencyMenuService, $timeout, $window, $document, $rootScope, $filter) {
        return {
          restrict: 'E',
          templateUrl: function (tElement, tAttrs) {
            var url = 'kurrency-templates/kurrency-menu.html';
            if (tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }
            return url;
          },
          replace: true,
          link: function (scope, element, attr) {
            scope.config = kurrencyConfig;
            scope.menuService = kurrencyMenuService;
            scope.cart = null;
            scope.wishlist = null;
            scope.apiLoading = 0;
            scope.product_total = 0;
            scope.quantity_total = 0;
            scope.paymentEnabled = false;
            scope.requiresShipping = false;
            scope.requiresTax = false;
            scope.addressList = [];
            scope.paymentMethodList = [];
            scope.checkout = {
              service_carrier: null,
              service_code: null,
              shipment: new kurrency.customer(),
              billing: new kurrency.customer(),
              payment_method: new kurrency.credit_card(),
              products: null,
              notes: ''
            };
            scope.geocodeComplete = false;
            scope.stateList = kurrencyConfig.states;
            scope.countryList = kurrencyConfig.countries;
            scope.expirationMonths = kurrencyConfig.months;
            scope.expirationYears = kurrencyConfig.years;
            scope.shippingAddressCopied = false;
            scope.packages = [];
            scope.selectedRate = null;
            scope.tax_total = 0;
            scope.shipping_total = 0;
            scope.final_total = 0;
            scope.cartAddText = kurrencyConfig.cartAddText ? kurrencyConfig.cartAddText : 'Added to cart';
            scope.shoppingCartPopoverText = 'Shopping Cart';
            scope.cartAddActive = false;
            scope.order = null;
            // load Gmaps if it isn't on the page
            if (!$window.google) {
              var check = $document[0].getElementsByTagName('script');
              var found = false;
              for (var i = 0; i < check.length; i++) {
                if (check[i].src.indexOf('maps.googleapis') > -1) {
                  found = true;
                }
              }
              if (!found) {
                var gscript = d.createElement('script');
                gscript.type = 'text/javascript';
                gscript.async = true;
                gscript.src = '//maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDfl3BRqXwFWerx20m00Hec6mSFyL42w0Y&callback=initialize';
                d.getElementsByTagName('body')[0].appendChild(gscript);
              }
            }
            scope.messages = {
              none: [],
              login: [],
              'forgot-password': [],
              register: [],
              checkout: [],
              'checkout-2': [],
              'checkout-3': [],
              wishlist: [],
              contact: [],
              account: []
            };
            scope.kurrency = kurrency;
            scope.updateProductTotal = function () {
              scope.product_total = 0;
              scope.quantity_total = 0;
              var line_total;
              for (var i = 0; i < scope.cart.length; i++) {
                if (scope.cart[i].requires_shipping) {
                  scope.requiresShipping = true;
                }
                if (scope.cart[i].taxable) {
                  scope.requiresTax = true;
                }
                scope.quantity_total += parseInt(scope.cart[i].qty, 10);
                line_total = parseInt(scope.cart[i].qty, 10) * scope.getProductPrice(scope.cart[i]);
                scope.product_total += line_total;
              }
            };
            scope.getProductPrice = function (product) {
              var p = product.price;
              if (!product.variants) {
                return p;
              }
              for (var i = 0; i < product.variants.length; i++) {
                if (product.variants[i].price) {
                  p += parseInt(product.variants[i].price, 10);
                }
              }
              return p;
            };
            kurrency.cart.get(function (err, cart) {
              scope.cart = cart;
              scope.updateProductTotal();
            });
            scope.updateFinalTotal = function () {
              scope.final_total = scope.product_total + scope.shipping_total + scope.tax_total;
            };
            scope.$on('cartUpdated', function (evt, cart) {
              var tmp = scope.shoppingCartPopoverText;
              scope.shoppingCartPopoverText = scope.cartAddText;
              scope.cartAddActive = true;
              (function (tmp) {
                $timeout(function () {
                  scope.shoppingCartPopoverText = tmp;
                  scope.cartAddActive = false;
                }, 3000);
                scope.cart = cart;
                scope.updateProductTotal();
                scope.updateFinalTotal();
              }(tmp));
            });
            scope.updateQuantity = function (product) {
              scope.updateProductTotal();
              kurrency.cart.update(product, product.qty, function (err, cart) {
                scope.cart = cart;
              });
            };
            scope.removeProduct = function (product) {
              kurrency.cart.remove(product, function (err, cart) {
                scope.cart = cart;
                scope.updateProductTotal();
              });
            };
            scope.saveAddress = function (address) {
              scope.wipeMessages();
              var user = kurrency.auth.loggedIn();
              if (!user) {
                return;
              }
              if (address._id) {
                kurrency.addresses.edit(address, function (err, address) {
                  scope.getUserDetails();
                });
              }
              kurrency.addresses.create(address, function (err, address) {
                scope.getUserDetails();
              });
            };
            scope.deleteAddress = function (address) {
              kurrency.addresses.remove({ _id: address._id }, function (err, status) {
                if (err) {
                  return console.log(err);
                }
                scope.getUserDetails();
              });
            };
            scope.savePaymentMethod = function (payment_method) {
              scope.wipeMessages();
              var user = kurrency.auth.loggedIn();
              if (!user) {
                return;
              }
              if (payment_method._id) {
                kurrency.payment_methods.edit(payment_method, function (err, address) {
                  scope.getUserDetails();
                });
              }
            };
            scope.getPaymentMethodType = function (payment_method) {
              if (payment_method.type === 'credit_card') {
                return 'Credit Card';
              } else if (payment_method.type === 'bank_account') {
                return 'Bank Account';
              } else if (payment_method.type === 'credit_line') {
                return 'Credit Line';
              }
            };
            scope.deletePaymentMethod = function (payment_method) {
              kurrency.payment_methods.remove({ _id: payment_method._id }, function (err, status) {
                if (err) {
                  return console.log(err);
                }
                scope.getUserDetails();
              });
            };
            scope.copyShippingAddress = function () {
              scope.checkout.billing.ship_to = w[KURRENCY_CONFIG.ANGULAR].extend(scope.checkout.billing.ship_to, scope.checkout.shipment.ship_to);
              scope.shippingAddressCopied = true;
            };
            scope.lookupGeoCode = function (address, postal_code, obj) {
              if (!postal_code || postal_code.length < 5) {
                return;
              }
              if (!$window.google) {
                return scope.geocodeComplete = true;
              }
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode({ address: address + ' ' + postal_code }, function (res, status) {
                if (status !== google.maps.GeocoderStatus.OK) {
                  return scope.geocodeComplete = true;
                }
                for (var i = 0; i < res[0].address_components.length; i++) {
                  var part = res[0].address_components[i];
                  if (part.types[0] === 'locality') {
                    obj.ship_to.address.city = part.long_name;
                  }
                  if (part.types[0] === 'administrative_area_level_1') {
                    obj.ship_to.address.state_code = part.short_name;
                  }
                  if (part.types[0] === 'country') {
                    obj.ship_to.country_code = part.short_name;
                  }
                }
                scope.geocodeComplete = true;
                scope.$apply();
              });
            };
            scope.getTaxes = function () {
              if (!scope.requiresTax) {
                scope.tax_total = 0;
                return scope.updateFinalTotal();
              }
              kurrency.orders.taxes(scope.product_total, { ship_to: { address: { postal_code: scope.checkout.shipment.ship_to.address.postal_code } } }, function (err, tax) {
                scope.tax_total = tax;
                scope.updateFinalTotal();
              });
            };
            scope.getRates = function () {
              if (!scope.checkout.shipment.ship_to.address.postal_code || scope.checkout.shipment.ship_to.address.postal_code.length < 5) {
                return;
              }
              kurrency.shipping.rates({
                ship_to: {
                  address: {
                    address_1: scope.checkout.shipment.ship_to.address.address_1,
                    state_code: scope.checkout.shipment.ship_to.address.state_code,
                    country_code: scope.checkout.shipment.ship_to.address.country_code,
                    postal_code: scope.checkout.shipment.ship_to.address.postal_code
                  }
                },
                products: scope.cart
              }, function (err, packages) {
                if (err) {
                  return console.log(err);
                }
                if (!(packages instanceof Array)) {
                  packages = [].push({ rates: packages });
                }
                scope.packages = packages;
                scope.selectedRate = scope.packages[0].rates[0];
                scope.updateFinalTotal();
              });
            };
            scope.getUserDetails = function () {
              var user = kurrency.auth.loggedIn();
              if (!user) {
                return;
              }
              scope.checkout.shipment.ship_to.name = user.first_name + ' ' + user.last_name;
              scope.checkout.shipment.ship_to.email = user.email;
              scope.checkout.shipment.ship_to.phone = user.phone;
              kurrency.addresses.list(function (err, addresses) {
                if (!addresses.length) {
                  return;
                }
                scope.addressList = addresses;
                scope.checkout.shipment.ship_to = addresses[0];
                scope.geocodeComplete = true;
              });
              kurrency.payment_methods.list(function (err, payment_methods) {
                scope.paymentMethodList = payment_methods;
              });
            };
            scope.changedAddress = function (address) {
              scope.geocodeComplete = true;
            };
            scope.$on('kurrencySignIn', function (evt, user) {
              scope.getUserDetails();
            });
            if (kurrency.auth.loggedIn()) {
              scope.getUserDetails();
            }
            scope.$on('kurrencyRegistered', function (evt, user) {
              scope.getUserDetails();
            });
            scope.$watch('selectedRate', function () {
              if (!scope.selectedRate) {
                return;
              }
              scope.shipping_total = scope.selectedRate.cost * 100;
              scope.checkout.service_carrier = scope.selectedRate.carrier;
              scope.checkout.service_code = scope.selectedRate.code;
              scope.updateFinalTotal();
            }, true);
            scope.completeOrder = function () {
              if (scope.apiLoading > 0) {
                scope.addMessage('error', 'Please wait, we are processing your order');
                return;
              }
              if (!scope.checkout.payment_method._id) {
                new kurrency.credit_card().tokenizeCard({
                  name: scope.checkout.payment_method.card.name,
                  number: scope.checkout.payment_method.card.card_number,
                  exp_month: scope.checkout.payment_method.card.expiration_month,
                  exp_year: scope.checkout.payment_method.card.expiration_year,
                  cvc: scope.checkout.payment_method.card.security_code,
                  address_zip: scope.checkout.billing.ship_to.postal_code
                }, kurrency.options.session.stripe_publishable_key).then(function (card_id) {
                  scope.finishCompleteOrder({
                    type: 'credit_card',
                    card: { card_token: card_id }
                  });
                }).catch(function (err) {
                  scope.addMessage('error', err);
                });
              } else {
                scope.finishCompleteOrder(scope.checkout.payment_method);
              }
            };
            scope.finishCompleteOrder = function (payment) {
              kurrency.orders.create({
                service_carrier: scope.checkout.service_carrier,
                service_code: scope.checkout.service_code,
                ship_to: scope.checkout.shipment.ship_to,
                customer: scope.checkout.billing.ship_to,
                payment_method: payment,
                products: w[KURRENCY_CONFIG.ANGULAR].copy(scope.cart),
                notes: ''
              }, function (err, order) {
                if (err) {
                  scope.addMessage('error', err);
                }
                scope.order = order;
                kurrency.cart.empty(function (err, cart) {
                  scope.cart = cart;
                  $rootScope.$emit('cartUpdated', cart);
                  kurrencyMenuService.toggle('checkout-complete');
                });
              });
            };
            scope.addMessage = function (type, msg) {
              var section = kurrencyMenuService.showing;
              if (!section) {
                section = 'none';
              }
              scope.messages[section].push({
                type: type,
                message: msg
              });  //$timeout(function() {
                   //  scope.messages[section].pop();
                   //}, 5000);
            };
            scope.wipeMessages = function () {
              for (var i in scope.messages) {
                scope.messages[i] = [];
              }
            };
            scope.resetForms = function () {
              scope.login = {
                username: null,
                password: null
              };
              scope.register = {
                first_name: null,
                last_name: null,
                email: null,
                password: null
              };
              scope.forgot = { email: null };
              scope.contact = {
                name: null,
                email: null,
                phone: null,
                message: null
              };
            };
            scope.loginUser = function (section) {
              scope.wipeMessages();
              kurrency.auth.login(scope.login.username, scope.login.password, function (user) {
                scope.addMessage('success', 'Successfully logged in');
                $timeout(function () {
                  if (kurrencyMenuService.next) {
                    kurrencyMenuService.toggle(kurrencyMenuService.next);
                  } else {
                    if (section) {
                      kurrencyMenuService.showing = section;
                    } else {
                      kurrencyMenuService.showing = null;
                    }
                  }
                  scope.wipeMessages();
                }, 500);
              });
            };
            scope.registerUser = function (section) {
              scope.wipeMessages();
              scope.register.confirm_password = scope.register.password;
              kurrency.auth.register(scope.register, function (user) {
                scope.addMessage('success', 'Account registered, and logged in');
                $timeout(function () {
                  if (kurrencyMenuService.next) {
                    kurrencyMenuService.toggle(kurrencyMenuService.next);
                  } else {
                    if (section) {
                      kurrencyMenuService.showing = section;
                    } else {
                      kurrencyMenuService.showing = null;
                    }
                  }
                  scope.wipeMessages();
                }, 500);
              });
            };
            scope.forgotPassword = function () {
              scope.wipeMessages();
              kurrency.auth.forgotPassword(scope.forgot.email, function (res) {
                scope.addMessage('success', 'Instructions sent to your email, go check it');
              });
            };
            scope.$on('kurrencyError', function (evt, res) {
              console.log(res);
              if (!res.pkg) {
                return scope.addMessage('error', 'An error occurred connecting to Kurrency\'s servers, check your connection.');
              }
              scope.addMessage('error', res.pkg.statusMessage);
            });
            scope.$on('kurrencySignOut', function (evt) {
              kurrencyMenuService.showing = null;
              scope.paymentMethodList = [];
              scope.addressList = [];
              kurrency.cart.get(function (err, cart) {
                scope.cart = cart;
                scope.updateProductTotal();
              });
              scope.checkout = {
                service_carrier: null,
                service_code: null,
                shipment: new kurrency.customer(),
                billing: new kurrency.customer(),
                payment_method: new kurrency.credit_card(),
                products: null,
                notes: ''
              };
            });
            scope.$on('apiLoading', function (evt, val) {
              if (val === true) {
                scope.apiLoading++;
              } else if (scope.apiLoading > 0) {
                scope.apiLoading--;
              }
            });
            scope.$on('menuToggled', function (evt, data) {
              scope.wipeMessages();
              scope.resetForms();
              if (data.val === 'checkout-3') {
                scope.getRates();
                scope.getTaxes();
              }
            });
            scope.displayProductPrice = function (p) {
              if (!kurrencyConfig.display_price_breakdown) {
                return kurrencyMenuService.getPrice(p);
              }
              return $filter('currency')(p.price / 100);
            };
            scope.displayVariantPrice = function (v) {
              if (!kurrencyConfig.display_price_breakdown) {
                return '&nbsp;';
              }
              return $filter('currency')(v.price / 100);
            };
            scope.resetForms();
          }
        };
      }
    ]);
    if (w.KURRENCY_CONFIG) {
      // we are using kurrency from an embed standpoint
      if (!w.KURRENCY_CONFIG.integrated) {
        w[KURRENCY_CONFIG.ANGULAR].injector([
          'ng',
          'KurrencyApp'
        ]).invoke([
          '$compile',
          '$rootScope',
          'kurrency',
          'kurrencyConfig',
          'kurrencyMenuService',
          function ($compile, $rootScope, kurrency, kurrencyConfig, kurrencyMenuService) {
            kurrencyConfig.cache = w.KURRENCY_CONFIG.CACHE ? w.KURRENCY_CONFIG.CACHE : true;
            kurrencyConfig.accessToken = w.KURRENCY_CONFIG.ACCESS_TOKEN;
            kurrencyConfig.mode = w.KURRENCY_CONFIG.MODE ? w.KURRENCY_CONFIG.MODE : 'test';
            kurrencyConfig.local = w.KURRENCY_CONFIG.LOCAL ? w.KURRENCY_CONFIG.LOCAL : false;
            var body = w[KURRENCY_CONFIG.ANGULAR].element(d).find('body');
            if (kurrencyConfig.accessToken) {
              body.append('<kurrency-menu></kurrency-menu>');
            }
            var injectors = w[KURRENCY_CONFIG.ANGULAR].element(d).injector();
            if (!d.querySelectorAll('[ng-app]').length && !injectors) {
              w[KURRENCY_CONFIG.ANGULAR].bootstrap(body[0], ['KurrencyApp']);
            }
          }
        ]);
        if (!w.KURRENCY_CONFIG.GOOGLE_FONTS || w.KURRENCY_CONFIG.GOOGLE_FONTS === true) {
          w.WebFontConfig = { google: { families: ['Questrial::latin'] } };
          (function () {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
          }());
        }
      }
    }
    w.initialize = function () {
    };
  }
}(window, document));