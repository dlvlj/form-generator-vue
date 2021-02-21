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
}var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    onSubmit: {
      type: Function,
      required: false,
      default: function _default() {
        console.error("submit handler not present");
      }
    },
    components: {
      type: Array,
      required: false,
      default: function _default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
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
    onSubmitFail: {
      type: Function,
      required: false,
      default: function _default() {
        console.warn("Form submit fail");
      }
    }
  }
};var debounce_timeout;
var UTILS = {
  isUndef: function isUndef(val) {
    return typeof val === "undefined";
  },
  isObjNotArr: function isObjNotArr(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val) && !UTILS.isArr(val);
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
    return typeof val === "function";
  },
  isBool: function isBool(val) {
    return typeof val === "boolean";
  },
  isStr: function isStr(val) {
    return typeof val === 'string';
  },
  throwError: function throwError(msg) {
    throw new Error(msg);
  },
  warn: function warn(msg) {
    console.warn(msg);
  },
  hasProperty: function hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }

    return children.every(function (child) {
      return child in parent;
    });
  },
  handleFunc: function handleFunc(func) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

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
    return function (time) {
      return function exeFunction(p) {
        clearTimeout(debounce_timeout);
        debounce_timeout = setTimeout(function () {
          clearTimeout(debounce_timeout);
          func(p);
        }, time);
      };
    };
  }
};var slotProps = {
  methods: {
    getModelFromSchema: function getModelFromSchema(schema) {
      if (UTILS.isArr()) {
        return schema.map(function (_ref) {
          var model = _ref.model;
          return model;
        });
      }

      return schema.model;
    }
  }
};var CLASS = {
  form: 'fgv-form',
  header: "fgv-form__header",
  body: "fgv-form__body",
  footer: "fgv-form__footer",
  row: "fgv-form__body__row",
  col: "fgv-form__body__row__col"
};
var SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: function beforeComponent(v) {
    return "".concat(v, "_before");
  },
  afterComponent: function afterComponent(v) {
    return "".concat(v, "_after");
  },
  beforeRow: 'before-row',
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
  values: 'values',
  errors: 'errors'
};
var FIELD = {
  av: SCHEMA.av,
  avDelay: SCHEMA.avDelay,
  events: 'events',
  component: 'component',
  hide: 'hide',
  type: {
    text: 'text',
    number: 'number'
  },
  props: {
    required: 'required',
    disabled: 'disabled'
  }
};var script = {
  mixins: [props, slotProps],
  data: function data() {
    var _this = this;

    var INIT = true;
    var fields = {};
    var errors = {};

    var addFieldsAndErrors = function addFieldsAndErrors(model) {
      // on init if v-model has values then validate and apply those values.
      fields[model] = _this.vModelValid(INIT) && VMODEL.values in _this.value && _this.value[VMODEL.values][model] || '';
      errors[model] = _this.vModelValid(INIT) && VMODEL.errors in _this.value && _this.value[VMODEL.errors][model] || '';
    };

    if (SCHEMA.fields in this.schema && UTILS.isArr(this.schema.fields) && this.schema.fields.length) {
      var _iterator = _createForOfIteratorHelper(this.schema.fields),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var schema = _step.value;

          if (UTILS.isArr(schema)) {
            var _iterator2 = _createForOfIteratorHelper(schema),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var s = _step2.value;
                addFieldsAndErrors(s.model);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            addFieldsAndErrors(schema.model);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return {
      fields: fields,
      errors: errors,
      submit: false
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
    avGlobal: function avGlobal() {
      return SCHEMA.av in this.schema ? this.schema[SCHEMA.av] : false;
    },
    avDelayGlobal: function avDelayGlobal() {
      var hasAvDelay = SCHEMA.avDelay in this.schema && this.schema[SCHEMA.avDelay] && !isNaN(this.schema[SCHEMA.avDelay]);
      return hasAvDelay ? this.schema[SCHEMA.avDelay] : false;
    },
    logs: function logs() {
      return SCHEMA.logs in this.schema ? this.schema[SCHEMA.logs] : false;
    },
    fieldsSchema: function fieldsSchema() {
      return SCHEMA.fields in this.schema && UTILS.isArr(this.schema[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },
    fieldsSchemaFlat: function fieldsSchemaFlat() {
      var flatSchema = [];

      var _iterator3 = _createForOfIteratorHelper(this.fieldsSchema),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var schema = _step3.value;

          if (UTILS.isArr(schema)) {
            var _iterator4 = _createForOfIteratorHelper(schema),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var s = _step4.value;
                flatSchema.push(s);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else {
            flatSchema.push(schema);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return flatSchema;
    },
    fieldsSchemaMap: function fieldsSchemaMap() {
      var map = this.fieldsSchemaFlat.map(function (s) {
        return [s.model, s];
      });
      return Object.fromEntries(map);
    },
    deValidateField: function deValidateField() {
      var _this2 = this;

      return UTILS.debounce(function (model) {
        _this2.validateField(model);
      });
    }
  },
  watch: {
    disabled: {
      handler: function handler(newVal) {
        newVal && this.removeAllErrors();
      }
    },
    value: {
      handler: function handler() {
        if (this.vModelValid()) {
          for (var model in this.value[VMODEL.values]) {
            this.fields[model] = this.value[VMODEL.values][model];
            this.errors[model] = this.value[VMODEL.errors][model];
          }
        }
      },
      deep: true
    },
    fields: {
      handler: function handler() {
        this.rmUnwantedModels();
        this.$emit("input", {
          values: this.fields,
          errors: this.errors
        });
      },
      deep: true,
      immediate: true
    }
  },
  created: function created() {
    var _this3 = this;

    var _loop = function _loop(model) {
      var schema = _this3.findSchema(model);

      _this3.$watch("fields.".concat(model), function (newVal, oldVal) {
        // for number type field.
        this.typeCoercion(schema); // this.updateHelpers(model, newVal);
        // to prevent below calls when only type is changed and not value.

        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        } // validation ---------------------------


        this.validate(schema, true);
      }, {
        deep: true
      });
    };

    for (var model in this.fields) {
      _loop(model);
    }
  },
  methods: {
    validate: function validate() {
      var _this4 = this;

      var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var watcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // watcher
      if (schema && watcher) {
        var avDelay = schema && schema[FIELD.avDelay] || this.avDelayGlobal;
        avDelay ? this.deValidateField(avDelay)(schema) : this.validateField(schema);
        return;
      } // on submit


      var status = {};
      Object.values(this.fieldsSchemaMap).forEach(function (s) {
        var err = _this4.validateField(s);

        status[s.model] = !err ? true : !_this4.fieldRequired(s);
      });
      var fail = Object.keys(status).find(function (k) {
        return !status[k];
      });
      return [status, fail];
    },
    showRow: function showRow(schema) {
      return this.hasFieldsToRender(schema) || this.showCol(schema);
    },
    hasFieldsToRender: function hasFieldsToRender(schema) {
      var _this5 = this;

      return UTILS.isArr(schema) && schema.length && schema.some(function (s) {
        return !_this5.fieldHidden(s);
      });
    },
    showCol: function showCol(schema) {
      return this.componentToRender(schema) && !this.fieldHidden(schema);
    },
    vModelValid: function vModelValid() {
      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var parentValid = this.value && UTILS.isObjNotArr(this.value);

      var valValid = VMODEL.values in this.value && UTILS.isObjNotArr(this.value[VMODEL.values]);

      var errValid = VMODEL.errors in this.value && UTILS.isObjNotArr(this.value[VMODEL.errors]);

      if (init) {
        return parentValid && valValid;
      }

      return parentValid && valValid && errValid;
    },
    resetFormState: function resetFormState() {
      this.submit = false;
    },
    removeAllErrors: function removeAllErrors() {
      for (var model in this.errors) {
        this.errors[model] = "";
      }
    },
    setError: function setError(model, e) {
      var oldErr = this.errors[model];

      if (oldErr === e || UTILS.isObj(e, oldErr) && JSON.stringify(e) === JSON.stringify(oldErr)) {
        return;
      }

      this.errors[model] = e;
    },
    findComponentData: function findComponentData(name) {
      return this.components.find(function (c) {
        return c && c.name === name;
      });
    },
    componentProps: function componentProps(schema) {
      var _objectSpread2$1;

      var componentName = this.componentToRender(schema);
      var component = this.findComponentData(componentName);
      var errorPropName = schema && schema.rules && schema.rules.errorProp || component && component.errorProp || 'error';
      return _objectSpread2(_objectSpread2({}, schema.props), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, errorPropName, this.errors[schema.model]), _defineProperty(_objectSpread2$1, "ref", schema.model), _defineProperty(_objectSpread2$1, "type", schema.type || FIELD.type.text), _defineProperty(_objectSpread2$1, "disabled", this.fieldDisabled(schema)), _defineProperty(_objectSpread2$1, "required", this.fieldRequired(null, schema)), _objectSpread2$1));
    },
    typeCoercion: function typeCoercion(schema) {
      if (!isNaN(this.fields[schema.model])) {
        return;
      } // const schema = this.findSchema(model);


      schema && schema.type === FIELD.type.number && this.fields[schema.model] && (this.fields[schema.model] = Number(this.fields[schema.model]));
    },
    componentEvents: function componentEvents(schema) {
      return FIELD.events in schema && UTILS.isFunc(schema[FIELD.events]) ? UTILS.handleFunc(schema[FIELD.events]) : {};
    },
    componentToRender: function componentToRender(schema) {
      var fieldType = schema.type || FIELD.type.text;

      if (FIELD.component in schema && schema[FIELD.component] && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }

      var component = this.components.find(function (_ref) {
        var type = _ref.type;
        return type.includes(fieldType);
      });
      var componentName = component && component.name;
      !componentName && console.error("Component cannot be rendered. Component for type \"".concat(fieldType, "\" is not found in form-components."));
      return componentName;
    },
    findSchema: function findSchema(m) {
      // return this.fieldsSchemaFlat.find(({model}) => m === model);
      return this.fieldsSchemaMap[m];
    },
    fieldDisabled: function fieldDisabled(schema) {
      var DISABLED = true;
      var hasDisabledProp = schema && schema.props && FIELD.props.disabled in schema.props;
      var fieldDisabled = hasDisabledProp ? UTILS.handleFuncOrBool(schema.props[FIELD.props.disabled]) : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldRequired: function fieldRequired(schema) {
      var REQUIRED = true; // const model = m || s.model;
      // const schema = s || this.findSchema(model);

      var hasRequiredProp = schema && schema.props && FIELD.props.required in schema.props;
      var fieldRequired = hasRequiredProp ? UTILS.handleFuncOrBool(schema.props[FIELD.props.required]) : REQUIRED; // : !this.isHelperComponent(model);

      return schema && !this.fieldDisabled(schema) && !this.fieldHidden(schema) ? fieldRequired : !REQUIRED;
    },
    rmUnwantedModels: function rmUnwantedModels() {
      var _this6 = this;

      var uf = Object.keys(this.fields).filter(function (m) {
        return !_this6.fieldsSchemaFlat.find(function (_ref2) {
          var model = _ref2.model;
          return m === model;
        });
      });
      uf.forEach(function (model) {
        delete _this6.fields[model];
        delete _this6.errors[model];
      });
    },
    fieldHidden: function fieldHidden(schema) {
      var HIDDEN = true;
      var fieldHidden = FIELD.hide in schema ? UTILS.handleFuncOrBool(schema[FIELD.hide]) : !HIDDEN; // !fieldVisible && this.setDefaultFieldValue(schema);

      return fieldHidden;
    },
    validateField: function validateField(schema) {
      var VALID = ''; // const schema = this.findSchema(model);

      var fieldRequired = this.fieldRequired(schema);
      var validator = schema.rules && schema.rules.validator;
      var avField = FIELD.av in schema ? Boolean(schema[FIELD.av]) : this.avGlobal;
      var error = this.submit || avField ? UTILS.handleFunc(validator) || '' : VALID;
      var valid = !error ? VALID : Boolean(error);
      !fieldRequired ? !this.submit && this.setError(schema.model, error) : this.setError(schema.model, error);
      this.logs && console.log({
        model: schema.model,
        value: this.fields[schema.model],
        type: _typeof(this.fields[schema.model]),
        valid: valid,
        required: fieldRequired,
        error: error
      });
      return valid;
    },
    handleSubmit: function handleSubmit() {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this7$validate, _this7$validate2, status, fail;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this7.submit = true;

                _this7.rmUnwantedModels();

                _this7$validate = _this7.validate(), _this7$validate2 = _slicedToArray(_this7$validate, 2), status = _this7$validate2[0], fail = _this7$validate2[1];

                if (_this7.logs) {
                  console.log("form validations:", status);
                }

                if (!fail) {
                  _context.next = 8;
                  break;
                }

                _this7.resetFormState();

                _this7.onSubmitFail();

                return _context.abrupt("return");

              case 8:
                _context.next = 10;
                return _this7.onSubmit();

              case 10:
                _this7.resetFormState();

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
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

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('form', {
    class: [_vm.CLASS.form],
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
        return _vm.handleSubmit($event);
      }
    }
  }, [_vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.header]) + ">", "</div>", [_vm._t(_vm.SLOT.header)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.body]) + ">", "</div>", [_vm._l(_vm.fieldsSchema, function (schema, i) {
    return [_vm.showRow(schema) ? _vm._t(_vm.SLOT.beforeRow, null, {
      "model": _vm.getModelFromSchema(schema)
    }) : _vm._e(), _vm._ssrNode(" "), _vm.showRow(schema) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.row, _vm.classes.row]) + ">", "</div>", [!_vm.UTILS.isArr(schema) ? [_vm.showCol(schema) ? _vm._t(_vm.SLOT.beforeCol, null, {
      "model": _vm.getModelFromSchema(schema)
    }) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(schema) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.col, schema.model, _vm.classes.col]) + ">", "</div>", [_vm._t(_vm.SLOT.beforeComponent(schema.model)), _vm._ssrNode(" "), _c(_vm.componentToRender(schema), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[schema.model],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, schema.model, $$v);
        },
        expression: "fields[schema.model]"
      }
    }, 'component', _vm.componentProps(schema), false), _vm.componentEvents(schema)), [_vm._t(schema.model)], 2), _vm._ssrNode(" "), _vm._t(_vm.SLOT.afterComponent(schema.model))], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(schema) ? _vm._t(_vm.SLOT.afterCol, null, {
      "model": _vm.getModelFromSchema(schema)
    }) : _vm._e()] : [_vm._l(schema, function (s) {
      return [_vm.showCol(s) ? _vm._t(_vm.SLOT.beforeCol, null, {
        "model": _vm.getModelFromSchema(s)
      }) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(s) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.col, s.model, _vm.classes.col]) + ">", "</div>", [_vm._t(_vm.SLOT.beforeComponent(s.model)), _vm._ssrNode(" "), _c(_vm.componentToRender(s), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[s.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, s.model, $$v);
          },
          expression: "fields[s.model]"
        }
      }, 'component', _vm.componentProps(s), false), _vm.componentEvents(s)), [_vm._t(s.model)], 2), _vm._ssrNode(" "), _vm._t(_vm.SLOT.afterComponent(s.model))], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(s) ? _vm._t(_vm.SLOT.afterCol, null, {
        "model": _vm.getModelFromSchema(s)
      }) : _vm._e()];
    })]], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showRow(schema) ? _vm._t(_vm.SLOT.afterRow, null, {
      "model": _vm.getModelFromSchema(schema)
    }) : _vm._e()];
  })], 2), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrClass(null, _vm.CLASS.footer) + ">", "</div>", [_vm._t(_vm.SLOT.footer)], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-0bebac00";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);// Import vue component

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