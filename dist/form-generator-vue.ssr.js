'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
}var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    schema: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
};var UTILS = {
  isUndef: function isUndef(val) {
    return typeof val === 'undefined';
  },
  isObjOnly: function isObjOnly(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val);
    }

    return val.every(function (v) {
      return UTILS.isObj(v) && !UTILS.isArr(v);
    });
  },
  isObj: function isObj(val) {
    if (!UTILS.isArr(val)) {
      return _typeof(val) === 'object';
    }

    return val.every(function (v) {
      return _typeof(v) === 'object';
    });
  },
  isArr: function isArr(val) {
    return Array.isArray(val);
  },
  isFunc: function isFunc(val) {
    return typeof val === 'function';
  },
  isBool: function isBool(val) {
    return typeof val === 'boolean';
  },
  isStr: function isStr(val) {
    return typeof val === 'string';
  },
  throwError: function throwError(msg) {
    throw new Error(msg);
  },
  hasProperty: function hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }

    return children.every(function (child) {
      return child in parent;
    });
  },
  handleFunc: function handleFunc(func, params) {
    if (UTILS.isFunc(func)) {
      return func(params);
    }
  },
  handleFuncOrBool: function handleFuncOrBool(val) {
    var funcParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  },
  debounce: function debounce(func) {
    var debounce_timeout;
    return function (time, data) {
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(function () {
        clearTimeout(debounce_timeout);
        func(data);
      }, time);
    };
  },
  logger: function logger(items) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var show = options.show,
        warn = options.warn;

    if (show) {
      var _console2;

      if (warn) {
        var _console;

        (_console = console).warn.apply(_console, _toConsumableArray(items));

        return;
      }

      (_console2 = console).log.apply(_console2, _toConsumableArray(items));
    }
  }
};var modelName = function modelName(s) {
  var _s$model;

  return UTILS.isArr(s === null || s === void 0 ? void 0 : s.model) && ((_s$model = s.model) === null || _s$model === void 0 ? void 0 : _s$model[0]) || (s === null || s === void 0 ? void 0 : s.model);
};

var createModel = function createModel(schema, val) {
  var models = {};

  (function init(s) {
    if (s === null || s === void 0 ? void 0 : s.model) {
      var _val$modelName, _val$modelName2;

      models[modelName(s)] = {
        value: val === null || val === void 0 ? void 0 : (_val$modelName = val[modelName(s)]) === null || _val$modelName === void 0 ? void 0 : _val$modelName.value,
        error: val === null || val === void 0 ? void 0 : (_val$modelName2 = val[modelName(s)]) === null || _val$modelName2 === void 0 ? void 0 : _val$modelName2.error
      };
      Object.defineProperty(models[modelName(s)], 'options', {
        value: (s === null || s === void 0 ? void 0 : s.options) || {},
        enumerable: false
      });
    }

    if (s === null || s === void 0 ? void 0 : s.children) {
      s === null || s === void 0 ? void 0 : s.children.forEach(function (i) {
        return init(i);
      });
    }
  })(schema);

  return models;
};

