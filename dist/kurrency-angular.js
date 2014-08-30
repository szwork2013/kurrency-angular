/*
 * kurrency-angular
 * https://github.com/typefoo/kurrency-angular

 * Version: 0.0.1 - 2014-08-30
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
    w.KURRENCY_CONFIG = { ANGULAR: 'angular' };
  } else {
    if (!w.KURRENCY_CONFIG.ANGULAR) {
      w.KURRENCY_CONFIG.ANGULAR = 'angular';
    }
  }
  if (!w[KURRENCY_CONFIG.ANGULAR] && (typeof w.KURRENCY_CONFIG.REQUIRE_ANGULAR === 'undefined' || w.KURRENCY_CONFIG.REQUIRE_ANGULAR === true)) {
    var scrip = d.createElement('script');
    scrip.type = 'text/javascript';
    scrip.async = true;
    scrip.src = '//ajax.googleapis.com/ajax/libs/angularjs/1.2.23/angular.min.js';
    d.getElementsByTagName('body')[0].appendChild(scrip);
    if (scrip.readyState) {
      scrip.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
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
    angular.module('KurrencyApp', []);
    angular.module('KurrencyApp').constant('kurrencyConfig', {
      cache: false,
      local: false,
      accessToken: 'ABC123',
      mode: 'test',
      phrases: { cart_empty: 'You don\'t have anything in your cart' }
    }).factory('kurrency', [
      '$rootScope',
      '$http',
      'kurrencyConfig',
      function ($rootScope, $http, kurrencyConfig) {
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
          $scope.config = function (opts) {
            $scope.options = angular.extend({}, defaults, opts);
            return $scope;
          };
          $scope.req = function (type, url, data, error) {
            $rootScope.$broadcast('apiLoading', true);
            var opts = angular.extend({}, $scope.options);
            opts.method = type;
            opts.url = url;
            if (type === 'post' || type === 'put') {
              opts.data = JSON.stringify(data);
              opts.contentType = 'application/json';
            } else {
              opts.params = data;
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
          if (typeof Storage !== 'undefined') {
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
          var storage = new $scope.Stor();
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
              mode: 'test',
              baseUrl: baseUrls[this.local ? 'test' : 'production']
            };
          $scope.config = function (opts) {
            $scope.options = angular.extend(defaults, opts);
            if ($scope.options.local) {
              $scope.options.baseUrl = baseUrls.test;
            } else {
              $scope.options.baseUrl = baseUrls.production;
            }
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
          session.prototype.get = function (cb) {
            if (!cb) {
              return $scope.options.session;
            }
            $scope.options.session = storage.get('session');
            if (!$scope.options.session) {
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
              }
              $scope.session.save(session, function (err, session) {
                return cb(null, session.data.cart);
              });
            });
          };
          cart.prototype.add = function (product, qty, cb) {
            $scope.cart.get(function (err, cart) {
              for (var i = 0; i < cart.length; i++) {
                if (cart[i]._id === product._id) {
                  cart[i].qty += parseInt(qty);
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
                qty: parseInt(qty),
                image: product.images[0],
                weight: product.weight,
                dimensions: product.dimensions,
                price: product.price,
                product_lines: product.product_lines
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
              storage.set('user', res.pkg.data);
              $rootScope.$broadcast('kurrencyRegistered', res.pkg.data);
              return cb(null, res.pkg.data);
            });
          };
          auth.prototype.login = function (username, password, cb) {
            var req = new Request($scope).post($scope.options.baseUrl + '/login', {
                username: username,
                password: password
              }, $scope.handleError);
            req.success(function (res) {
              storage.set('user', res.pkg.data);
              $rootScope.$broadcast('kurrencySignIn', res.pkg.data);
              return cb(null, res.pkg.data);
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
              var req = new Request($scope).get($scope.options.baseUrl + '/payment_methods', null, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.create = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).post($scope.options.baseUrl + '/payment_methods', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.edit = function (data, cb) {
            // User can edit the nickname
            $scope.session.get(function (err, session) {
              var req = new Request($scope).put($scope.options.baseUrl + '/payment_methods', data, $scope.handleError);
              req.success(function (res) {
                return cb(null, res.pkg.data);
              });
            });
          };
          payment_methods.prototype.remove = function (data, cb) {
            $scope.session.get(function (err, session) {
              var req = new Request($scope).del($scope.options.baseUrl + '/payment_methods', data, $scope.handleError);
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
          shipping.prototype.rates = function (data, cb) {
            if (!data.products) {
              return cb(new Error('Missing products'), null);
            }
            var params = angular.copy(data);
            delete params.products;
            params.packages = [{
                weight: 0,
                price: 0
              }];
            for (var i = 0; i < data.products.length; i++) {
              params.packages[0].weight += data.products[i].weight * data.products[i].qty;
              params.packages[0].price += data.products[i].price * data.products[i].qty;
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
            $scope = angular.extend($scope, options);
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
            $scope = angular.extend($scope, options);
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
            $scope = angular.extend($scope, options);
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
            $scope.card.name = undefined;
            $scope.card.card_number = undefined;
            $scope.card.expiration_month = new Date().getMonth() + 1;
            $scope.card.expiration_year = new Date().getFullYear();
            $scope.card.security_code = undefined;
            $scope.card.postal_code = undefined;
            $scope = angular.extend($scope, options);
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
            $scope = angular.extend($scope, options);
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
    }).directive('kurrencyPopover', function () {
      return {
        scope: true,
        restrict: 'A',
        transclude: true,
        templateUrl: function (tElement, tAttrs) {
          var url = '/kurrency-templates/kurrency-popover.html';
          if (tAttrs.templateUrl) {
            url = tAttrs.templateUrl;
          }
          return url;
        },
        link: function (scope, element, attr) {
          scope.contents = scope.$eval(attr.kurrencyPopover);
          var popover = angular.element(element[0].querySelector('.kurrency-popover'));
          element.bind('mouseover', function (evt) {
            popover.addClass('active');
          });
          element.bind('mouseout', function (evt) {
            popover.removeClass('active');
          });
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
            options: '@',
            alt: '='
          },
          template: '<img ng-src="{{newSrc}}" alt="{{alt}}">',
          link: function (scope, element, attr) {
            scope.newSrc = null;
            attr.$observe('options', function (opts) {
              scope.options = scope.$eval(opts);
            });
            scope.$watch('src', function () {
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
              return url;
            }
          }
        };
      }
    ]).directive('kurrencyProduct', [
      'kurrency',
      'kurrencyConfig',
      function (kurrency, kurrencyConfig) {
        return {
          restrict: 'E',
          scope: { id: '=' },
          templateUrl: function (tElement, tAttrs) {
            var url = '/kurrency-templates/kurrency-product.html';
            if (tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }
            return url;
          },
          replace: true,
          link: function (scope, element, attr) {
            scope.kurrency = kurrency;
            scope.config = kurrencyConfig;
            scope.product = null;
            kurrency.products.list({ _id: scope.id }, function (err, products) {
              scope.product = products[0];
            });
          }
        };
      }
    ]).directive('kurrencyMenu', [
      'kurrency',
      'kurrencyConfig',
      '$timeout',
      function (kurrency, kurrencyConfig, $timeout) {
        return {
          restrict: 'E',
          templateUrl: function (tElement, tAttrs) {
            var url = '/kurrency-templates/kurrency-menu.html';
            if (tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }
            return url;
          },
          replace: true,
          link: function (scope, element, attr) {
            scope.config = kurrencyConfig;
            scope.cart = null;
            scope.wishlist = null;
            scope.showing = null;
            scope.back = null;
            scope.apiLoading = 0;
            scope.messages = {
              none: [],
              login: [],
              'forgot-password': [],
              register: [],
              checkout: [],
              wishlist: [],
              contact: []
            };
            scope.kurrency = kurrency;
            kurrency.cart.get(function (err, cart) {
              scope.cart = cart;
            });
            scope.checkClass = function (c) {
              if (scope.showing === c) {
                return { active: true };
              }
              return '';
            };
            scope.addMessage = function (type, msg) {
              var section = scope.showing;
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
            scope.close = function () {
              scope.showing = null;
            };
            scope.toggle = function (val, back) {
              if (scope.showing === val) {
                scope.showing = null;
              } else {
                scope.showing = val;
              }
              if (back) {
                scope.back = back;
              } else {
                scope.back = null;
              }
              scope.wipeMessages();
              scope.resetForms();
            };
            scope.show = function (val) {
              return val === scope.showing;
            };
            scope.loginUser = function (section) {
              scope.wipeMessages();
              kurrency.auth.login(scope.login.username, scope.login.password, function (user) {
                scope.addMessage('success', 'Successfully logged in');
                $timeout(function () {
                  if (section) {
                    scope.showing = section;
                  } else {
                    scope.showing = null;
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
                  if (section) {
                    scope.showing = section;
                  } else {
                    scope.showing = null;
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
              scope.showing = null;
            });
            scope.$on('apiLoading', function (evt, val) {
              if (val === true) {
                scope.apiLoading++;
              } else if (scope.apiLoading > 0) {
                scope.apiLoading--;
              }
            });
            scope.resetForms();
          }
        };
      }
    ]);
    if (w.KURRENCY_CONFIG) {
      // we are using kurrency from an embed standpoint
      if (!w.KURRENCY_CONFIG.integrated) {
        angular.injector([
          'ng',
          'KurrencyApp'
        ]).invoke([
          '$compile',
          '$rootScope',
          'kurrency',
          'kurrencyConfig',
          function ($compile, $rootScope, kurrency, kurrencyConfig) {
            kurrencyConfig.cache = w.KURRENCY_CONFIG.CACHE ? w.KURRENCY_CONFIG.CACHE : true;
            kurrencyConfig.accessToken = w.KURRENCY_CONFIG.ACCESS_TOKEN;
            kurrencyConfig.mode = w.KURRENCY_CONFIG.MODE ? w.KURRENCY_CONFIG.MODE : 'test';
            kurrencyConfig.local = w.KURRENCY_CONFIG.LOCAL ? w.KURRENCY_CONFIG.LOCAL : false;
            angular.element(d).find('body').append('<kurrency-menu></kurrency-menu>');
            angular.bootstrap(angular.element(d).find('body')[0], ['KurrencyApp']);
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
    w[KURRENCY_CONFIG.ANGULAR].module('KurrencyApp').run([
      '$templateCache',
      function ($templateCache) {
        'use strict';
        $templateCache.put('kurrency-templates/kurrency-menu.html', '<div class="kurrency-menu" ng-class="{\'logged-in\': kurrency.auth.loggedIn(), \'open\': showing}">\n' + '  <ul class="menu-wrapper">\n' + '    <li class="sign-in"><a href ng-click="toggle(\'login\')" kurrency-popover="\'Sign In\'" ng-class="checkClass(\'login\')"><span class="kicon-login"></span></a></li>\n' + '    <li class="account"><a href ng-click="toggle(\'account\')" kurrency-popover="\'Account\'" ng-class="checkClass(\'account\')"><span class="kicon-account"></span></a></li>\n' + '    <li class="cart"><a href ng-click="toggle(\'cart\')" kurrency-popover="\'Shopping Cart\'" ng-class="checkClass(\'cart\')"><span class="kicon-cart"></span></a></li>\n' + '    <li class="wishlist"><a href ng-click="toggle(\'wishlist\')" kurrency-popover="\'Wishlist\'" ng-class="checkClass(\'wishlist\')"><span class="kicon-wishlist"></span></a></li>\n' + '    <li class="contact"><a href kurrency-popover="\'Contact\'" ng-click="toggle(\'contact\')" ng-class="checkClass(\'contact\')"><span class="kicon-contact"></span></a></li>\n' + '    <li class="sign-out"><a href kurrency-popover="\'Sign Out\'" ng-click="kurrency.auth.signOut()"><span class="kicon-sign_out"></span></a></li>\n' + '  </ul>\n' + '  <div class="kurrency-loading" ng-class="{active: (apiLoading > 0)}"><div class="loading-indicator">Loading...</div></div>\n' + '  <div class="kurrency-sidebar kurrency-cart" ng-class="{active: show(\'cart\')}">\n' + '    <div class="closer"><a href ng-click="close()"><span class="kicon-close"></span></a></div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Shopping Cart</h1>\n' + '      <div ng-show="!cart || !cart.length">\n' + '        <p>You have nothing in your cart</p>\n' + '        <button type="button" class="kurrency-button" ng-click="close()">Continue Shopping</button>\n' + '      </div>\n' + '      <div ng-show="cart && cart.length">\n' + '        <ul>\n' + '          <li ng-repeat="product in cart">\n' + '\n' + '          </li>\n' + '        </ul>\n' + '        <button type="button" class="kurrency-button checkout-button" ng-click="toggle(\'checkout\', \'cart\')">Checkout</button>\n' + '      </div>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-wishlist" ng-class="{active: show(\'wishlist\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Wishlist</h1>\n' + '      <div ng-show="!wishlist || !wishlist.length">\n' + '        <p>You have nothing in your wishlist</p>\n' + '        <button type="button" class="kurrency-button" ng-click="close()">Continue Shopping</button>\n' + '      </div>\n' + '      <div ng-show="wishlist && wishlist.length">\n' + '        <ul>\n' + '          <li ng-repeat="product in cart">\n' + '\n' + '          </li>\n' + '        </ul>\n' + '        <button type="button" class="kurrency-button share-wishlist-button" ng-click="toggle(\'share-wishlist\', \'wishlist\')">Share my wishlist</button>\n' + '      </div>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-login" ng-class="{active: show(\'login\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Sign In</h1>\n' + '      <p>Sign into your Kurrency account.</p>\n' + '      <div class="alerts">\n' + '        <div ng-repeat="alert in messages[\'login\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '      </div>\n' + '      <form ng-submit="loginUser()">\n' + '        <input class="kurrency-input" type="text" ng-model="login.username" placeholder="Enter your username or email">\n' + '        <input class="kurrency-input" type="password" ng-model="login.password" placeholder="Enter your password">\n' + '        <button type="submit" class="kurrency-button login-button">Sign In</button>\n' + '        <div class="spacer"></div>\n' + '        <button type="button" class="kurrency-button small forgot-password" ng-click="toggle(\'forgot-password\', \'login\')">Forgot your password?</button>\n' + '        <p>Don\'t have an account?</p>\n' + '        <button type="button" class="kurrency-button small register-button" ng-click="toggle(\'register\', \'login\')">Register Now</button>\n' + '      </form>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-forgot-password" ng-class="{active: show(\'forgot-password\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Forgot My Password</h1>\n' + '      <p>Enter your email address and we will send you instructions to reset your password</p>\n' + '      <div class="alerts">\n' + '        <div ng-repeat="alert in messages[\'forgot-password\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '      </div>\n' + '      <form ng-submit="forgotPassword()">\n' + '        <input class="kurrency-input" type="text" ng-model="forgot.email" placeholder="Enter your email address">\n' + '        <button class="kurrency-button send-password-instructions" type="submit" class="login-button">Send Instructions</button>\n' + '      </form>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-register" ng-class="{active: show(\'register\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Register</h1>\n' + '      <p>Enter the fields below to get started</p>\n' + '      <div class="alerts">\n' + '        <div ng-repeat="alert in messages[\'register\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '      </div>\n' + '      <form ng-submit="registerUser()">\n' + '        <input class="kurrency-input" type="text" ng-model="register.first_name" placeholder="Enter your first name">\n' + '        <input class="kurrency-input" type="text" ng-model="register.last_name" placeholder="Enter your last name">\n' + '        <input class="kurrency-input" type="email" ng-model="register.email" placeholder="Enter your email">\n' + '        <input class="kurrency-input" type="password" ng-model="register.password" placeholder="Enter a password">\n' + '        <button type="submit" class="kurrency-button register-button">Register</button>\n' + '        <p>Already have an account?</p>\n' + '        <button type="button" class="kurrency-button small login-button" ng-click="toggle(\'login\', \'register\')">Sign in now</button>\n' + '      </form>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-account" ng-class="{active: show(\'account\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>My Account</h1>\n' + '    </div>\n' + '  </div>\n' + '  <div class="kurrency-sidebar kurrency-contact" ng-class="{active: show(\'contact\')}">\n' + '    <div class="closer">\n' + '      <a href class="back" ng-show="back" ng-click="toggle(back)"><span class="kicon-arrow-left"></span></a>\n' + '      <a href ng-click="close()"><span class="kicon-close"></span></a>\n' + '    </div>\n' + '    <div class="kurrency-container">\n' + '      <h1>Contact Us</h1>\n' + '      <p>Fill out the form below and we\'ll respond as soon as possible</p>\n' + '      <div class="alerts">\n' + '        <div ng-repeat="alert in messages[\'contact\']" class="alert-{{alert.type}}">{{alert.message}}</div>\n' + '      </div>\n' + '      <form ng-submit="sendContact()">\n' + '        <input class="kurrency-input" type="text" ng-model="contact.name" placeholder="Enter your name">\n' + '        <input class="kurrency-input" type="email" ng-model="contact.email" placeholder="Enter your email">\n' + '        <textarea rows="3" class="kurrency-input" ng-model="contact.message" placeholder="Enter a message or concern to send to us"></textarea>\n' + '        <button type="submit" class="kurrency-button contact-button">Contact</button>\n' + '      </form>\n' + '    </div>\n' + '  </div>\n' + '</div>');
        $templateCache.put('kurrency-templates/kurrency-popover.html', '<span ng-transclude></span>\n' + '<div class="kurrency-popover">\n' + '  <span ng-bind="contents"></span>\n' + '</div>');
        $templateCache.put('kurrency-templates/kurrency-product.html', '<div class="kurrency-product">\n' + '  <div class="kurrency-product-container">\n' + '    <kurrency-image src="product.images[0]" options="{size: \'300x200\'}" alt="product.name"></kurrency-image>\n' + '  </div>\n' + '  <div class="kurrency-product-container">\n' + '    <div class="column">\n' + '      <h2 ng-bind="product.name"></h2>\n' + '      <h3 ng-show="product.sub_title" ng-bind="product.sub_title"></h3>\n' + '      <span class="price" ng-bind="product.price / 100 | currency"></span>\n' + '    </div>\n' + '    <div class="column">\n' + '      <button type="button">Buy Now</button>\n' + '    </div>\n' + '    <p ng-bind-html="product.short_description"></p>\n' + '  </div>\n' + '</div>');
      }
    ]);
  }
}(window, document));