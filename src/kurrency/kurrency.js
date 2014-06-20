'use strict';

/**
 *  Kurrency AngularJS Library
 *
 *  Service (factory) for kurrency operations utilizing the JSAPI
 *
 */

angular.module('kurrency', [])
  .constant('kurrencyConfig', {
    cache: false,
    local: false,
    accessToken: 'ABC123',
    mode: 'test'
  })
  .factory('kurrency', ['$rootScope', '$http', 'kurrencyConfig', function ($rootScope, $http, kurrencyConfig) {
    function Request(kurrency, opts) {
      var $scope = this;
      $scope.options = {};

      if(!kurrency) { return console.log('Missing Kurrency object'); }

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
        commonError: function(res, status, error) {
          console.log(res);
        }
      };

      $scope.config = function(opts) {
        $scope.options = angular.extend({}, defaults, opts);

        return $scope;
      };

      $scope.req = function(type, url, data, error) {
        $rootScope.apiLoading = true;
        var opts = angular.extend({}, $scope.options);
        opts.method = type;
        opts.url = url;
        if(type === 'post' || type === 'put') {
          opts.data = JSON.stringify(data);
          opts.contentType = 'application/json';
        } else {
          opts.params = data;
        }

        var req = $http(opts);

        req.success(function() {
          $rootScope.apiLoading = false;
        });

        req.error(function(res) {
          $rootScope.apiLoading = false;
          console.log(res);
          if(error) {
            error(res);
          }
          if(res.pkg === undefined) {
            $rootScope.addRootAlert('error', 'An error occurred connecting to the server');
            return;
          }

          $rootScope.addRootAlert('error', res.pkg.statusMessage);
        });

        return req;
      };

      $scope.get = function(url, data, error) {
        if(typeof data === 'function') {
          error = data;
          data = null;
        }
        return $scope.req('get', url, data, error);
      };

      $scope.post = function(url, data, error) {
        if(typeof data === 'function') {
          error = data;
          data = null;
        }
        return $scope.req('post', url, data, error);
      };

      $scope.put = function(url, data, error) {
        if(typeof data === 'function') {
          error = data;
          data = null;
        }
        return $scope.req('put', url, data, error);
      };

      $scope.del = function(url, data, error) {
        if(typeof data === 'function') {
          error = data;
          data = null;
        }
        return $scope.req('delete', url, data, error);
      };

      return $scope.config(opts);
    }

    function Stor() {
      var $scope = this;

      if(typeof Storage !== 'undefined') {
        $scope.set = function(name, value) {
          if(typeof value === 'object') {
            sessionStorage[name] = JSON.stringify(value);
          } else {
            sessionStorage[name] = value;
            return sessionStorage[name];
          }
          return sessionStorage[name];
        };

        $scope.get = function(name) {
          var ret;
          try {
            ret = JSON.parse(sessionStorage[name]);
          } catch(e) {
            ret = sessionStorage[name];
          }
          return ret;
        };

        $scope.remove = function(name) {
          delete sessionStorage[name];
          return null;
        };
      } else {
        $scope.set = function(name, value) {
          var expires = "";

          var outVal = typeof value === 'object' ? JSON.stringify(value) : escape(value);
          document.cookie = escape(name) + "=" + outVal + expires + "; path=/";
        };

        $scope.get = function(name) {
          var nameEQ = escape(name) + "=";
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
              var out;
              try {
                out = JSON.parse(c.substring(nameEQ.length, c.length));
              } catch(e) {
                out = unescape(c.substring(nameEQ.length, c.length));
              }
              return out;
            }
          }
          return null;
        };

        $scope.remove = function(name) {
          $scope.create(name, "", -1);
        };
      }

      return $scope;
    }

    var Kurrency = function(opts) {
      var $scope = this;
      $scope.options = {};
      $scope.Stor = Stor;
      $scope.Request = Request;

      var storage = new $scope.Stor();
      var baseUrls = {
        test: 'http://0.0.0.0:3458/jsapi',
        production: 'https://api.kurrency.io/api/jsapi'
      };
      var cache = {
        products: {},
        product_lines: {}
      };

      if(!window.angular) {
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

      $scope.config = function(opts) {
        $scope.options = angular.extend(defaults, opts);
        if($scope.options.local) {
          $scope.options.baseUrl = baseUrls.test;
        } else {
          $scope.options.baseUrl = baseUrls.production;
        }

        return $scope;
      };

      $scope.handleError = function(res) {
        if(res && res.responseCode === 403) {
          storage.remove('session');
          $scope.options.session = null;
        }
      };

      function session(options) {
        if(options) {
          $scope.config(options);
        }
      }
      session.prototype.get = function(cb) {
        if(!cb) {
          return $scope.options.session;
        }
        $scope.options.session = storage.get('session');
        if(!$scope.options.session) {
          var req = new Request($scope).get($scope.options.baseUrl + '/session', null, $scope.handleError);
          req.success(function(res) {
            $scope.options.session = res.pkg.data;
            storage.set('session', $scope.options.session);
            return cb(null, $scope.options.session);
          });
        } else {
          return cb(null, $scope.options.session);
        }
      };
      session.prototype.save = function(session, cb) {
        $scope.options.session = session;
        var req = new Request($scope).post($scope.options.baseUrl + '/session', session.data, $scope.handleError);
        req.success(function(res) {
          $scope.options.session = res.pkg.data;
          storage.set('session', $scope.options.session);
          return cb(null, $scope.options.session);
        });
      }

      function cart(options) {
        if(options) {
          $scope.config(options);
        }
      }
      cart.prototype.get = function(cb) {
        $scope.session.get(function(err, session) {
          if(!session.data.cart) {
            session.data.cart = [];
          }
          $scope.session.save(session, function(err, session) {
            return cb(null, session.data.cart);
          });
        });
      };
      cart.prototype.add = function(product, qty, cb) {
        $scope.cart.get(function(err, cart) {
          for(var i = 0; i < cart.length; i++) {
            if(cart[i]._id === product._id) {
              cart[i].qty += parseInt(qty);
              return $scope.session.get(function(err, session) {
                session.data.cart = cart;
                $scope.session.save(session, function(err, session) {
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
          $scope.session.get(function(err, session) {
            session.data.cart = cart;
            $scope.session.save(session, function(err, session) {
              return cb(null, cart);
            });
          });
        });
      };
      cart.prototype.update = function(product, qty, cb) {
        $scope.cart.get(function(err, cart) {
          for(var i = 0; i < cart.length; i++) {
            if(cart[i]._id === product._id) {
              cart[i].qty = parseInt(qty);
              break;
            }
          }

          $scope.session.get(function(err, session) {
            session.data.cart = cart;
            $scope.session.save(session, function(err, session) {
              return cb(null, cart);
            });
          });
        });
      };
      cart.prototype.remove = function(product, cb) {
        $scope.cart.get(function(err, cart) {
          for(var i = 0; i < cart.length; i++) {
            if(cart[i]._id === product._id) {
              cart.splice(i, 1);
              break;
            }
          }

          $scope.session.get(function(err, session) {
            session.data.cart = cart;
            $scope.session.save(session, function(err, session) {
              return cb(null, cart);
            });
          });
        });
      };
      cart.prototype.empty = function(cb) {
        $scope.session.get(function(err, session) {
          session.data.cart = [];
          $scope.session.save(session, function(err, session) {
            return cb(null, []);
          });
        });
      };
      cart.prototype.replace = function(cart, cb) {
        $scope.session.get(function(err, session) {
          session.data.cart = cart;
          $scope.session.save(session, function(err, session) {
            if(err) {
              return cb(err, null);
            }

            return cb(null, session.data.cart);
          });
        });
      };

      function auth(options) {
        if(options) {
          $scope.config(options);
        }
      }
      auth.prototype.register = function(data, cb) {

      };
      auth.prototype.login = function(username, password, cb) {
        var req = new Request($scope).post($scope.options.baseUrl + '/login', {
          username: username,
          password: password
        }, $scope.handleError);
        req.success(function(res) {
          storage.set('user', res.pkg.data);
          return cb(null, res.pkg.data);
        });
      };

      function addresses(options) {
        if(options) {
          $scope.config(options);
        }
      }
      addresses.prototype.list = function(cb) {
        var req = new Request($scope).get($scope.options.baseUrl + '/addresses', null, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      addresses.prototype.create = function(data, cb) {
        var req = new Request($scope).post($scope.options.baseUrl + '/addresses', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      addresses.prototype.edit = function(data, cb) {
        var req = new Request($scope).put($scope.options.baseUrl + '/addresses', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      addresses.prototype.remove = function(data, cb) {
        var req = new Request($scope).del($scope.options.baseUrl + '/addresses', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };

      function payment_methods(options) {
        if(options) {
          $scope.config(options);
        }
      }
      payment_methods.prototype.list = function(cb) {
        var req = new Request($scope).get($scope.options.baseUrl + '/payment_methods', null, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      payment_methods.prototype.create = function(data, cb) {
        var req = new Request($scope).post($scope.options.baseUrl + '/payment_methods', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      payment_methods.prototype.remove = function(data, cb) {
        var req = new Request($scope).del($scope.options.baseUrl + '/payment_methods', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };

      function products(options) {
        if(options) {
          $scope.config(options);
        }
      }
      products.prototype.list = function(options, cb) {
        var stringOptions = JSON.stringify(options);
        if(cache.products[stringOptions]) {
          return cb(null, cache.products[stringOptions]);
        }
        var req = new Request($scope).get($scope.options.baseUrl + '/products', options, $scope.handleError);
        req.success(function(res) {
          if($scope.options.caching === true) {
            cache.products[stringOptions] = res.pkg.data;
          }
          return cb(null, res.pkg.data);
        });
      };

      function product_lines(options) {
        if(options) {
          $scope.config(options);
        }
      }
      product_lines.prototype.list = function(options, cb) {
        var stringOptions = JSON.stringify(options);
        if(cache.product_lines[stringOptions]) {
          return cb(null, cache.product_lines[stringOptions]);
        }
        var req = new Request($scope).get($scope.options.baseUrl + '/product-lines', options, $scope.handleError);
        req.success(function(res) {
          if($scope.options.caching === true) {
            cache.product_lines[stringOptions] = res.pkg.data;
          }
          return cb(null, res.pkg.data);
        });
      };

      function orders(options) {
        if(options) {
          $scope.config(options);
        }
      }
      orders.prototype.list = function(options, cb) {
        var req = new Request($scope).get($scope.options.baseUrl + '/orders', options, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      orders.prototype.create = function(data, cb) {
        var req = new Request($scope).post($scope.options.baseUrl + '/orders', data, $scope.handleError);
        req.success(function(res) {
          return cb(null, res.pkg.data);
        });
      };
      orders.prototype.taxes = function(value, shipment, cb) {
        var params = {
          value: value,
          ship_to: shipment.ship_to
        };
        $scope.session.get(function(err, session) {
          if(err) {
            return cb(err, null);
          }
          var req = new Request($scope).post($scope.options.baseUrl + '/orders/taxes', params, $scope.handleError);
          req.success(function(res) {
            return cb(null, res.pkg.data);
          });
        });
      }

      function shipping(options) {
        if(options) {
          $scope.config(options);
        }
      }
      shipping.prototype.rates = function(data, cb) {
        if(!data.products) {
          return cb(new Error('Missing products'), null);
        }
        var params = angular.extend({}, data);

        delete params.products;
        params.packages = [{
          weight: 0,
          price: 0
        }];
        for(var i = 0; i < data.products.length; i++) {
          params.packages[0].weight += data.products[i].weight * data.products[i].qty;
          params.packages[0].price += data.products[i].price * data.products[i].qty;
        }

        var req = new Request($scope).post($scope.options.baseUrl + '/shipping/rates', params, $scope.handleError);
        req.success(function(res) {
          var rates = res.pkg.data;
          rates.sort(function(a, b) {
            return a.cost - b.cost;
          });
          return cb(null, rates);
        });
      };

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

        $scope.setRate = function(r) {
          $scope.rate = r;
          return $scope;
        };
        $scope.setShipTo = function(ship_to) {
          $scope.ship_to.name = ship_to.name;
          $scope.ship_to.company_name = ship_to.company_name;
          $scope.ship_to.attention_to = ship_to.attention_to;
          $scope.ship_to.email = ship_to.email;
          $scope.ship_to.phone = ship_to.phone;
          if(ship_to.address) {
            $scope.ship_to.address = address;
          }
          return $scope;
        };
        $scope.setAddress = function(address) {
          $scope.ship_to.address = address;
        };

        $scope = angular.extend($scope, options);
        return $scope;
      };

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

        $scope.setShipTo = function(ship_to) {
          $scope.ship_to.name = ship_to.name;
          $scope.ship_to.company_name = ship_to.company_name;
          $scope.ship_to.attention_to = ship_to.attention_to;
          $scope.ship_to.email = ship_to.email;
          $scope.ship_to.phone = ship_to.phone;
          if(ship_to.address) {
            $scope.ship_to.address = address;
          }
          return $scope;
        };
        $scope.setAddress = function(address) {
          $scope.ship_to.address = address;
        };

        $scope = angular.extend($scope, options);
        return $scope;
      };

      function payment_method(options) {
        var $scope = this;
        $scope.type = 'credit_card';
        $scope.card = {};
        $scope.bank_account = {};
        $scope = angular.extend($scope, options);
        return $scope;
      }

      function credit_card(options) {
        var $scope = new payment_method({
          type: 'credit_card'
        });

        $scope._id = undefined;
        $scope.card.name = undefined;
        $scope.card.card_number = undefined;
        $scope.card.expiration_month = new Date().getMonth()+1;
        $scope.card.expiration_year = new Date().getFullYear();
        $scope.card.security_code = undefined;
        $scope.card.postal_code = undefined;

        $scope = angular.extend($scope, options);
        return $scope;
      }

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
  }]);