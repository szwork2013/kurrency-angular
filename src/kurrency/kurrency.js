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

(function(w, d) {
  'use strict';

  if(!w.KURRENCY_CONFIG) {
    w.KURRENCY_CONFIG = {
      ANGULAR: 'angular'
    };
  } else {
    if(!w.KURRENCY_CONFIG.ANGULAR) {
      w.KURRENCY_CONFIG.ANGULAR = 'angular';
    }
  }

  if (!w[w.KURRENCY_CONFIG.ANGULAR] && (typeof w.KURRENCY_CONFIG.REQUIRE_ANGULAR === 'undefined' || w.KURRENCY_CONFIG.REQUIRE_ANGULAR === true)) {
    var scrip = d.createElement('script');
    scrip.type = 'text/javascript';
    scrip.async = true;
    scrip.src = '//ajax.googleapis.com/ajax/libs/angularjs/1.2.23/angular.min.js';
    d.getElementsByTagName('body')[0].appendChild(scrip);
    if (scrip.readyState) {
      scrip.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          setupKurrency();
        }
      }
    } else {
      scrip.onload = function () {
        setupKurrency();
      }
    }
  } else {
    setupKurrency();
  }

  function setupKurrency() {
    angular.module('KurrencyApp', []);
    angular.module('KurrencyApp')
      .constant('kurrencyConfig', {
        cache: false,
        local: false,
        accessToken: 'ABC123',
        mode: 'test',
        phrases: {
          cart_empty: 'You don\'t have anything in your cart'
        },
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
        // this is so inefficient lol, change
        years: [
          {
            name: new Date().getFullYear(),
            value: new Date().getFullYear()
          },
          {
            name: new Date().getFullYear()+1,
            value: new Date().getFullYear()+1
          },
          {
            name: new Date().getFullYear()+2,
            value: new Date().getFullYear()+2
          },
          {
            name: new Date().getFullYear()+3,
            value: new Date().getFullYear()+3
          },
          {
            name: new Date().getFullYear()+4,
            value: new Date().getFullYear()+4
          },
          {
            name: new Date().getFullYear()+5,
            value: new Date().getFullYear()+5
          },
          {
            name: new Date().getFullYear()+6,
            value: new Date().getFullYear()+6
          },
          {
            name: new Date().getFullYear()+7,
            value: new Date().getFullYear()+7
          }
        ],
        states:
          [
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
      })
      .factory('kurrency', ['$rootScope', '$http', 'kurrencyConfig', function ($rootScope, $http, kurrencyConfig) {
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
              var expires = "";

              var outVal = typeof value === 'object' ? JSON.stringify(value) : escape(value);
              document.cookie = escape(name) + "=" + outVal + expires + "; path=/";
            };

            $scope.get = function (name) {
              var nameEQ = escape(name) + "=";
              var ca = document.cookie.split(';');
              for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
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
              $scope.create(name, "", -1);
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
            authenticationKey: null, // if user is logged in
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
                taxable: product.taxable
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

          auth.prototype.forgotPassword = function(email, cb) {
            var req = new Request($scope).post($scope.options.baseUrl + '/forgot-password', {email: email}, $scope.handleError);
            req.success(function(res) {
              $rootScope.$broadcast('kurrencyForgotPassword', res);
              return cb(null, res);
            });
          };

          auth.prototype.signOut = function() {
            storage.remove('session');
            storage.remove('user');
            $scope.options.session = null;
            $scope.options.user = null;
            $rootScope.$broadcast('kurrencySignOut', true);
          };

          auth.prototype.loggedIn = function() {
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
            params.packages = [
              {
                weight: 0,
                price: 0
              }
            ];
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
            var $scope = new payment_method({
              type: 'credit_card'
            });

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
            var $scope = new payment_method({
              type: 'bank_account'
            });

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
      }])
      .config(function($sceProvider) {
        $sceProvider.enabled(false);
      })
      .directive('kurrencyPopover', function() {
        return {
          scope: {kurrencyPopover: '=', showing: '@'},
          restrict: 'A',
          transclude: true,
          templateUrl: function(tElement, tAttrs) {
            var url = '/kurrency-templates/kurrency-popover.html';
            if(tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }

            return url;
          },
          link: function(scope, element, attr) {
            var popover = angular.element(element[0].querySelector('.kurrency-popover'));
            element.bind('mouseover', function(evt) {
              scope.showing = true;
              scope.$apply();
            });
            element.bind('mouseout', function(evt) {
              scope.showing = false;
              scope.$apply();
            });
            scope.$watch(function() { return scope.showing; }, function() {
              scope.showing = (scope.showing === 'true' || scope.showing === true);

              if(scope.showing === true) {
                popover.addClass('active');
              } else {
                popover.removeClass('active')
              }
            }, true);
          }
        }
      })
      .directive('kurrencyImage', ['kurrency', 'kurrencyConfig', '$parse', function(kurrency, kurrencyConfig, $parse) {
        return {
          restrict: 'E',
          scope: {src: '=', options: '@', alt: '='},
          template: '<img ng-src="{{newSrc}}" alt="{{alt}}">',
          link: function(scope, element, attr) {
            scope.newSrc = null;
            attr.$observe('options', function(opts) {
              scope.options = scope.$eval(opts);
            });
            scope.$watch('src', function() {
              if(!scope.src) {
                return;
              }

              scope.newSrc = buildUrl(scope.src, scope.options);
            });

            function buildUrl(src, options) {
              var base = kurrencyConfig.local ? kurrency.baseUrls.test : kurrency.baseUrls.production;
              var url = base + '/imager?access-token=' + kurrencyConfig.accessToken + '&url=' + encodeURIComponent(src);
              if(options.size) {
                url += '&size=' + options.size;
              }
              if(options.effect) {
                url += '&effect=' + options.effect;
              }

              return url;
            }
          }
        }
      }])
      .directive('kurrencyProduct', ['kurrency', 'kurrencyConfig', function(kurrency, kurrencyConfig) {
        return {
          restrict: 'E',
          scope: {id: '='},
          templateUrl: function(tElement, tAttrs) {
            var url = '/kurrency-templates/kurrency-product.html';
            if(tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }

            return url;
          },
          replace: true,
          link: function(scope, element, attr) {
            scope.kurrency = kurrency;
            scope.config = kurrencyConfig;
            scope.product = null;

            kurrency.products.list({_id: scope.id}, function(err, products) {
              scope.product = products[0];
            });

            scope.addToCart = function(product, qty) {
              kurrency.cart.add(product, qty, function(err, cart) {
                if(err) {
                  return console.log(err);
                }

                scope.$emit('cartUpdated', cart);
              });
            };
          }
        }
      }])
      .directive('kurrencyMenu', ['kurrency', 'kurrencyConfig', '$timeout', '$window', '$document', function(kurrency, kurrencyConfig, $timeout, $window, $document) {
        return {
          restrict: 'E',
          templateUrl: function(tElement, tAttrs) {
            var url = '/kurrency-templates/kurrency-menu.html';
            if(tAttrs.templateUrl) {
              url = tAttrs.templateUrl;
            }

            return url;
          },
          replace: true,
          link: function(scope, element, attr) {
            scope.config = kurrencyConfig;
            scope.cart = null;
            scope.wishlist = null;
            scope.showing = null;
            scope.back = null;
            scope.apiLoading = 0;
            scope.product_total = 0;
            scope.quantity_total = 0;
            scope.paymentEnabled = false;
            scope.requiresShipping = false;
            scope.addressList = [];
            scope.paymentList = [];
            scope.checkout = {
              service_carrier: null,
              service_code: null,
              ship_to: new kurrency.customer(),
              bill_to: new kurrency.customer(),
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
            scope.rates = [];
            scope.selectedRate = null;
            scope.tax_total = 0;
            scope.shipping_total = 0;
            scope.final_total = 0;
            scope.cartAddText = kurrencyConfig.cartAddText ? kurrencyConfig.cartAddText : 'Added to cart';
            scope.shoppingCartPopoverText = 'Shopping Cart';
            scope.cartAddActive = false;

            // load Gmaps if it isn't on the page
            if(!$window.google) {
              var check = $document[0].getElementsByTagName('script');
              var found = false;
              for(var i = 0; i < check.length; i++) {
                if(check[i].src.indexOf('maps.googleapis') > -1) {
                  found = true;
                }
              }
              if(!found) {
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
              contact: []
            };
            scope.kurrency = kurrency;
            kurrency.cart.get(function(err, cart) {
              scope.cart = cart;
              scope.updateProductTotal();
            });

            scope.updateProductTotal = function() {
              scope.product_total = 0;
              scope.quantity_total = 0;
              var line_total;

              for(var i = 0; i < scope.cart.length; i++) {
                if(scope.cart[i].requires_shipping) {
                  scope.requiresShipping = true;
                }
                scope.quantity_total += parseInt(scope.cart[i].qty, 10);
                line_total = parseInt(scope.cart[i].qty, 10) * scope.cart[i].price;
                scope.product_total += line_total;
              }
            };

            scope.updateFinalTotal = function() {
              scope.final_total = scope.product_total +
                scope.shipping_total +
                scope.tax_total;
            };

            scope.$on('cartUpdated', function(evt, cart) {
              var tmp = scope.shoppingCartPopoverText;
              scope.shoppingCartPopoverText = scope.cartAddText;
              scope.cartAddActive = true;
              (function(tmp) {
                $timeout(function () {
                  scope.shoppingCartPopoverText = tmp;
                  scope.cartAddActive = false;
                }, 3000);
                scope.cart = cart;
                scope.updateProductTotal();
              })(tmp);
            });

            scope.updateQuantity = function(product) {
              scope.updateProductTotal();
              kurrency.cart.update(product, product.qty, function(err, cart) {
                scope.cart = cart;
              });
            };

            scope.removeProduct = function(product) {
              kurrency.cart.remove(product, function(err, cart) {
                scope.cart = cart;
                scope.updateProductTotal();
              });
            };

            scope.checkClass = function(c) {
              if(scope.showing === c) {
                return {active: true};
              }

              return '';
            };

            scope.copyShippingAddress = function() {
              scope.checkout.bill_to = angular.extend(scope.checkout.bill_to, scope.checkout.ship_to);
              scope.shippingAddressCopied = true;
            };

            scope.lookupGeoCode = function(address, postal_code, obj) {
              if(!postal_code || postal_code.length < 5) {
                return;
              }

              if(!$window.google) {
                return scope.geocodeComplete = true;
              }

              var geocoder = new google.maps.Geocoder();
              geocoder.geocode({
                address: address + ' ' + postal_code
              }, function(res, status) {
                if(status !== google.maps.GeocoderStatus.OK) {
                  return scope.geocodeComplete = true;
                }

                console.log(res);
                for(var i = 0; i < res[0].address_components.length; i++) {
                  var part = res[0].address_components[i];
                  if(part.types[0] === 'locality') {
                    obj.address.city = part.long_name;
                  }
                  if(part.types[0] === 'administrative_area_level_1') {
                    obj.address.state_code = part.short_name;
                  }
                  if(part.types[0] === 'country') {
                    obj.country_code = part.short_name;
                  }
                }
                scope.geocodeComplete = true;
                scope.$apply();
              });
            };

            scope.getTaxes = function() {
              kurrency.orders.taxes(scope.product_total, {
                ship_to: {
                  address: {
                    postal_code: scope.checkout.ship_to.address.postal_code
                  }
                }
              }, function(err, tax) {
                scope.tax_total = tax;
                scope.updateFinalTotal();
              });
            };

            scope.getRates = function() {
              if(!scope.checkout.ship_to.address.postal_code
                || scope.checkout.ship_to.address.postal_code.length < 5) {
                return;
              }

              kurrency.shipping.rates({
                ship_to: {
                  address: {
                    address_1: scope.checkout.ship_to.address.address_1,
                    state_code: scope.checkout.ship_to.address.state_code,
                    country_code: scope.checkout.ship_to.address.country_code,
                    postal_code: scope.checkout.ship_to.address.postal_code
                  }
                },
                products: scope.cart
              }, function(err, rates) {
                if(err) {
                  return console.log(err);
                }

                scope.rates = rates;
                scope.selectedRate = scope.rates[0];
                scope.updateFinalTotal();
              });
            };

            scope.$watch('selectedRate', function() {
              if(!scope.selectedRate) {
                return;
              }
              scope.shipping_total = scope.selectedRate.cost * 100;
              scope.checkout.service_carrier = scope.selectedRate.carrier;
              scope.checkout.service_code = scope.selectedRate.code;
              scope.updateFinalTotal();
            }, true);

            scope.completeOrder = function() {
              if(scope.apiLoading > 0) {
                scope.addMessage('error', 'Please wait, we are processing your order');
                return;
              }
              kurrency.orders.create({
                service_carrier: scope.checkout.service_carrier,
                service_code: scope.checkout.service_code,
                ship_to: scope.checkout.ship_to,
                customer: scope.checkout.bill_to,
                payment_method: scope.checkout.payment_method,
                products: angular.copy(scope.cart),
                notes: ''
              }, function(err, order) {
                if(err) {
                  return console.log(err);
                }

                kurrency.cart.empty(function(err, cart) {
                  $location.path('/checkout/complete/' + order.order_id);
                });
              });
            };

            scope.addMessage = function(type, msg) {
              var section = scope.showing;
              if(!section) {
                section = 'none';
              }

              scope.messages[section].push({type: type, message: msg});
              //$timeout(function() {
              //  scope.messages[section].pop();
              //}, 5000);
            };

            scope.wipeMessages = function() {
              for(var i in scope.messages) {
                scope.messages[i] = [];
              }
            };

            scope.resetForms = function() {
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
              scope.forgot = {
                email: null
              };
              scope.contact = {
                name: null,
                email: null,
                phone: null,
                message: null
              }
            };

            scope.close = function() {
              scope.showing = null;
            };

            scope.toggle = function(val, back) {
              if(scope.showing === val) {
                scope.showing = null;
              } else {
                scope.showing = val;
              }

              if(back) {
                scope.back = back;
              } else {
                scope.back = null;
              }
              scope.wipeMessages();
              scope.resetForms();
              if(val === 'checkout-3') {
                scope.getRates();
                scope.getTaxes();
              }
            };

            scope.show = function(val) {
              return (val === scope.showing);
            };

            scope.loginUser = function(section) {
              scope.wipeMessages();
              kurrency.auth.login(scope.login.username, scope.login.password, function(user) {
                scope.addMessage('success', 'Successfully logged in');
                $timeout(function() {
                  if (section) {
                    scope.showing = section;
                  } else {
                    scope.showing = null;
                  }
                  scope.wipeMessages();
                }, 500);
              });
            };

            scope.registerUser = function(section) {
              scope.wipeMessages();
              scope.register.confirm_password = scope.register.password;
              kurrency.auth.register(scope.register, function(user) {
                scope.addMessage('success', 'Account registered, and logged in');
                $timeout(function() {
                  if (section) {
                    scope.showing = section;
                  } else {
                    scope.showing = null;
                  }
                  scope.wipeMessages();
                }, 500);
              });
            };

            scope.forgotPassword = function() {
              scope.wipeMessages();
              kurrency.auth.forgotPassword(scope.forgot.email, function(res) {
                scope.addMessage('success', 'Instructions sent to your email, go check it');
              });
            };

            scope.$on('kurrencyError', function(evt, res) {
              console.log(res);
              if(!res.pkg) {
                return scope.addMessage('error', 'An error occurred connecting to Kurrency\'s servers, check your connection.');
              }

              scope.addMessage('error', res.pkg.statusMessage);
            });

            scope.$on('kurrencySignOut', function(evt) {
              scope.showing = null;
            });

            scope.$on('apiLoading', function(evt, val) {
              if(val === true) {
                scope.apiLoading++;
              } else if(scope.apiLoading > 0) {
                scope.apiLoading--;
              }
            });

            scope.resetForms();
          }
        }
      }]);

    if(w.KURRENCY_CONFIG) {
      // we are using kurrency from an embed standpoint
      if(!w.KURRENCY_CONFIG.integrated) {
        angular.injector(['ng', 'KurrencyApp']).invoke(['$compile', '$rootScope', 'kurrency', 'kurrencyConfig', function($compile, $rootScope, kurrency, kurrencyConfig) {
          kurrencyConfig.cache = w.KURRENCY_CONFIG.CACHE ? w.KURRENCY_CONFIG.CACHE : true;
          kurrencyConfig.accessToken = w.KURRENCY_CONFIG.ACCESS_TOKEN;
          kurrencyConfig.mode = w.KURRENCY_CONFIG.MODE ? w.KURRENCY_CONFIG.MODE : 'test';
          kurrencyConfig.local = w.KURRENCY_CONFIG.LOCAL ? w.KURRENCY_CONFIG.LOCAL : false;


          angular.element(d).find('body').append('<kurrency-menu></kurrency-menu>');
          angular.bootstrap(angular.element(d).find('body')[0], ['KurrencyApp']);
        }]);

        if(!w.KURRENCY_CONFIG.GOOGLE_FONTS || w.KURRENCY_CONFIG.GOOGLE_FONTS === true) {
          w.WebFontConfig = {
            google: { families: [ 'Questrial::latin' ] }
          };
          (function () {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
              '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
          })();
        }
      }
    }

    w.initialize = function() {
      // for Gmaps
      //console.log(w.google);
    };

    //$templateCache
  }
})(window, document);
