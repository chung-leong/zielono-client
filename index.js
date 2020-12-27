(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ZielonoClient = {}, global.React));
}(this, (function (exports, react) { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var id = 0;

  function _classPrivateFieldLooseKey(name) {
    return "__private_" + id++ + "_" + name;
  }

  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }

    return receiver;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  var RelaksEventEmitter = /*#__PURE__*/function () {
    function RelaksEventEmitter() {
      _classCallCheck$1(this, RelaksEventEmitter);

      this.listeners = [];
      this.promises = [];
    }
    /**
     * Attach an event handler
     *
     * @param  {String} type
     * @param  {Function} handler
     * @param  {Boolean|undefined} beginning
     */


    _createClass$1(RelaksEventEmitter, [{
      key: "addEventListener",
      value: function addEventListener(type, handler, beginning) {
        if (typeof type !== 'string') {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Invalid event type passed to addEventListener()');
          }

          return;
        }

        if (!(handler instanceof Function) && handler != null) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Non-function passed to addEventListener()');
          }

          return;
        }

        if (beginning) {
          this.listeners.unshift({
            type: type,
            handler: handler
          });
        } else {
          this.listeners.push({
            type: type,
            handler: handler
          });
        }
      }
      /**
       * Remove an event handler
       *
       * @param  {String} type
       * @param  {Function} handler
       */

    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, handler) {
        this.listeners = this.listeners.filter(function (listener) {
          return !(listener.type === type && listener.handler === handler);
        });
      }
      /**
       * Return a promise that will be fulfilled when the specified event occurs
       *
       * @param  {String} type
       * @param  {Number|undefined} timeout
       *
       * @return {Promise<Event>}
       */

    }, {
      key: "waitForEvent",
      value: function waitForEvent(type, timeout) {
        var promise = this.promises[type];

        if (!promise) {
          var resolve, reject;
          promise = new Promise(function (f1, f2) {
            resolve = f1;
            reject = f2;
          });
          promise.resolve = resolve;
          promise.reject = reject;
          this.promises[type] = promise;

          if (timeout) {
            setTimeout(function () {
              if (promise.reject) {
                promise.reject(new Error("No '".concat(type, "' event within ").concat(timeout, "ms")));
              }
            }, timeout);
          }
        }

        return promise;
      }
      /**
       * Return a promise that will be fulfilled when a 'change' event occurs
       *
       * @param  {String} type
       * @param  {Number|undefined} timeout
       *
       * @return {Promise<Event>}
       */

    }, {
      key: "change",
      value: function change(timeout) {
        return this.waitForEvent('change');
      }
      /**
       * Send event to event listeners, return true or false depending on whether
       * there were any listeners
       *
       * @param  {RelaksDjangoDataSourceEvent} evt
       *
       * @return {Boolean}
       */

    }, {
      key: "triggerEvent",
      value: function triggerEvent(evt) {
        var promise = this.promises[evt.type];

        if (promise) {
          delete this.promises[evt.type];
        }

        var listeners = this.listeners.filter(function (listener) {
          return listener.type === evt.type;
        });

        if (listeners.length === 0) {
          if (promise) {
            promise.reject = null;
            promise.resolve(evt);
            return true;
          } else {
            return false;
          }
        }

        evt.decisionPromise = this.dispatchEvent(evt, listeners).then(function () {
          if (promise) {
            promise.reject = null;
            promise.resolve(evt);
          }
        });
        return true;
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(evt, listeners) {
        var _this = this;

        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener.handler.call(evt.target, evt);

          if (evt.defaultPostponed) {
            var _ret = function () {
              var remainingListeners = listeners.slice(i + 1);
              return {
                v: evt.defaultPostponed.then(function (decision) {
                  if (decision === false) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                  }

                  if (!evt.propagationStopped) {
                    return _this.dispatchEvent(evt, remainingListeners);
                  }
                })
              };
            }();

            if (_typeof(_ret) === "object") return _ret.v;
          }

          if (evt.propagationStopped) {
            break;
          }
        }

        return Promise.resolve();
      }
    }]);

    return RelaksEventEmitter;
  }();

  var RelaksGenericEvent = /*#__PURE__*/function () {
    function RelaksGenericEvent(type, target, props) {
      _classCallCheck$1(this, RelaksGenericEvent);

      this.type = type;
      this.target = target;
      this.defaultPrevented = false;
      this.defaultPostponed = null;
      this.propagationStopped = false;
      this.decisionPromise = null;
      Object.assign(this, props);
    }

    _createClass$1(RelaksGenericEvent, [{
      key: "preventDefault",
      value: function preventDefault() {
        this.defaultPrevented = true;
      }
    }, {
      key: "postponeDefault",
      value: function postponeDefault(promise) {
        if (promise instanceof Function) {
          promise = promise();
        }

        if (!promise || !(promise.then instanceof Function)) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Non-promise passed to postponeDefault()');
          }

          return;
        }

        this.defaultPostponed = promise;
      }
    }, {
      key: "stopImmediatePropagation",
      value: function stopImmediatePropagation() {
        this.propagationStopped = true;
      }
    }, {
      key: "waitForDecision",
      value: function waitForDecision() {
        return Promise.resolve(this.decisionPromise);
      }
    }]);

    return RelaksGenericEvent;
  }();

  var elementClass;
  var containerClass;
  var createElementHandler;

  function setDOMHandler(config) {
    elementClass = config.element;
    containerClass = config.container;
    createElementHandler = config.create;
  }

  function getDOMClass() {
    return elementClass;
  }

  function createRichText(tokens, parentStyle) {
    var children = [];

    if (typeof tokens === 'string') {
      tokens = [{
        text: tokens
      }];
    }

    var _iterator = _createForOfIteratorHelper(tokens.entries()),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            index = _step$value[0],
            token = _step$value[1];

        var text = token.text,
            spanStyle = token.style;
        var hasStyle = false;

        if (text) {
          var style = {};

          if (parentStyle) {
            for (var _i = 0, _Object$entries = Object.entries(parentStyle); _i < _Object$entries.length; _i++) {
              var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                  name = _Object$entries$_i[0],
                  value = _Object$entries$_i[1];

              switch (name) {
                case 'color':
                case 'fontFamily':
                case 'fontSize':
                case 'fontStyle':
                case 'fontWeight':
                case 'textDecoration':
                case 'textUnderlinePosition':
                case 'textStroke':
                  style[name] = value;
                  hasStyle = true;
                  break;
              }
            }
          }

          if (spanStyle) {
            for (var _i2 = 0, _Object$entries2 = Object.entries(spanStyle); _i2 < _Object$entries2.length; _i2++) {
              var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                  _name = _Object$entries2$_i[0],
                  _value = _Object$entries2$_i[1];

              style[_name] = _value;
              hasStyle = true;
            }
          }

          if (hasStyle) {
            children.push(createElement('span', {
              key: index,
              style: style
            }, text));
          } else {
            children.push(text);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return createElement(containerClass, {}, children);
  }

  function createElement(tagName, props, children) {
    if (!createElementHandler) {
      throw new Error('No DOM handler');
    }

    return createElementHandler(tagName, props, children);
  }

  function getChildProps(tagName, props) {
    if (tagName === 'ul' || tagName === 'ol') {
      return {
        tagName: 'li'
      };
    } else if (tagName === 'tr') {
      return {
        tagName: 'td'
      };
    } else {
      return {};
    }
  }

  var _hash = _classPrivateFieldLooseKey("hash");

  var _width = _classPrivateFieldLooseKey("width");

  var _height = _classPrivateFieldLooseKey("height");

  var _originalWidth = _classPrivateFieldLooseKey("originalWidth");

  var _originalHeight = _classPrivateFieldLooseKey("originalHeight");

  var _format = _classPrivateFieldLooseKey("format");

  var _crop = _classPrivateFieldLooseKey("crop");

  var _location = _classPrivateFieldLooseKey("location");

  var Image = /*#__PURE__*/function () {
    _createClass(Image, [{
      key: "hash",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _hash)[_hash];
      }
    }, {
      key: "width",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _width)[_width];
      }
    }, {
      key: "height",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _height)[_height];
      }
    }, {
      key: "originalWidth",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _originalWidth)[_originalWidth];
      }
    }, {
      key: "originalHeight",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _originalHeight)[_originalHeight];
      }
    }, {
      key: "format",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _format)[_format];
      }
    }, {
      key: "crop",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _crop)[_crop];
      }
    }, {
      key: "url",
      get: function get() {
        return "".concat(_classPrivateFieldLooseBase(this, _location)[_location].baseURL, "/-/images/").concat(this.hash);
      }
    }]);

    function Image(json, location) {
      _classCallCheck(this, Image);

      Object.defineProperty(this, _hash, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _width, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _height, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _originalWidth, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _originalHeight, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _format, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _crop, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _location, {
        writable: true,
        value: void 0
      });
      var _json$hash = json.hash,
          hash = _json$hash === void 0 ? '' : _json$hash,
          width = json.width,
          height = json.height,
          crop = json.crop,
          format = json.format;
      _classPrivateFieldLooseBase(this, _hash)[_hash] = hash;

      if (crop) {
        _classPrivateFieldLooseBase(this, _width)[_width] = crop.width;
        _classPrivateFieldLooseBase(this, _height)[_height] = crop.height;
        _classPrivateFieldLooseBase(this, _originalWidth)[_originalWidth] = width;
        _classPrivateFieldLooseBase(this, _originalHeight)[_originalHeight] = height;
        _classPrivateFieldLooseBase(this, _crop)[_crop] = crop;
      } else {
        _classPrivateFieldLooseBase(this, _width)[_width] = width;
        _classPrivateFieldLooseBase(this, _height)[_height] = height;
        _classPrivateFieldLooseBase(this, _originalWidth)[_originalWidth] = width;
        _classPrivateFieldLooseBase(this, _originalHeight)[_originalHeight] = height;
      }

      _classPrivateFieldLooseBase(this, _format)[_format] = format;
      _classPrivateFieldLooseBase(this, _location)[_location] = location;
    }

    _createClass(Image, [{
      key: "getURL",
      value: function getURL(width, height, format, lossless) {
        var filters = [];

        if (this.crop) {
          var _this$crop = this.crop,
              left = _this$crop.left,
              top = _this$crop.top,
              _width2 = _this$crop.width,
              _height2 = _this$crop.height;
          filters.push("cr".concat(left, ",").concat(top, "-").concat(_width2, "x").concat(_height2));
        }

        filters.push("re".concat(width, "x").concat(height));

        if (lossless) {
          filters.push('l');
        }

        return "".concat(this.url, "/").concat(filters.join('+'), ".").concat(format);
      }
    }, {
      key: "getDimensionSets",
      value: function getDimensionSets(width, height) {
        var _this = this;

        var maxPixelRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

        if (!width && !height) {
          width = this.width;
          height = this.height;
        } else if (width && !height) {
          height = width * (this.height / this.width);
        } else if (!width && height) {
          width = height * (this.width / this.height);
        }

        var dimSets = [];

        for (var ratio = 1; ratio <= maxPixelRatio; ratio += 0.5) {
          var srcWidth = Math.floor(width * ratio);
          var srcHeight = Math.floor(height * ratio);

          if (srcWidth <= this.width && srcHeight <= this.height) {
            dimSets.push({
              width: srcWidth,
              height: srcHeight
            });
          } else {
            var _ret = function () {
              // use maximum size possible
              var maxWidth = void 0,
                  maxHeight = void 0;

              if (_this.width / _this.height > width / height) {
                maxHeight = _this.height;
                maxWidth = Math.floor(maxHeight * width / height);
              } else {
                maxWidth = _this.width;
                maxHeight = Math.floor(maxWidth * height / width);
              }

              if (!dimSets.find(function (d) {
                return d.width === maxWidth;
              })) {
                dimSets.push({
                  width: maxWidth,
                  height: maxHeight
                });
              }

              return "break";
            }();

            if (_ret === "break") break;
          }
        }

        return dimSets;
      }
    }, {
      key: "getSrcSet",
      value: function getSrcSet(dimSets, format, lossless) {
        var srcs = [];

        var _iterator = _createForOfIteratorHelper(dimSets),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _step.value,
                width = _step$value.width,
                height = _step$value.height;
            var url = this.getURL(width, height, format, lossless);
            srcs.push("".concat(url, " ").concat(width, "w"));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return srcs.join(', ');
      }
    }, {
      key: "uncrop",
      value: function uncrop() {
        return new Image({
          hash: this.hash,
          width: this.width,
          height: this.height,
          format: this.format
        }, _classPrivateFieldLooseBase(this, _location)[_location]);
      }
    }, {
      key: "render",
      value: function render(props) {
        var _props$tagName = props.tagName,
            tagName = _props$tagName === void 0 ? 'picture' : _props$tagName,
            width = props.width,
            height = props.height,
            others = _objectWithoutProperties(props, ["tagName", "width", "height"]);

        var dimSets = this.getDimensionSets(width, height);

        if (tagName === 'picture') {
          return this.renderPictureTag(dimSets, others);
        } else {
          return this.renderImgTag(dimSets, others);
        }
      }
    }, {
      key: "renderImgTag",
      value: function renderImgTag(dimSets, props) {
        var _dimSets$ = dimSets[0],
            width = _dimSets$.width,
            height = _dimSets$.height;
        var src = this.getURL(width, height, this.format);
        var srcset = this.getSrcSet(dimSets, this.format);
        return createElement('img', _objectSpread2({
          width: width,
          height: height,
          src: src,
          srcset: srcset
        }, props));
      }
    }, {
      key: "renderPictureTag",
      value: function renderPictureTag(dimSets, props) {
        var key = props.key,
            others = _objectWithoutProperties(props, ["key"]);

        var children = []; // add source tags

        if (this.format === 'png') {
          // provide lossless webp versions
          var _srcset = this.getSrcSet(dimSets, 'webp', true);

          var _srcProps = {
            key: children.length,
            srcset: _srcset,
            type: 'image/webp'
          };
          children.push(createElement('source', _srcProps));
        } else if (this.format === 'jpeg') {
          // provide lossly webp versions
          var _srcset2 = this.getSrcSet(dimSets, 'webp', false);

          var _srcProps2 = {
            key: children.length,
            srcset: _srcset2,
            type: 'image/webp'
          };
          children.push(createElement('source', _srcProps2));
        }

        var srcset = this.getSrcSet(dimSets, this.format);
        var srcProps = {
          key: children.length,
          srcset: srcset,
          type: "image/".concat(this.format)
        };
        children.push(createElement('source', srcProps)); // add img tag

        var _dimSets$2 = dimSets[0],
            width = _dimSets$2.width,
            height = _dimSets$2.height;
        var src = this.getURL(width, height, this.format);

        var imgProps = _objectSpread2({
          key: children.length,
          width: width,
          height: height,
          src: src
        }, others);

        children.push(createElement('img', imgProps));
        return createElement('picture', {
          key: key
        }, children);
      }
    }]);

    return Image;
  }();

  var _title = _classPrivateFieldLooseKey("title");

  var _keywords = _classPrivateFieldLooseKey("keywords");

  var _description = _classPrivateFieldLooseKey("description");

  var _subject = _classPrivateFieldLooseKey("subject");

  var _category = _classPrivateFieldLooseKey("category");

  var _status = _classPrivateFieldLooseKey("status");

  var _sheets = _classPrivateFieldLooseKey("sheets");

  var _location$1 = _classPrivateFieldLooseKey("location");

  var Workbook = /*#__PURE__*/function () {
    _createClass(Workbook, [{
      key: "title",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _title)[_title];
      }
    }, {
      key: "keywords",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _keywords)[_keywords];
      }
    }, {
      key: "description",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _description)[_description];
      }
    }, {
      key: "subject",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _subject)[_subject];
      }
    }, {
      key: "category",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _category)[_category];
      }
    }, {
      key: "status",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _status)[_status];
      }
    }, {
      key: "sheets",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheets)[_sheets];
      }
    }, {
      key: "location",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _location$1)[_location$1];
      }
    }]);

    function Workbook(json, location) {
      _classCallCheck(this, Workbook);

      Object.defineProperty(this, _title, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _keywords, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _description, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _subject, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _category, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _status, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _sheets, {
        writable: true,
        value: []
      });
      Object.defineProperty(this, _location$1, {
        writable: true,
        value: void 0
      });
      var _json$keywords = json.keywords,
          keywords = _json$keywords === void 0 ? '' : _json$keywords,
          _json$title = json.title,
          title = _json$title === void 0 ? '' : _json$title,
          _json$description = json.description,
          description = _json$description === void 0 ? '' : _json$description,
          _json$subject = json.subject,
          subject = _json$subject === void 0 ? '' : _json$subject,
          _json$category = json.category,
          category = _json$category === void 0 ? '' : _json$category,
          _json$status = json.status,
          status = _json$status === void 0 ? '' : _json$status,
          _json$sheets = json.sheets,
          sheets = _json$sheets === void 0 ? [] : _json$sheets;
      _classPrivateFieldLooseBase(this, _title)[_title] = title;
      _classPrivateFieldLooseBase(this, _keywords)[_keywords] = keywords;
      _classPrivateFieldLooseBase(this, _description)[_description] = description;
      _classPrivateFieldLooseBase(this, _subject)[_subject] = subject;
      _classPrivateFieldLooseBase(this, _category)[_category] = category;
      _classPrivateFieldLooseBase(this, _status)[_status] = status;
      _classPrivateFieldLooseBase(this, _location$1)[_location$1] = location;

      var _iterator = _createForOfIteratorHelper(sheets.entries()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              sheet = _step$value[1];

          _classPrivateFieldLooseBase(this, _sheets)[_sheets].push(new Sheet(this, sheet, index));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      attachProperties(_classPrivateFieldLooseBase(this, _sheets)[_sheets]);
    }

    _createClass(Workbook, [{
      key: "filter",
      value: function filter(flags) {
        return new WorkbookView(this, flags);
      }
    }]);

    return Workbook;
  }();

  var _workbook = _classPrivateFieldLooseKey("workbook");

  var _sheets2 = _classPrivateFieldLooseKey("sheets");

  var WorkbookView = /*#__PURE__*/function () {
    _createClass(WorkbookView, [{
      key: "title",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].title;
      }
    }, {
      key: "keywords",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].keywords;
      }
    }, {
      key: "description",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].description;
      }
    }, {
      key: "subject",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].subject;
      }
    }, {
      key: "category",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].category;
      }
    }, {
      key: "status",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook)[_workbook].status;
      }
    }, {
      key: "sheets",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheets2)[_sheets2];
      }
    }]);

    function WorkbookView(workbook, flags) {
      _classCallCheck(this, WorkbookView);

      Object.defineProperty(this, _workbook, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _sheets2, {
        writable: true,
        value: []
      });
      _classPrivateFieldLooseBase(this, _workbook)[_workbook] = workbook;
      var sheets = workbook.sheets;

      var _iterator2 = _createForOfIteratorHelper(filterObjects(sheets, flags)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var sheet = _step2.value;

          _classPrivateFieldLooseBase(this, _sheets2)[_sheets2].push(sheet.filter(flags));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      attachProperties(_classPrivateFieldLooseBase(this, _sheets2)[_sheets2]);
    }

    return WorkbookView;
  }();

  var _workbook2 = _classPrivateFieldLooseKey("workbook");

  var _name = _classPrivateFieldLooseKey("name");

  var _nameCC = _classPrivateFieldLooseKey("nameCC");

  var _nameKC = _classPrivateFieldLooseKey("nameKC");

  var _flags = _classPrivateFieldLooseKey("flags");

  var _index = _classPrivateFieldLooseKey("index");

  var _rows = _classPrivateFieldLooseKey("rows");

  var _columns = _classPrivateFieldLooseKey("columns");

  var Sheet = /*#__PURE__*/function () {
    _createClass(Sheet, [{
      key: "workbook",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _workbook2)[_workbook2];
      }
    }, {
      key: "name",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _name)[_name];
      }
    }, {
      key: "nameCC",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _nameCC)[_nameCC];
      }
    }, {
      key: "nameKC",
      get: function get() {
        if (!_classPrivateFieldLooseBase(this, _nameKC)[_nameKC]) {
          _classPrivateFieldLooseBase(this, _nameKC)[_nameKC] = kebabCase(_classPrivateFieldLooseBase(this, _nameCC)[_nameCC]);
        }

        return _classPrivateFieldLooseBase(this, _nameKC)[_nameKC];
      }
    }, {
      key: "flags",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _flags)[_flags];
      }
    }, {
      key: "index",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index)[_index];
      }
    }, {
      key: "number",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index)[_index] + 1;
      }
    }, {
      key: "rows",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _rows)[_rows];
      }
    }, {
      key: "columns",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _columns)[_columns];
      }
    }]);

    function Sheet(workbook, json, index) {
      _classCallCheck(this, Sheet);

      Object.defineProperty(this, _workbook2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _name, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _nameCC, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _nameKC, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _flags, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _index, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _rows, {
        writable: true,
        value: []
      });
      Object.defineProperty(this, _columns, {
        writable: true,
        value: []
      });
      var _json$name = json.name,
          name = _json$name === void 0 ? '' : _json$name,
          _json$nameCC = json.nameCC,
          nameCC = _json$nameCC === void 0 ? '' : _json$nameCC,
          _json$flags = json.flags,
          flags = _json$flags === void 0 ? [] : _json$flags,
          _json$rows = json.rows,
          _json$columns = json.columns,
          columns = _json$columns === void 0 ? [] : _json$columns;
      _classPrivateFieldLooseBase(this, _workbook2)[_workbook2] = workbook;
      _classPrivateFieldLooseBase(this, _name)[_name] = name;
      _classPrivateFieldLooseBase(this, _nameCC)[_nameCC] = nameCC;
      _classPrivateFieldLooseBase(this, _flags)[_flags] = flags;
      _classPrivateFieldLooseBase(this, _index)[_index] = index;

      var _iterator3 = _createForOfIteratorHelper(columns.entries()),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              _index2 = _step3$value[0],
              column = _step3$value[1];

          _classPrivateFieldLooseBase(this, _columns)[_columns].push(new Column(this, column, _index2));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var firstCol = _classPrivateFieldLooseBase(this, _columns)[_columns][0];

      var rowCount = firstCol ? firstCol.cells.length : 0;

      for (var i = 0; i < rowCount; i++) {
        _classPrivateFieldLooseBase(this, _rows)[_rows].push(new Row(this, i));
      }

      attachProperties(_classPrivateFieldLooseBase(this, _columns)[_columns]);
    }

    _createClass(Sheet, [{
      key: "cell",
      value: function cell(colIndex, rowIndex) {
        var column = this.columns[colIndex];

        if (rowIndex < 0) {
          return column.headers[column.headers.length + rowIndex];
        } else {
          return column.cells[rowIndex];
        }
      }
    }, {
      key: "get",
      value: function get(types) {
        var objects = [];

        var _iterator4 = _createForOfIteratorHelper(this.rows),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var row = _step4.value;
            objects.push(row.get(types));
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return objects;
      }
    }, {
      key: "filter",
      value: function filter(flags) {
        return new SheetView(this, flags);
      }
    }, {
      key: "render",
      value: function render(props) {
        var _props$tagName = props.tagName,
            tagName = _props$tagName === void 0 ? 'table' : _props$tagName,
            others = _objectWithoutProperties(props, ["tagName"]);

        var children;

        if (tagName === 'table') {
          var thead = this.renderTableHead();
          var tbody = this.renderTableBody();
          children = thead ? [thead, tbody] : [tbody];
        } else {
          var childProps = getChildProps(tagName);
          children = [];

          var _iterator5 = _createForOfIteratorHelper(this.rows.entries()),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _step5$value = _slicedToArray(_step5.value, 2),
                  index = _step5$value[0],
                  row = _step5$value[1];

              children.push(row.render(_objectSpread2({
                key: index
              }, childProps)));
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }

        return createElement(tagName, others, children);
      }
    }, {
      key: "renderTableHead",
      value: function renderTableHead() {
        var rowCount = this.columns[0].headers.length;

        if (rowCount > 0) {
          var rows = [];

          for (var i = 0; i < rowCount; i++) {
            var children = [];

            var _iterator6 = _createForOfIteratorHelper(this.columns.entries()),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var _step6$value = _slicedToArray(_step6.value, 2),
                    index = _step6$value[0],
                    column = _step6$value[1];

                var header = column.headers[i];
                children.push(header.render({
                  key: index,
                  tagName: 'th'
                }));
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }

            rows.push(createElement('tr', {
              key: i
            }, children));
          }

          return createElement('thead', {}, rows);
        }
      }
    }, {
      key: "renderTableBody",
      value: function renderTableBody() {
        var children = [];

        var _iterator7 = _createForOfIteratorHelper(this.rows.entries()),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _step7$value = _slicedToArray(_step7.value, 2),
                index = _step7$value[0],
                row = _step7$value[1];

            children.push(row.render({
              key: index,
              tagName: 'tr'
            }));
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        return createElement('tbody', {}, children);
      }
    }]);

    return Sheet;
  }();

  var _sheet = _classPrivateFieldLooseKey("sheet");

  var _columns2 = _classPrivateFieldLooseKey("columns");

  var _rows2 = _classPrivateFieldLooseKey("rows");

  var SheetView = /*#__PURE__*/function () {
    _createClass(SheetView, [{
      key: "workbook",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].workbook;
      }
    }, {
      key: "name",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].name;
      }
    }, {
      key: "nameCC",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].nameCC;
      }
    }, {
      key: "nameKC",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].nameKC;
      }
    }, {
      key: "flags",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].flags;
      }
    }, {
      key: "index",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].index;
      }
    }, {
      key: "number",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet)[_sheet].number;
      }
    }, {
      key: "rows",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _rows2)[_rows2];
      }
    }, {
      key: "columns",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _columns2)[_columns2];
      }
    }]);

    function SheetView(sheet, flags) {
      _classCallCheck(this, SheetView);

      Object.defineProperty(this, _sheet, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _columns2, {
        writable: true,
        value: []
      });
      Object.defineProperty(this, _rows2, {
        writable: true,
        value: []
      });
      _classPrivateFieldLooseBase(this, _sheet)[_sheet] = sheet;
      var columns = sheet.columns,
          rows = sheet.rows;

      var _iterator8 = _createForOfIteratorHelper(filterObjects(columns, flags)),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var column = _step8.value;

          _classPrivateFieldLooseBase(this, _columns2)[_columns2].push(column);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      for (var i = 0; i < rows.length; i++) {
        _classPrivateFieldLooseBase(this, _rows2)[_rows2].push(new Row(this, i));
      }

      attachProperties(_classPrivateFieldLooseBase(this, _columns2)[_columns2]);
    }

    _createClass(SheetView, [{
      key: "render",
      value: function render(props) {
        var f = Sheet.prototype.render;
        return f.call(this, props);
      }
    }]);

    return SheetView;
  }();

  var _sheet2 = _classPrivateFieldLooseKey("sheet");

  var _name2 = _classPrivateFieldLooseKey("name");

  var _nameCC2 = _classPrivateFieldLooseKey("nameCC");

  var _nameKC2 = _classPrivateFieldLooseKey("nameKC");

  var _flags2 = _classPrivateFieldLooseKey("flags");

  var _index3 = _classPrivateFieldLooseKey("index");

  var _headers = _classPrivateFieldLooseKey("headers");

  var _cells = _classPrivateFieldLooseKey("cells");

  var Column = /*#__PURE__*/function () {
    _createClass(Column, [{
      key: "sheet",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet2)[_sheet2];
      }
    }, {
      key: "name",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _name2)[_name2];
      }
    }, {
      key: "nameCC",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _nameCC2)[_nameCC2];
      }
    }, {
      key: "nameKC",
      get: function get() {
        if (!_classPrivateFieldLooseBase(this, _nameKC2)[_nameKC2]) {
          _classPrivateFieldLooseBase(this, _nameKC2)[_nameKC2] = kebabCase(_classPrivateFieldLooseBase(this, _nameCC2)[_nameCC2]);
        }

        return _classPrivateFieldLooseBase(this, _nameKC2)[_nameKC2];
      }
    }, {
      key: "flags",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _flags2)[_flags2];
      }
    }, {
      key: "headers",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _headers)[_headers];
      }
    }, {
      key: "index",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index3)[_index3];
      }
    }, {
      key: "number",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index3)[_index3] + 1;
      }
    }, {
      key: "cells",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _cells)[_cells];
      }
    }]);

    function Column(sheet, json, index) {
      _classCallCheck(this, Column);

      Object.defineProperty(this, _sheet2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _name2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _nameCC2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _nameKC2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _flags2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _index3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _headers, {
        writable: true,
        value: []
      });
      Object.defineProperty(this, _cells, {
        writable: true,
        value: []
      });
      var _json$name2 = json.name,
          name = _json$name2 === void 0 ? '' : _json$name2,
          _json$nameCC2 = json.nameCC,
          nameCC = _json$nameCC2 === void 0 ? '' : _json$nameCC2,
          _json$flags2 = json.flags,
          flags = _json$flags2 === void 0 ? [] : _json$flags2,
          _json$headers = json.headers,
          headers = _json$headers === void 0 ? [] : _json$headers,
          _json$cells = json.cells,
          cells = _json$cells === void 0 ? [] : _json$cells;
      _classPrivateFieldLooseBase(this, _sheet2)[_sheet2] = sheet;
      _classPrivateFieldLooseBase(this, _name2)[_name2] = name;
      _classPrivateFieldLooseBase(this, _nameCC2)[_nameCC2] = nameCC;
      _classPrivateFieldLooseBase(this, _flags2)[_flags2] = flags;
      _classPrivateFieldLooseBase(this, _index3)[_index3] = index;

      var _iterator9 = _createForOfIteratorHelper(headers.entries()),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _step9$value = _slicedToArray(_step9.value, 2),
              headerIndex = _step9$value[0],
              header = _step9$value[1];

          var rowIndex = headerIndex - headers.length;

          _classPrivateFieldLooseBase(this, _headers)[_headers].push(new Cell(sheet, header, index, rowIndex));
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      var _iterator10 = _createForOfIteratorHelper(cells.entries()),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              _rowIndex = _step10$value[0],
              cell = _step10$value[1];

          _classPrivateFieldLooseBase(this, _cells)[_cells].push(new Cell(sheet, cell, index, _rowIndex));
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }

    _createClass(Column, [{
      key: "get",
      value: function get(type) {
        var values = [];

        var _iterator11 = _createForOfIteratorHelper(this.cells),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var cell = _step11.value;
            var value = cell.get(type);
            values.push(value);
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        return values;
      }
    }, {
      key: "render",
      value: function render(props) {
        var _ref = props || {},
            _ref$tagName = _ref.tagName,
            tagName = _ref$tagName === void 0 ? 'ul' : _ref$tagName,
            others = _objectWithoutProperties(_ref, ["tagName"]);

        var childProps = getChildProps(tagName);
        var children = [];

        var _iterator12 = _createForOfIteratorHelper(this.cells.entries()),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _step12$value = _slicedToArray(_step12.value, 2),
                index = _step12$value[0],
                cell = _step12$value[1];

            children.push(cell.render(_objectSpread2({
              key: index
            }, childProps)));
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        return createElement(tagName, others, children);
      }
    }]);

    return Column;
  }();

  var _sheet3 = _classPrivateFieldLooseKey("sheet");

  var _index4 = _classPrivateFieldLooseKey("index");

  var _cells2 = _classPrivateFieldLooseKey("cells");

  var Row = /*#__PURE__*/function () {
    _createClass(Row, [{
      key: "sheet",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet3)[_sheet3];
      }
    }, {
      key: "index",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index4)[_index4];
      }
    }, {
      key: "number",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _index4)[_index4] + 1;
      }
    }, {
      key: "cells",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _cells2)[_cells2];
      }
    }]);

    function Row(sheet, index) {
      _classCallCheck(this, Row);

      Object.defineProperty(this, _sheet3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _index4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _cells2, {
        writable: true,
        value: []
      });
      _classPrivateFieldLooseBase(this, _sheet3)[_sheet3] = sheet;
      _classPrivateFieldLooseBase(this, _index4)[_index4] = index;
      var columns = sheet.columns;

      var _iterator13 = _createForOfIteratorHelper(columns),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var column = _step13.value;

          _classPrivateFieldLooseBase(this, _cells2)[_cells2].push(column.cells[_classPrivateFieldLooseBase(this, _index4)[_index4]]);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      attachProperties(_classPrivateFieldLooseBase(this, _cells2)[_cells2]);
    }

    _createClass(Row, [{
      key: "get",
      value: function get(types) {
        var object = {};

        for (var _i = 0, _Object$entries = Object.entries(types); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              name = _Object$entries$_i[0],
              type = _Object$entries$_i[1];

          var cell = this.cells[name];

          if (!cell) {
            var msg = "Sheet \"".concat(this.sheet.nameCC, "\" does not have the column \"").concat(name, "\"");
            throw new TypeError(msg);
          }

          object[name] = cell.get(type);
        }

        return object;
      }
    }, {
      key: "render",
      value: function render(props) {
        var _ref2 = props || {},
            _ref2$tagName = _ref2.tagName,
            tagName = _ref2$tagName === void 0 ? 'ul' : _ref2$tagName,
            others = _objectWithoutProperties(_ref2, ["tagName"]);

        var childProps = getChildProps(tagName);
        var children = this.cells.entries.map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              index = _ref4[0],
              cell = _ref4[1];

          return cell.render(_objectSpread2({
            key: index
          }, childProps));
        });
        return createElement(tagName, others, children);
      }
    }]);

    return Row;
  }();

  var _sheet4 = _classPrivateFieldLooseKey("sheet");

  var _value = _classPrivateFieldLooseKey("value");

  var _text = _classPrivateFieldLooseKey("text");

  var _richText = _classPrivateFieldLooseKey("richText");

  var _style = _classPrivateFieldLooseKey("style");

  var _image = _classPrivateFieldLooseKey("image");

  var _rowIndex2 = _classPrivateFieldLooseKey("rowIndex");

  var _colIndex = _classPrivateFieldLooseKey("colIndex");

  var _master = _classPrivateFieldLooseKey("master");

  var _masterIndices = _classPrivateFieldLooseKey("masterIndices");

  var _copy = _classPrivateFieldLooseKey("copy");

  var Cell = /*#__PURE__*/function () {
    _createClass(Cell, [{
      key: "sheet",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet4)[_sheet4];
      }
    }, {
      key: "value",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        return _classPrivateFieldLooseBase(this, _value)[_value];
      }
    }, {
      key: "text",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        return _classPrivateFieldLooseBase(this, _text)[_text];
      }
    }, {
      key: "richText",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        if (!_classPrivateFieldLooseBase(this, _richText)[_richText]) {
          var tokens = _classPrivateFieldLooseBase(this, _value)[_value] instanceof Array ? _classPrivateFieldLooseBase(this, _value)[_value] : _classPrivateFieldLooseBase(this, _text)[_text];
          _classPrivateFieldLooseBase(this, _richText)[_richText] = createRichText(tokens, _classPrivateFieldLooseBase(this, _style)[_style]);
        }

        return _classPrivateFieldLooseBase(this, _richText)[_richText];
      }
    }, {
      key: "image",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        return _classPrivateFieldLooseBase(this, _image)[_image];
      }
    }, {
      key: "style",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        return _classPrivateFieldLooseBase(this, _style)[_style];
      }
    }, {
      key: "rowIndex",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _rowIndex2)[_rowIndex2];
      }
    }, {
      key: "rowNumber",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _rowIndex2)[_rowIndex2] + 1;
      }
    }, {
      key: "column",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _sheet4)[_sheet4].columns[_classPrivateFieldLooseBase(this, _colIndex)[_colIndex]];
      }
    }, {
      key: "columnIndex",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _colIndex)[_colIndex];
      }
    }, {
      key: "columnNumber",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _colIndex)[_colIndex] + 1;
      }
    }, {
      key: "name",
      get: function get() {
        return this.column.name;
      }
    }, {
      key: "nameCC",
      get: function get() {
        return this.column.nameCC;
      }
    }, {
      key: "nameKC",
      get: function get() {
        return this.column.nameKC;
      }
    }, {
      key: "master",
      get: function get() {
        _classPrivateFieldLooseBase(this, _copy)[_copy]();

        return _classPrivateFieldLooseBase(this, _master)[_master];
      }
    }]);

    function Cell(sheet, json, colIndex, rowIndex) {
      _classCallCheck(this, Cell);

      Object.defineProperty(this, _copy, {
        value: _copy2
      });
      Object.defineProperty(this, _sheet4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _value, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _text, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _richText, {
        writable: true,
        value: null
      });
      Object.defineProperty(this, _style, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _image, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _rowIndex2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _colIndex, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _master, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _masterIndices, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _sheet4)[_sheet4] = sheet;
      _classPrivateFieldLooseBase(this, _colIndex)[_colIndex] = colIndex;
      _classPrivateFieldLooseBase(this, _rowIndex2)[_rowIndex2] = rowIndex;

      if (json.master) {
        _classPrivateFieldLooseBase(this, _masterIndices)[_masterIndices] = json.master;
      } else {
        var _json$value = json.value,
            value = _json$value === void 0 ? null : _json$value,
            text = json.text,
            _json$style = json.style,
            style = _json$style === void 0 ? {} : _json$style,
            image = json.image,
            master = json.master;
        _classPrivateFieldLooseBase(this, _value)[_value] = value;
        _classPrivateFieldLooseBase(this, _text)[_text] = text || stringifyValue(value);
        _classPrivateFieldLooseBase(this, _style)[_style] = style;

        if (image) {
          _classPrivateFieldLooseBase(this, _image)[_image] = new Image(image, sheet.workbook.location);
        }
      }
    }

    _createClass(Cell, [{
      key: "get",
      value: function get(type) {
        if (type === String) {
          return this.text;
        } else if (type === Number) {
          return typeof this.value === 'number' ? this.value : NaN;
        } else if (type === Date) {
          return this.value instanceof Date ? this.value : new Date(NaN);
        } else if (type === Image) {
          return this.image;
        } else if (type === getDOMClass()) {
          return this.richText;
        } else {
          var msg = "Unable to map type \"".concat(type.name, "\" to a property");
          throw new TypeError(msg);
        }
      }
    }, {
      key: "render",
      value: function render(props) {
        var _ref5 = props || {},
            _ref5$tagName = _ref5.tagName,
            tagName = _ref5$tagName === void 0 ? 'div' : _ref5$tagName,
            otherStyle = _ref5.style,
            imageProps = _ref5.image,
            others = _objectWithoutProperties(_ref5, ["tagName", "style", "image"]);

        var style = _objectSpread2(_objectSpread2({}, this.style), otherStyle);

        var tokens = this.value instanceof Array ? this.value : this.text;
        var richText = createRichText(tokens, null);
        var children;

        if (this.image) {
          if (this.text) {
            var img = this.image.render(_objectSpread2({
              key: 0
            }, imageProps));
            var legend = createElement('figcaption', {
              key: 1
            }, richText);
            children = createElement('figure', {}, [img, legend]);
          } else {
            children = this.image.render(imageProps);
          }
        } else {
          children = richText;
        }

        return createElement(tagName, _objectSpread2({
          style: style
        }, others), children);
      }
    }]);

    return Cell;
  }();

  var _copy2 = function _copy2() {
    if (_classPrivateFieldLooseBase(this, _masterIndices)[_masterIndices] && !_classPrivateFieldLooseBase(this, _master)[_master]) {
      var _classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _masterIndices)[_masterIndices],
          col = _classPrivateFieldLoo.col,
          row = _classPrivateFieldLoo.row;

      var cell = _classPrivateFieldLooseBase(this, _sheet4)[_sheet4].cell(col, row);

      if (cell) {
        _classPrivateFieldLooseBase(this, _value)[_value] = cell.value;
        _classPrivateFieldLooseBase(this, _text)[_text] = cell.text;
        _classPrivateFieldLooseBase(this, _style)[_style] = cell.style;
        _classPrivateFieldLooseBase(this, _richText)[_richText] = cell.richText;
        _classPrivateFieldLooseBase(this, _image)[_image] = cell.image;
        _classPrivateFieldLooseBase(this, _master)[_master] = cell;
      }
    }
  };

  function attachProperties(objects) {
    var _iterator14 = _createForOfIteratorHelper(objects),
        _step14;

    try {
      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
        var object = _step14.value;

        if (!objects[object.nameCC]) {
          objects[object.nameCC] = object;
        }
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
  }

  function filterObjects(objects, flags) {
    var slots = {};

    var _iterator15 = _createForOfIteratorHelper(objects),
        _step15;

    try {
      for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
        var object = _step15.value;
        // see how closely is the match
        var score = calculateMatch(object.flags, flags);
        var slot = slots[object.nameCC];

        if (slot) {
          if (slot.score < score) {
            slot.object = object;
            slot.score = score;
          }
        } else {
          slots[object.nameCC] = {
            object: object,
            score: score
          };
        }
      }
    } catch (err) {
      _iterator15.e(err);
    } finally {
      _iterator15.f();
    }

    var remaining = [];

    var _iterator16 = _createForOfIteratorHelper(objects),
        _step16;

    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var _object = _step16.value;
        var _slot = slots[_object.nameCC];

        if (_slot.object === _object) {
          remaining.push(_object);
        }
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }

    return remaining;
  }

  function calculateMatch(objFlags, flags) {
    var overallScore = 0;

    var _iterator17 = _createForOfIteratorHelper(flags),
        _step17;

    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var flag = _step17.value;
        var flagScore = 0;

        var _iterator18 = _createForOfIteratorHelper(objFlags),
            _step18;

        try {
          for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
            var objFlag = _step18.value;
            var score = 0;

            if (objFlag === flag) {
              score = 1;
            } else if (flagScore === 0) {
              var _parseLocale = parseLocale(objFlag),
                  _parseLocale2 = _slicedToArray(_parseLocale, 2),
                  objLang = _parseLocale2[0],
                  objCountry = _parseLocale2[1];

              var _parseLocale3 = parseLocale(flag),
                  _parseLocale4 = _slicedToArray(_parseLocale3, 2),
                  lang = _parseLocale4[0],
                  country = _parseLocale4[1];

              if (lang && objLang === lang) {
                // score is lower on conflict
                score = country && objCountry ? 0.25 : 0.5;
              } else if (country && objCountry === country) {
                score = lang && objLang ? 0.25 : 0.5;
              }
            }

            if (score > flagScore) {
              flagScore = score;
            }
          }
        } catch (err) {
          _iterator18.e(err);
        } finally {
          _iterator18.f();
        }

        overallScore += flagScore;
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }

    return overallScore;
  }

  function parseLocale(locale) {
    var m, language, country;

    if (m = /^([a-z]{2})-([A-Z]{2})$/.exec(locale)) {
      language = m[1];
      country = m[2];
    } else if (m = /^[a-z]{2}$/.exec(locale)) {
      language = m[0];
    } else if (m = /^[A-Z]{2}$/.exec(locale)) {
      country = m[0];
    }

    return [language, country];
  }

  function stringifyValue(value) {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value.toLocaleString();
    } else if (value instanceof Date) {
      var options = {
        dateStyle: 'short',
        timeStyle: 'short'
      };
      return value.toLocaleDateString(undefined, options);
    } else if (value instanceof Array) {
      return value.map(function (t) {
        return t.text;
      }).join('');
    } else if (value && value.error) {
      return '#ERR';
    } else {
      return '';
    }
  }

  function kebabCase(nameCC) {
    return nameCC.replace(/[A-Z]/g, function (m0) {
      return '-' + m0.toLowerCase();
    });
  }

  var DataSource = /*#__PURE__*/function (_EventEmitter) {
    _inherits(DataSource, _EventEmitter);

    var _super = _createSuper(DataSource);

    function DataSource(options) {
      var _this;

      _classCallCheck(this, DataSource);

      _this = _super.call(this);
      var _options$baseURL = options.baseURL,
          baseURL = _options$baseURL === void 0 ? '/' : _options$baseURL,
          _options$refresh = options.refresh,
          refresh = _options$refresh === void 0 ? 60 : _options$refresh,
          _options$retry = options.retry,
          retry = _options$retry === void 0 ? 10 : _options$retry,
          _options$stale = options.stale,
          stale = _options$stale === void 0 ? 1 : _options$stale;
      _this.baseURL = baseURL + (baseURL.endsWith('/') ? '' : '/');
      _this.intervals = {
        refresh: refresh,
        retry: retry,
        stale: stale
      };
      _this.queries = [];
      _this.updateTime = null;
      _this.updateTimeout = 0;
      _this.stopped = false;
      return _this;
    }

    _createClass(DataSource, [{
      key: "fetchWorkbook",
      value: function () {
        var _fetchWorkbook = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", this.fetch(Workbook, name));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchWorkbook(_x) {
          return _fetchWorkbook.apply(this, arguments);
        }

        return fetchWorkbook;
      }()
    }, {
      key: "fetchJSON",
      value: function () {
        var _fetchJSON = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", this.fetch(Object, name));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function fetchJSON(_x2) {
          return _fetchJSON.apply(this, arguments);
        }

        return fetchJSON;
      }()
    }, {
      key: "start",
      value: function start() {
        this.stopped = false;
        this.scheduleNextUpdate();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.stopped = true;

        if (this.updateTimeout) {
          clearTimeout(this.updateTimeout);
          this.updateTime = null;
          this.updateTimeout = 0;
        }
      }
    }, {
      key: "fetch",
      value: function () {
        var _fetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(type, name) {
          var query;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  query = this.getQuery(type, name);
                  _context3.next = 3;
                  return query.retrieval;

                case 3:
                  return _context3.abrupt("return", query.result);

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function fetch(_x3, _x4) {
          return _fetch.apply(this, arguments);
        }

        return fetch;
      }()
    }, {
      key: "getQuery",
      value: function getQuery(type, name) {
        var query = this.queries.find(function (q) {
          return q.type === type && q.name === name;
        });

        if (query) {
          if (query.error) {
            var now = new Date();

            if (query.refreshTime && now > query.refreshTime) {
              query.retrieval = this.runQuery(query);
            }
          }
        } else {
          query = {
            type: type,
            name: name,
            etag: '',
            result: null,
            retrieval: null,
            refreshTime: null,
            error: null
          };
          this.queries.push(query);
          query.retrieval = this.runQuery(query);
        }

        return query;
      }
    }, {
      key: "runQuery",
      value: function () {
        var _runQuery = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(query) {
          var type, name, url, res, text, etag, status, changed, json, location, refreshType;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;
                  query.error = null;
                  type = query.type, name = query.name;
                  url = this.getURL(name);
                  _context4.next = 6;
                  return fetch(url);

                case 6:
                  res = _context4.sent;

                  if (res.ok) {
                    _context4.next = 12;
                    break;
                  }

                  _context4.next = 10;
                  return res.text();

                case 10:
                  text = _context4.sent;
                  throw new DataSourceError(res.status, res.statusText, text);

                case 12:
                  etag = res.headers.get('etag');
                  status = res.headers.get('x-cache-status');
                  changed = false;

                  if (!(!etag || etag !== query.etag)) {
                    _context4.next = 23;
                    break;
                  }

                  _context4.next = 18;
                  return res.json();

                case 18:
                  json = _context4.sent;
                  location = {
                    name: name,
                    url: url,
                    baseURL: this.baseURL
                  };
                  query.result = type === Object ? json : new type(json, location);
                  query.etag = etag;
                  changed = true;

                case 23:
                  refreshType = status === 'STALE' || status === 'UPDATING' ? 'stale' : 'refresh';
                  query.refreshTime = this.scheduleUpdate(refreshType);
                  query.retrieval = null;
                  return _context4.abrupt("return", changed);

                case 29:
                  _context4.prev = 29;
                  _context4.t0 = _context4["catch"](0);
                  query.error = _context4.t0;

                  if (!(400 <= _context4.t0.status && _context4.t0.status <= 499)) {
                    query.refreshTime = this.scheduleUpdate('retry');
                  }

                  throw _context4.t0;

                case 34:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this, [[0, 29]]);
        }));

        function runQuery(_x5) {
          return _runQuery.apply(this, arguments);
        }

        return runQuery;
      }()
    }, {
      key: "scheduleUpdate",
      value: function scheduleUpdate(type) {
        var interval = this.intervals[type];

        if (interval === false) {
          return;
        }

        var now = new Date();
        var later = new Date(now.getTime() + interval * 1000);

        if (!this.updateTime || this.updateTime > later) {
          this.rescheduleUpdate(later);
        }

        return later;
      }
    }, {
      key: "rescheduleUpdate",
      value: function rescheduleUpdate(later) {
        var _this2 = this;

        var now = new Date();

        if (this.updateTimeout) {
          clearTimeout(this.updateTimeout);
        }

        this.updateTime = later;
        this.updateTimeout = setTimeout(function () {
          _this2.updateTime = null;
          _this2.updateTimeout = 0;

          _this2.update();
        }, later - now);
      }
    }, {
      key: "scheduleNextUpdate",
      value: function scheduleNextUpdate() {
        var earliest;

        var _iterator = _createForOfIteratorHelper(this.queries),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var query = _step.value;

            if (!earliest || earliest > query.refreshTime) {
              earliest = query.refreshTime;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (earliest) {
          if (!this.updateTime || this.updateTime > earliest) {
            this.rescheduleUpdate(earliest);
          }
        }
      }
    }, {
      key: "scheduleUpdateOnEvent",
      value: function scheduleUpdateOnEvent(target, event) {
        var _this3 = this;

        var listener = function listener(evt) {
          target.removeEventListener(event, listener);

          _this3.update();
        };

        target.addEventListener(event, listener);
      }
    }, {
      key: "update",
      value: function () {
        var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          var now, changed, _iterator2, _step2, query;

          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!this.stopped) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt("return");

                case 2:
                  if (!(typeof Window === 'function')) {
                    _context5.next = 11;
                    break;
                  }

                  if (!(document.hidden === false)) {
                    _context5.next = 8;
                    break;
                  }

                  this.scheduleUpdateOnEvent(document, 'visibilitychange');
                  return _context5.abrupt("return");

                case 8:
                  if (!(navigator.onLine === false)) {
                    _context5.next = 11;
                    break;
                  }

                  this.scheduleUpdateOnEvent(window, 'online');
                  return _context5.abrupt("return");

                case 11:
                  now = new Date();
                  changed = false;
                  _iterator2 = _createForOfIteratorHelper(this.queries);
                  _context5.prev = 14;

                  _iterator2.s();

                case 16:
                  if ((_step2 = _iterator2.n()).done) {
                    _context5.next = 30;
                    break;
                  }

                  query = _step2.value;

                  if (!(Math.abs(now - query.refreshTime) < 1000)) {
                    _context5.next = 28;
                    break;
                  }

                  _context5.prev = 19;
                  _context5.next = 22;
                  return this.runQuery(query);

                case 22:
                  if (!_context5.sent) {
                    _context5.next = 24;
                    break;
                  }

                  changed = true;

                case 24:
                  _context5.next = 28;
                  break;

                case 26:
                  _context5.prev = 26;
                  _context5.t0 = _context5["catch"](19);

                case 28:
                  _context5.next = 16;
                  break;

                case 30:
                  _context5.next = 35;
                  break;

                case 32:
                  _context5.prev = 32;
                  _context5.t1 = _context5["catch"](14);

                  _iterator2.e(_context5.t1);

                case 35:
                  _context5.prev = 35;

                  _iterator2.f();

                  return _context5.finish(35);

                case 38:
                  this.scheduleNextUpdate();

                  if (changed) {
                    this.triggerEvent(new DataSourceEvent('change'));
                  }

                case 40:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this, [[14, 32, 35, 38], [19, 26]]);
        }));

        function update() {
          return _update.apply(this, arguments);
        }

        return update;
      }()
    }, {
      key: "getURL",
      value: function getURL(name) {
        return "".concat(this.baseURL, "-/data/").concat(name);
      }
    }]);

    return DataSource;
  }(RelaksEventEmitter);

  var DataSourceEvent = /*#__PURE__*/function (_GenericEvent) {
    _inherits(DataSourceEvent, _GenericEvent);

    var _super2 = _createSuper(DataSourceEvent);

    function DataSourceEvent() {
      _classCallCheck(this, DataSourceEvent);

      return _super2.apply(this, arguments);
    }

    return DataSourceEvent;
  }(RelaksGenericEvent);

  var DataSourceError = /*#__PURE__*/function (_Error) {
    _inherits(DataSourceError, _Error);

    var _super3 = _createSuper(DataSourceError);

    function DataSourceError(status, statusText, text) {
      var _this4;

      _classCallCheck(this, DataSourceError);

      _this4 = _super3.call(this, "".concat(status, " ").concat(statusText));
      _this4.status = status;
      _this4.statusText = statusText;
      _this4.text = text;
      return _this4;
    }

    return DataSourceError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  setDOMHandler({
    element: react.ReactElement,
    container: react.Fragment,
    create: react.createElement
  });

  exports.Cell = Cell;
  exports.Column = Column;
  exports.DataSource = DataSource;
  exports.DataSourceError = DataSourceError;
  exports.DataSourceEvent = DataSourceEvent;
  exports.Image = Image;
  exports.Row = Row;
  exports.Sheet = Sheet;
  exports.SheetView = SheetView;
  exports.Workbook = Workbook;
  exports.WorkbookView = WorkbookView;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
