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
}function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-2adec084";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, {}, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    submit: {
      type: Function,
      required: false,
      default: undefined
    },
    components: {
      type: Array,
      required: false,
      default: function _default() {
        return [];
      }
    },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    schema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    classes: {
      type: Object,
      required: false,
      default: function _default() {
        return {};
      }
    },
    submitFail: {
      type: Function,
      required: false,
      default: undefined
    },
    activeValidation: {
      type: Boolean,
      required: false,
      default: true
    },
    // activeValidationDelay: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    logs: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};var UTILS = {
  isUndef: function isUndef(val) {
    return typeof val === 'undefined';
  },
  isObjNotArr: function isObjNotArr(val) {
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
};var ERROR_TYPES = ['string', 'object'];
var CLASS = {
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
  vOn: 'vOn',
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
};var script = {
  components: {
    Body: __vue_component__,
    RowContainer: __vue_component__,
    Row: __vue_component__,
    ColumnContainer: __vue_component__,
    Column: __vue_component__
  },
  mixins: [props],
  emits: ['input'],
  data: function data() {
    var _this$value,
        _this = this;

    var form = (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.form;
    var fields = {};
    var errors = {};

    var addFieldsAndErrors = function addFieldsAndErrors(model) {
      var _this$value2, _this$value2$VMODEL$f, _this$value3, _this$value3$VMODEL$e;

      fields[model] = ((_this$value2 = _this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$f = _this$value2[VMODEL.fields]) === null || _this$value2$VMODEL$f === void 0 ? void 0 : _this$value2$VMODEL$f[model]) || '';
      errors[model] = ((_this$value3 = _this.value) === null || _this$value3 === void 0 ? void 0 : (_this$value3$VMODEL$e = _this$value3[VMODEL.errors]) === null || _this$value3$VMODEL$e === void 0 ? void 0 : _this$value3$VMODEL$e[model]) || '';
    };

    var _iterator = _createForOfIteratorHelper(this.schema[SCHEMA.fields]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fieldConf = _step.value;

        if (UTILS.isArr(fieldConf)) {
          var _iterator2 = _createForOfIteratorHelper(fieldConf),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var subFieldConf = _step2.value;
              addFieldsAndErrors(subFieldConf.model);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } else {
          addFieldsAndErrors(fieldConf.model);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return {
      form: form,
      fields: fields,
      errors: errors,
      submitClick: false
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
    // globalAv() {
    //   return this.activeValidation || false;
    // },
    // globalAvDelay() {
    //   return this.activeValidationDelay || 0;
    // },
    // allFieldsArray() {
    //   return UTILS.isArr(this.schema?.[SCHEMA.fields])
    //     ? this.schema[SCHEMA.fields]
    //     : [];
    // },
    fieldsFlat: function fieldsFlat() {
      var flat = {};

      var _iterator3 = _createForOfIteratorHelper(this.schema[SCHEMA.fields]),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var conf = _step3.value;

          if (UTILS.isArr(conf)) {
            var _iterator4 = _createForOfIteratorHelper(conf),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var subConf = _step4.value;
                flat[subConf.model] = subConf;
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else {
            flat[conf.model] = conf;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return flat;
    } // debounceValidateField() {
    //   return UTILS.debounce((model) => {
    //     this.validateField(model);
    //   });
    // },

  },
  watch: {
    // disabled: {
    //   handler() {
    //     this.removeAllErrors();
    //   },
    // },
    value: {
      handler: function handler() {
        for (var model in (_this$value4 = this.value) === null || _this$value4 === void 0 ? void 0 : _this$value4[VMODEL.fields]) {
          var _this$value4, _this$value5, _this$value5$VMODEL$f, _this$value6, _this$value6$VMODEL$e;

          this.fields[model] = (_this$value5 = this.value) === null || _this$value5 === void 0 ? void 0 : (_this$value5$VMODEL$f = _this$value5[VMODEL.fields]) === null || _this$value5$VMODEL$f === void 0 ? void 0 : _this$value5$VMODEL$f[model];
          this.errors[model] = (_this$value6 = this.value) === null || _this$value6 === void 0 ? void 0 : (_this$value6$VMODEL$e = _this$value6[VMODEL.errors]) === null || _this$value6$VMODEL$e === void 0 ? void 0 : _this$value6$VMODEL$e[model];
        }
      },
      deep: true
    },
    form: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
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
    var _this2 = this;

    var _loop = function _loop(model) {
      var conf = _this2.getFieldConf(model);

      _this2.$watch("fields.".concat(model), function (newVal, oldVal) {
        _this2.typeCoercion(conf); // when only data type is changed.


        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        } // this.validate(fieldConf, true);


        _this2.validateField(conf);
      }, {
        deep: true
      });
    };

    // fields watcher
    for (var model in this.fields) {
      _loop(model);
    } // Object.keys(this.fields).forEach((model) => {
    //   const fieldConf = this.getFieldConf(model);
    //   this.$watch(`fields.${model}`, (newVal, oldVal) => {
    //     this.typeCoercion(fieldConf);
    //     // when only data type is changed.
    //     if (newVal == oldVal && typeof newVal !== typeof oldVal) {
    //       return;
    //     }
    //     // this.validate(fieldConf, true);
    //     this.validateField(fieldConf);
    //   }, { deep: true });
    // });

  },
  methods: {
    emitData: function emitData() {
      var _this$$emit;

      this.$emit('input', (_this$$emit = {
        form: this.form
      }, _defineProperty(_this$$emit, VMODEL.fields, this.fields), _defineProperty(_this$$emit, VMODEL.errors, this.errors), _this$$emit));
    },
    resetForm: function resetForm() {
      this.submitClick = false;
    },
    showRow: function showRow(conf) {
      var _this3 = this;

      return UTILS.isArr(conf) ? conf.length && conf.some(function (c) {
        return _this3.showCol(c);
      }) : this.showCol(conf);
    },
    showCol: function showCol(conf) {
      return this.componentName(conf) && !this.fieldHidden(conf);
    },
    slotProps: function slotProps(conf) {
      if (UTILS.isArr(conf)) {
        return conf.map(function (_ref) {
          var model = _ref.model;
          return model;
        });
      }

      return [conf.model];
    },
    componentProps: function componentProps(conf) {
      var _this$schema, _this$schema$form, _this$schema$form$pro;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var form = options.form,
          field = options.field; // const cName = this.componentName(conf);

      var componentData = this.componentData(this.componentName(conf)); // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;

      var p = _objectSpread2(_objectSpread2({}, conf === null || conf === void 0 ? void 0 : conf.props), {}, {
        disabled: ((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$form = _this$schema.form) === null || _this$schema$form === void 0 ? void 0 : (_this$schema$form$pro = _this$schema$form.props) === null || _this$schema$form$pro === void 0 ? void 0 : _this$schema$form$pro.disabled) || (conf === null || conf === void 0 ? void 0 : conf.disabled)
      });

      if (form) {
        var _conf$props;

        p.is = (conf === null || conf === void 0 ? void 0 : (_conf$props = conf.props) === null || _conf$props === void 0 ? void 0 : _conf$props.is) || 'form';
      }

      if (field) {
        var _conf$props2;

        if (componentData === null || componentData === void 0 ? void 0 : componentData.errorProp) {
          p[componentData.errorProp] = this.errors[conf.model];
        }

        p.type = (conf === null || conf === void 0 ? void 0 : (_conf$props2 = conf.props) === null || _conf$props2 === void 0 ? void 0 : _conf$props2.type) || FIELD.type.text;
      }

      return p;
    },
    // removeAllErrors() {
    //   for (const model in this.errors) {
    //     this.errors[model] = '';
    //   }
    // },
    setError: function setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }
      // prop is not rmoved from errors if set undefined
      this.errors[model] = ERROR_TYPES.includes(_typeof(err)) ? err : '';
    },
    componentData: function componentData(name) {
      return this.components.find(function (c) {
        return (c === null || c === void 0 ? void 0 : c.name) === name;
      });
    },
    typeCoercion: function typeCoercion(conf) {
      var _conf$props3;

      if (this.fields[conf.model] && (conf === null || conf === void 0 ? void 0 : (_conf$props3 = conf.props) === null || _conf$props3 === void 0 ? void 0 : _conf$props3.type) === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }

        this.fields[conf.model] = Number(this.fields[conf.model]);
      } // if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
      //   return;
      // }
      // if (fieldConf?.vBind?.type === FIELD.type.number && this.fields[fieldConf.model]) {
      //   this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      // }

    },
    componentEvents: function componentEvents(conf) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var form = options.form;
      var e = (conf === null || conf === void 0 ? void 0 : conf[FIELD.vOn]) || {};

      if (form) {
        var _conf$vOn;

        e.submit = (conf === null || conf === void 0 ? void 0 : (_conf$vOn = conf.vOn) === null || _conf$vOn === void 0 ? void 0 : _conf$vOn.submit) || this.submit && this.handleSubmit || function (ev) {
          ev === null || ev === void 0 ? void 0 : ev.preventDefault();

          UTILS.logger(['submit handler not present.\n'], {
            warn: true,
            show: _this4.logs
          });
        };
      }

      return e;
    },
    componentName: function componentName(conf) {
      var _conf$props4;

      if (conf === null || conf === void 0 ? void 0 : (_conf$props4 = conf.props) === null || _conf$props4 === void 0 ? void 0 : _conf$props4.is) {
        var _conf$props5;

        return conf === null || conf === void 0 ? void 0 : (_conf$props5 = conf.props) === null || _conf$props5 === void 0 ? void 0 : _conf$props5.is;
      }

      var cData = this.components.find(function (_ref2) {
        var _conf$props6;

        var types = _ref2.types;
        return types.includes(conf === null || conf === void 0 ? void 0 : (_conf$props6 = conf.props) === null || _conf$props6 === void 0 ? void 0 : _conf$props6.type);
      });
      return cData === null || cData === void 0 ? void 0 : cData.name;
    },
    getFieldConf: function getFieldConf(model) {
      return this.fieldsFlat[model];
    },
    // fieldDisabled(fieldConf) {
    //   const DISABLED = true;
    //   const fieldDisabled = fieldConf?.vBind
    //    && FIELD.vBind.disabled in fieldConf.vBind
    //     ? fieldConf.vBind?.[FIELD.vBind.disabled]
    //     : !DISABLED;
    //   return this.disabled || fieldDisabled;
    // },
    // fieldRequired(fieldConf) {
    //   const REQUIRED = true;
    //   return fieldConf?.vBind && FIELD.vBind.required in fieldConf.vBind
    //     ? Boolean(fieldConf?.vBind?.[FIELD.vBind.required]) : !REQUIRED;
    // },
    fieldHidden: function fieldHidden(conf) {
      var _conf$props7;

      var HIDDEN = true;
      return (conf === null || conf === void 0 ? void 0 : conf.props) && FIELD.props.hidden in conf.props ? Boolean((_conf$props7 = conf.props) === null || _conf$props7 === void 0 ? void 0 : _conf$props7[FIELD.props.hidden]) : !HIDDEN;
    },
    runFieldRules: function runFieldRules(val, rules) {
      var err;

      if (UTILS.isArr(rules)) {
        var _iterator5 = _createForOfIteratorHelper(rules),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var rule = _step5.value;
            // valid return values: string
            err = rule;

            if (UTILS.isFunc(rule)) {
              err = rule(val);
            }

            if (ERROR_TYPES.includes(_typeof(err))) {
              break;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }

      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }

      return err;
    },
    validateField: function validateField(conf) {
      var _this$schema2, _this$schema2$rules;

      // const fieldRequired = this.fieldRequired(fieldConf);
      var av = FIELD.av in conf ? conf === null || conf === void 0 ? void 0 : conf[FIELD.av] : this.activeValidation;
      var err = (this.submitClick || av) && this.runFieldRules(this.fields[conf.model], this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$rules = _this$schema2.rules) === null || _this$schema2$rules === void 0 ? void 0 : _this$schema2$rules[conf.model]); // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);

      this.setError(conf.model, err); // return err;
    },
    validateForm: function validateForm() {
      // watcher handler
      // if (fieldConf && isWatcher) {
      // const fieldAv = fieldConf[FIELD.av] || this.globalAv;
      // const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;
      // if (fieldAv && fieldAvDelay) {
      //   this.debounceValidateField(fieldAvDelay)(fieldConf);
      // } else this.validateField(fieldConf);
      // this.validateField(fieldConf);
      // return;
      // }
      // watcher handler end
      // On form submit
      // const fieldsStatus = {};
      // Object.values(this.fieldsFlat).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });
      var fieldsStatus = {};

      for (var model in this.fields) {
        var conf = this.fieldsFlat[model];
        this.validateField(conf);
        fieldsStatus[conf.model] = {
          validationSuccess: !this.errors[model],
          hidden: this.fieldHidden(conf),
          schema: conf
        };
      }

      var submitFail = Object.keys(fieldsStatus).find(function (model) {
        return !fieldsStatus[model].validationSuccess && !fieldsStatus[model].hidden;
      });
      return {
        fieldsStatus: fieldsStatus,
        submitFail: submitFail
      };
    },
    handleSubmit: function handleSubmit(e) {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this5$validateForm, fieldsStatus, submitFail;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e === null || e === void 0 ? void 0 : e.preventDefault();
                _this5.submitClick = true;
                _this5$validateForm = _this5.validateForm(), fieldsStatus = _this5$validateForm.fieldsStatus, submitFail = _this5$validateForm.submitFail;

                UTILS.logger(["[SUBMIT ".concat(submitFail ? 'FAIL' : 'SUCCESS', "]"), fieldsStatus], {
                  show: _this5.logs
                });

                if (!submitFail) {
                  _context.next = 10;
                  break;
                }

                if (!_this5.submitFail) {
                  _context.next = 8;
                  break;
                }

                _context.next = 8;
                return _this5.submitFail();

              case 8:
                _this5.resetForm();

                return _context.abrupt("return");

              case 10:
                _context.next = 12;
                return _this5.submit();

              case 12:
                _this5.resetForm();

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  }
};/* script */
var __vue_script__ = script;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.componentName(_vm.schema.form), _vm._g(_vm._b({
    tag: "component",
    class: [_vm.CLASS.form],
    model: {
      value: _vm.form,
      callback: function callback($$v) {
        _vm.form = $$v;
      },
      expression: "form"
    }
  }, 'component', _vm.componentProps(_vm.schema.form, {
    form: true
  }), false), _vm.componentEvents(_vm.schema.form, {
    form: true
  })), [_vm._t(_vm.SLOT.header), _vm._v(" "), _c('Body', {
    class: [_vm.CLASS.body]
  }, [_vm._l(_vm.schema.fields, function (conf, i) {
    return [_vm.showRow(conf) ? _c('RowContainer', {
      key: i,
      class: [_vm.CLASS.rowContainer, _vm.CLASS.rowContainer + "-" + i]
    }, [_vm._t(_vm.SLOT.beforeRow, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Row', {
      class: [_vm.CLASS.row, _vm.CLASS.row + "-" + i, _vm.classes.row]
    }, [_vm._t(_vm.SLOT.rowStart, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), !_vm.UTILS.isArr(conf) ? [_vm.showCol(conf) ? _c('ColumnContainer', {
      key: conf.model,
      class: [_vm.CLASS.colContainer, conf.model]
    }, [_vm._t(_vm.SLOT.beforeCol, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Column', {
      class: [_vm.CLASS.col, conf.model, _vm.classes.col]
    }, [_vm._t(_vm.SLOT.beforeComponent(conf.model)), _vm._v(" "), _c(_vm.componentName(conf), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[conf.model],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, conf.model, $$v);
        },
        expression: "fields[conf.model]"
      }
    }, 'component', _vm.componentProps(conf, {
      field: true
    }), false), _vm.componentEvents(conf)), [_vm._t(conf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(conf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()] : _vm._l(conf, function (subConf) {
      return [_vm.showCol(subConf) ? _c('ColumnContainer', {
        key: subConf.model,
        class: [_vm.CLASS.colContainer, subConf.model]
      }, [_vm._t(_vm.SLOT.beforeCol, null, {
        "models": _vm.slotProps(subConf)
      }), _vm._v(" "), _c('Column', {
        class: [_vm.CLASS.col, subConf.models, _vm.classes.col]
      }, [_vm._t(_vm.SLOT.beforeComponent(subConf.model)), _vm._v(" "), _c(_vm.componentName(subConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subConf.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subConf.model, $$v);
          },
          expression: "fields[subConf.model]"
        }
      }, 'component', _vm.componentProps(subConf, {
        field: true
      }), false), _vm.componentEvents(subConf)), [_vm._t(subConf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(subConf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
        "models": _vm.slotProps(subConf)
      })], 2) : _vm._e()];
    }), _vm._v(" "), _vm._t(_vm.SLOT.rowEnd, null, {
      "models": _vm.slotProps(conf)
    })], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterRow, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()];
  })], 2), _vm._v(" "), _vm._t(_vm.SLOT.footer)], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = "data-v-08d4c47e";
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);// Import vue component

var install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__$1);
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


__vue_component__$1.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__$1;