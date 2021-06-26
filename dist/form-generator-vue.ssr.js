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
};var CLASS = {
  form: 'fgv-form',
  // header: 'fgv-header',
  body: 'fgv-body',
  // footer: 'fgv-footer',
  row: 'fgv-row',
  rowContainer: 'fgv-row-container',
  colContainer: 'fgv-col-container',
  col: 'fgv-col'
};
var SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: function beforeComponent(v) {
    return "before-".concat(v);
  },
  afterComponent: function afterComponent(v) {
    return "after-".concat(v);
  },
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowEnd: 'row-end',
  afterRow: 'after-row',
  beforeCol: 'before-col',
  afterCol: 'after-col'
};
var SCHEMA = {
  fields: 'fields',
  av: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
};
var VMODEL = {
  fields: 'fields',
  errors: 'errors'
};
var FIELD = {
  av: SCHEMA.av,
  avDelay: SCHEMA.avDelay,
  on: 'on',
  component: 'component',
  type: {
    text: 'text',
    number: 'number'
  },
  props: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  rules: 'rules'
};var createModel = function createModel(schema) {
  var model = {};

  (function init(s) {
    if (s === null || s === void 0 ? void 0 : s.model) {
      var _s$model;

      model[UTILS.isArr(s) && ((_s$model = s.model) === null || _s$model === void 0 ? void 0 : _s$model[0]) || s.model] = {
        value: '',
        error: ''
      };
    }

    if (s === null || s === void 0 ? void 0 : s.children) {
      s === null || s === void 0 ? void 0 : s.children.forEach(function (i) {
        return init(i);
      });
    }
  })(schema);

  return model;
};

