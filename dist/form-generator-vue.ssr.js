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
};var script = {
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
      errors: errors
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
    }
  },
  watch: {
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
        }

        _this2.validateField(conf);
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
      var _this3 = this;

      var subArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return classArr.reduce(function (acc, c) {
        var _this3$schema, _this3$schema$class;

        if (_this3 === null || _this3 === void 0 ? void 0 : (_this3$schema = _this3.schema) === null || _this3$schema === void 0 ? void 0 : (_this3$schema$class = _this3$schema.class) === null || _this3$schema$class === void 0 ? void 0 : _this3$schema$class[c]) {
          acc.push.apply(acc, _toConsumableArray(_this3.schema.class[c]));

          var ar = _this3.schema.class[c].filter(function (cl) {
            var _this3$schema2;

            return Object.keys(_this3 === null || _this3 === void 0 ? void 0 : (_this3$schema2 = _this3.schema) === null || _this3$schema2 === void 0 ? void 0 : _this3$schema2.class).includes(cl);
          });

          if (ar.length) {
            acc.push.apply(acc, _toConsumableArray(_this3.classes(ar, true)));
          }
        }

        return acc;
      }, !subArr ? _toConsumableArray(classArr) : []);
    },
    emitData: function emitData() {
      var _this$schema2,
          _this$schema2$form,
          _this$schema3,
          _this$schema3$form,
          _this4 = this,
          _objectSpread2$1;

      var formModel = UTILS.isStr(this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$form = _this$schema2.form) === null || _this$schema2$form === void 0 ? void 0 : _this$schema2$form.model) ? this === null || this === void 0 ? void 0 : (_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$form = _this$schema3.form) === null || _this$schema3$form === void 0 ? void 0 : _this$schema3$form.model : undefined;
      var valid = !Object.keys(this.errors).find(function (e) {
        return _this4.errors[e] && !_this4.fieldHidden(_this4.fieldsFlat[e]);
      });
      this.$emit('input', _objectSpread2(_objectSpread2({}, formModel ? _defineProperty({}, formModel, this.form) : {}), {}, (_objectSpread2$1 = {
        valid: valid
      }, _defineProperty(_objectSpread2$1, VMODEL.fields, this.fields), _defineProperty(_objectSpread2$1, VMODEL.errors, this.errors), _objectSpread2$1)));
    },
    showRow: function showRow(conf) {
      var _this5 = this;

      return UTILS.isArr(conf) ? conf.length && conf.some(function (c) {
        return _this5.showCol(c);
      }) : this.showCol(conf);
    },
    showCol: function showCol(conf) {
      return this.componentName(conf) && !this.fieldHidden(conf);
    },
    slotProps: function slotProps(conf) {
      if (UTILS.isArr(conf)) {
        return conf.map(function (_ref2) {
          var model = _ref2.model;
          return model;
        });
      }

      return [conf.model];
    },
    componentProps: function componentProps(conf) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var form = options.form;

      var p = _objectSpread2({}, conf === null || conf === void 0 ? void 0 : conf.props);

      if (form) {
        var _conf$props;

        p.is = (conf === null || conf === void 0 ? void 0 : (_conf$props = conf.props) === null || _conf$props === void 0 ? void 0 : _conf$props.is) || 'form';
      }

      return p;
    },
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
      var _conf$props2;

      if (this.fields[conf.model] && (conf === null || conf === void 0 ? void 0 : (_conf$props2 = conf.props) === null || _conf$props2 === void 0 ? void 0 : _conf$props2.type) === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }

        this.fields[conf.model] = Number(this.fields[conf.model]);
      }
    },
    componentEvents: function componentEvents(conf) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var form = options.form;
      var e = (conf === null || conf === void 0 ? void 0 : conf[FIELD.on]) || {};

      if (form) {
        var _conf$on;

        e.submit = (conf === null || conf === void 0 ? void 0 : (_conf$on = conf.on) === null || _conf$on === void 0 ? void 0 : _conf$on.submit) || function (ev) {
          var _this6$schema, _this6$schema$options;

          ev === null || ev === void 0 ? void 0 : ev.preventDefault();

          UTILS.logger(['submit handler not present.\n'], {
            warn: true,
            show: _this6 === null || _this6 === void 0 ? void 0 : (_this6$schema = _this6.schema) === null || _this6$schema === void 0 ? void 0 : (_this6$schema$options = _this6$schema.options) === null || _this6$schema$options === void 0 ? void 0 : _this6$schema$options.logs
          });
        };
      }

      return e;
    },
    componentName: function componentName(conf) {
      var _conf$props3;

      return (conf === null || conf === void 0 ? void 0 : (_conf$props3 = conf.props) === null || _conf$props3 === void 0 ? void 0 : _conf$props3.is) || (conf === null || conf === void 0 ? void 0 : conf.tag);
    },
    getFieldConf: function getFieldConf(model) {
      return this.fieldsFlat[model];
    },
    fieldHidden: function fieldHidden(conf) {
      var _conf$props4;

      var HIDDEN = true;
      return (conf === null || conf === void 0 ? void 0 : conf.props) && FIELD.props.hidden in conf.props ? Boolean((_conf$props4 = conf.props) === null || _conf$props4 === void 0 ? void 0 : _conf$props4[FIELD.props.hidden]) : !HIDDEN;
    },
    runFieldRules: function runFieldRules(val, rules) {
      var err;

      if (UTILS.isArr(rules)) {
        var _iterator5 = _createForOfIteratorHelper(rules),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var rule = _step5.value;
            err = rule;

            if (UTILS.isFunc(rule)) {
              err = rule(val);
            }

            if (this.canSetErr(err)) {
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
    validateField: function validateField(conf, formValidating) {
      var _this$schema4, _this$schema4$options, _this$schema5, _this$schema5$rules;

      var av = FIELD.av in conf ? conf === null || conf === void 0 ? void 0 : conf[FIELD.av] : this === null || this === void 0 ? void 0 : (_this$schema4 = this.schema) === null || _this$schema4 === void 0 ? void 0 : (_this$schema4$options = _this$schema4.options) === null || _this$schema4$options === void 0 ? void 0 : _this$schema4$options.activeValidation;
      var err = (formValidating || av) && this.runFieldRules(this.fields[conf.model], this === null || this === void 0 ? void 0 : (_this$schema5 = this.schema) === null || _this$schema5 === void 0 ? void 0 : (_this$schema5$rules = _this$schema5.rules) === null || _this$schema5$rules === void 0 ? void 0 : _this$schema5$rules[conf.model]);
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
    var _this$schema6;

    function createFields(arr) {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(function (_ref3) {
          var tag = _ref3.tag,
              data = _ref3.data,
              children = _ref3.children;
          return createElement(tag, data, createFields(children));
        });
      }

      return [];
    }

    var fields = createFields(this === null || this === void 0 ? void 0 : (_this$schema6 = this.schema) === null || _this$schema6 === void 0 ? void 0 : _this$schema6.fields);
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

var __vue_module_identifier__ = "data-v-5e5ef27e";
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