var script = {
  mixins: [props],
  emits: ['input'],
  data: function data() {
    var models = createModel(this.schema, this.value);
    return {
      models: models
    };
  },
  watch: {
    value: {
      handler: 'watchValue',
      deep: true
    },
    models: {
      handler: 'watchModels',
      deep: true,
      immediate: true
    }
  },
  created: function created() {
    var _this = this;

    Object.keys(this.models).forEach(function (m) {
      _this.$watch("models.".concat(m, ".value"), function () {
        _this.validateModel(m);
      }, {
        deep: true
      });
    });
  },
  mounted: function mounted() {
    var _this$schema, _this$schema$options;

    if (this === null || this === void 0 ? void 0 : (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$options = _this$schema.options) === null || _this$schema$options === void 0 ? void 0 : _this$schema$options.onLoadValidation) {
      this.validate();
    }
  },
  methods: {
    watchValue: function watchValue(v) {
      for (var m in v) {
        this.models[m].value = v === null || v === void 0 ? void 0 : v[m].value;
        this.models[m].error = v === null || v === void 0 ? void 0 : v[m].error;
      }
    },
    watchModels: function watchModels(v) {
      this.$emit('input', v);
    },
    resetValidation: function resetValidation() {
      for (var m in this.models) {
        this.models[m].error = '';
      }
    },
    reset: function reset() {
      for (var m in this.models) {
        this.models[m].value = '';
        this.models[m].value = '';
      }
    },
    validErr: function validErr(v) {
      return v && !['boolean'].includes(_typeof(v)) || !v && ['string', 'boolean'].includes(_typeof(v));
    },
    setError: function setError(m, e) {
      this.models[m].error = this.validErr(e) ? e : '';
    },
    runModelRules: function runModelRules(val, rules) {
      var err;

      if (UTILS.isArr(rules)) {
        var _iterator = _createForOfIteratorHelper(rules),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rule = _step.value;
            err = rule;

            if (UTILS.isFunc(rule)) {
              err = rule(val);
            }

            if (this.validErr(err)) {
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }

      return err;
    },
    validateModel: function validateModel(m, validate) {
      var _this$models$m$option, _this$models$m$option2, _this$schema2, _this$schema2$options, _this$schema3, _this$schema3$rules;

      var validationOption = ((_this$models$m$option = this.models[m].options) === null || _this$models$m$option === void 0 ? void 0 : _this$models$m$option.activeValidation) ? (_this$models$m$option2 = this.models[m].options) === null || _this$models$m$option2 === void 0 ? void 0 : _this$models$m$option2.activeValidation : this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$options = _this$schema2.options) === null || _this$schema2$options === void 0 ? void 0 : _this$schema2$options.activeValidation;
      var err = (validate || validationOption) && this.runModelRules(this.models[m].value, this === null || this === void 0 ? void 0 : (_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$rules = _this$schema3.rules) === null || _this$schema3$rules === void 0 ? void 0 : _this$schema3$rules[m]);
      this.setError(m, err);
    },
    validate: function validate() {
      for (var m in this.models) {
        this.validateModel(m, true);
      }
    }
  },
  render: function render(createElement) {
    var _self$schema, _self$schema2, _self$schema3;

    var self = this;

    var data = function data(d, s) {
      var dat = _objectSpread2({}, d);

      if (s === null || s === void 0 ? void 0 : s.model) {
        var _self$models, _self$models$modelNam;

        var prps = {
          value: (_self$models = self.models) === null || _self$models === void 0 ? void 0 : (_self$models$modelNam = _self$models[modelName(s)]) === null || _self$models$modelNam === void 0 ? void 0 : _self$models$modelNam.value
        };
        var on = {
          input: function input(e) {
            var _e$target;

            self.models[modelName(s)].value = (e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value) || e;
          }
        };
        dat.domProps = _objectSpread2(_objectSpread2({}, props), d.domProps);
        dat.props = _objectSpread2(_objectSpread2({}, prps), d === null || d === void 0 ? void 0 : d.props);
        dat.on = _objectSpread2(_objectSpread2({}, on), d === null || d === void 0 ? void 0 : d.on);
      }

      return dat;
    };

    var nestDom = function nestDom(arr) {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(function (s) {
          return createElement(s.tag, data((s === null || s === void 0 ? void 0 : s.data) || {}, s), nestDom(s.children));
        });
      }

      return [];
    };

    return createElement((_self$schema = self.schema) === null || _self$schema === void 0 ? void 0 : _self$schema.tag, data(((_self$schema2 = self.schema) === null || _self$schema2 === void 0 ? void 0 : _self$schema2.data) || {}, self.schema), nestDom((_self$schema3 = self.schema) === null || _self$schema3 === void 0 ? void 0 : _self$schema3.children));
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}/* script */
var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-5abb4280";
/* functional template */

var __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);// Import vue component

var install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;