var script = {
  mixins: [props],
  emits: ['input'],
  data: function data() {
    var model = createModel(this.schema);
    console.log('model is', model);
    return {
      model: model
    };
  },
  computed: {
    SLOT: function SLOT$1() {
      return SLOT;
    },
    CLASS: function CLASS$1() {
      return CLASS;
    },
    UTILS: function UTILS$1() {
      return UTILS;
    },
    fieldsFlat: function fieldsFlat() {
      var flat = {};

      var _iterator = _createForOfIteratorHelper(this.schema[SCHEMA.fields]),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var conf = _step.value;

          if (UTILS.isArr(conf)) {
            var _iterator2 = _createForOfIteratorHelper(conf),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var subConf = _step2.value;
                flat[subConf.model] = subConf;
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            flat[conf.model] = conf;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return flat;
    }
  },
  watch: {
    value: {
      handler: function handler() {
        for (var model in (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value[VMODEL.fields]) {
          var _this$value, _this$value2, _this$value2$VMODEL$f, _this$value3, _this$value3$VMODEL$e;

          this.fields[model] = (_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$f = _this$value2[VMODEL.fields]) === null || _this$value2$VMODEL$f === void 0 ? void 0 : _this$value2$VMODEL$f[model];
          this.errors[model] = (_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : (_this$value3$VMODEL$e = _this$value3[VMODEL.errors]) === null || _this$value3$VMODEL$e === void 0 ? void 0 : _this$value3$VMODEL$e[model];
        }
      },
      deep: true
    },
    // form: {
    //   handler: 'emitData',
    //   deep: true,
    //   immediate: true,
    // },
    fields: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
    errors: {
      handler: 'emitData',
      deep: true,
      immediate: true
    }
  },
  created: function created() {
    var _this = this;

    var _loop = function _loop(model) {
      var conf = _this.getFieldConf(model);

      _this.$watch("fields.".concat(model), function (newVal, oldVal) {
        _this.typeCoercion(conf); // when only data type is changed.


        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        }

        _this.validateField(conf);
      }, {
        deep: true
      });
    };

    // fields watcher
    for (var model in this.fields) {
      _loop(model);
    }
  },
  mounted: function mounted() {
    var _this$schema, _this$schema$options;

    if (this === null || this === void 0 ? void 0 : (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$options = _this$schema.options) === null || _this$schema$options === void 0 ? void 0 : _this$schema$options.onLoadValidation) {
      this.validate();
    }
  },
  methods: {
    classes: function classes(classArr) {
      var _this2 = this;

      var subArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return classArr.reduce(function (acc, c) {
        var _this2$schema, _this2$schema$class;

        if (_this2 === null || _this2 === void 0 ? void 0 : (_this2$schema = _this2.schema) === null || _this2$schema === void 0 ? void 0 : (_this2$schema$class = _this2$schema.class) === null || _this2$schema$class === void 0 ? void 0 : _this2$schema$class[c]) {
          acc.push.apply(acc, _toConsumableArray(_this2.schema.class[c]));

          var ar = _this2.schema.class[c].filter(function (cl) {
            var _this2$schema2;

            return Object.keys(_this2 === null || _this2 === void 0 ? void 0 : (_this2$schema2 = _this2.schema) === null || _this2$schema2 === void 0 ? void 0 : _this2$schema2.class).includes(cl);
          });

          if (ar.length) {
            acc.push.apply(acc, _toConsumableArray(_this2.classes(ar, true)));
          }
        }

        return acc;
      }, !subArr ? _toConsumableArray(classArr) : []);
    },
    emitData: function emitData() {
      var _this3 = this,
          _this$$emit;

      // const formModel = UTILS.isStr(this?.schema?.form?.model)
      // ? this?.schema?.form?.model : undefined;
      var valid = !Object.keys(this.errors).find(function (e) {
        return _this3.errors[e] && !_this3.fieldHidden(_this3.fieldsFlat[e]);
      });
      this.$emit('input', (_this$$emit = {
        // ...(formModel ? { [formModel]: this.form } : {}),
        valid: valid
      }, _defineProperty(_this$$emit, VMODEL.fields, this.fields), _defineProperty(_this$$emit, VMODEL.errors, this.errors), _this$$emit));
    },
    // showRow(conf) {
    //   return UTILS.isArr(conf)
    //     ? conf.length && conf.some((c) => this.showCol(c))
    //     : this.showCol(conf);
    // },
    // showCol(conf) {
    //   return this.componentName(conf) && !this.fieldHidden(conf);
    // },
    // slotProps(conf) {
    //   if (UTILS.isArr(conf)) {
    //     return conf.map(({ model }) => model);
    //   }
    //   return [conf.model];
    // },
    // componentProps(conf, options = {}) {
    //   const { form } = options;
    //   const p = {
    //     ...conf?.props,
    //   };
    //   if (form) {
    //     p.is = conf?.props?.is || 'form';
    //   }
    //   return p;
    // },
    resetValidation: function resetValidation() {
      for (var model in this.errors) {
        this.errors[model] = '';
      }
    },
    reset: function reset() {
      for (var model in this.fields) {
        this.fields[model] = '';
        this.errors[model] = '';
      }
    },
    canSetErr: function canSetErr(v) {
      return v && !['boolean'].includes(_typeof(v)) || !v && ['string', 'boolean'].includes(_typeof(v));
    },
    setError: function setError(model, err) {
      this.errors[model] = this.canSetErr(err) ? err : '';
    },
    typeCoercion: function typeCoercion(conf) {
      var _conf$props;

      if (this.fields[conf.model] && (conf === null || conf === void 0 ? void 0 : (_conf$props = conf.props) === null || _conf$props === void 0 ? void 0 : _conf$props.type) === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }

        this.fields[conf.model] = Number(this.fields[conf.model]);
      }
    },
    // componentEvents(conf, options = {}) {
    //   const { form } = options;
    //   const e = conf?.[FIELD.on] || {};
    //   if (form) {
    //     e.submit = conf?.on?.submit
    //     || ((ev) => { ev?.preventDefault(); UTILS.logger(['submit handler not present.\n'], { warn: true, show: this?.schema?.options?.logs }); });
    //   }
    //   return e;
    // },
    // componentName(conf) {
    //   return conf?.props?.is || conf?.tag;
    // },
    getFieldConf: function getFieldConf(model) {
      return this.fieldsFlat[model];
    },
    fieldHidden: function fieldHidden(conf) {
      var _conf$props2;

      var HIDDEN = true;
      return (conf === null || conf === void 0 ? void 0 : conf.props) && FIELD.props.hidden in conf.props ? Boolean((_conf$props2 = conf.props) === null || _conf$props2 === void 0 ? void 0 : _conf$props2[FIELD.props.hidden]) : !HIDDEN;
    },
    runFieldRules: function runFieldRules(val, rules) {
      var err;

      if (UTILS.isArr(rules)) {
        var _iterator3 = _createForOfIteratorHelper(rules),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var rule = _step3.value;
            err = rule;

            if (UTILS.isFunc(rule)) {
              err = rule(val);
            }

            if (this.canSetErr(err)) {
              break;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }

      return err;
    },
    validateField: function validateField(conf, formValidating) {
      var _this$schema2, _this$schema2$options, _this$schema3, _this$schema3$rules;

      var av = FIELD.av in conf ? conf === null || conf === void 0 ? void 0 : conf[FIELD.av] : this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$options = _this$schema2.options) === null || _this$schema2$options === void 0 ? void 0 : _this$schema2$options.activeValidation;
      var err = (formValidating || av) && this.runFieldRules(this.fields[conf.model], this === null || this === void 0 ? void 0 : (_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$rules = _this$schema3.rules) === null || _this$schema3$rules === void 0 ? void 0 : _this$schema3$rules[conf.model]);
      this.setError(conf.model, err);
    },
    validate: function validate() {
      for (var model in this.fields) {
        var _this$fieldsFlat;

        this.validateField((_this$fieldsFlat = this.fieldsFlat) === null || _this$fieldsFlat === void 0 ? void 0 : _this$fieldsFlat[model], true);
      }
    }
  },
  render: function render(createElement) {
    var _this$schema4;

    function createFields(arr) {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(function (_ref) {
          var tag = _ref.tag,
              data = _ref.data,
              children = _ref.children;
          return createElement(tag, data, createFields(children));
        });
      }

      return [];
    }

    var fields = createFields(this === null || this === void 0 ? void 0 : (_this$schema4 = this.schema) === null || _this$schema4 === void 0 ? void 0 : _this$schema4.fields);
    return createElement('form', {}, fields);
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

var __vue_module_identifier__ = "data-v-6c27c00c";
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