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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
}var FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
var FIELD_IS_VALID = ''; // VALIDATION ENGINE 

function VALIDATION_ENGINE (fieldName, fieldValue, fieldRules, validationRules, allFields, submit) {
  var msg = fieldIsEmpty(fieldValue);
  var COMMON_VALIDATORS = validationRules.COMMON_VALIDATORS;
  var HAS_COMMON_RULES = !COMMON_VALIDATORS || !Object.keys(COMMON_VALIDATORS).length ? false : true;
  var VALIDATION_FUNCTION = validationRules[fieldName] || validationRules[fieldRules.type] || undefined;

  if (msg !== FIELD_IS_EMPTY) {
    if (HAS_COMMON_RULES) {
      for (var validator in COMMON_VALIDATORS) {
        !isFunc(COMMON_VALIDATORS[validator]) && console.error("".concat(validator, " is not a function."));
        msg = COMMON_VALIDATORS[validator](fieldValue, fieldRules, allFields);
        isUndef(msg) && console.error("".concat(validator, " return error string if field is invalid, return empty string when success"));
      }
    }

    if (!isFunc(VALIDATION_FUNCTION)) {
      fieldName in validationRules && console.error("".concat(VALIDATION_FUNCTION, " is not a function."));
      return validationResult(msg);
    }

    msg = VALIDATION_FUNCTION(fieldValue, fieldRules, allFields);
    return validationResult(msg);
  } else {
    msg = submit ? 'Required' : '';
    return validationResult(msg);
  }
}

function validationResult(msg) {
  var PASS = [true, ''];
  var FAIL = [false, msg];
  return msg !== FIELD_IS_VALID ? FAIL : PASS;
}

function fieldIsEmpty(value) {
  return String(value).trim() === '' || ![false, 0].includes(value) && !value ? FIELD_IS_EMPTY : FIELD_IS_VALID;
}

function isFunc(func) {
  return typeof func === 'function';
}

function isUndef(val) {
  return typeof val === 'undefined';
}var script = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    submitHandler: {
      type: Function,
      required: false,
      default: function _default() {
        console.error("submit handler not present");
      }
    },
    validationRules: {
      type: Object,
      required: false,
      default: function _default() {
        return {};
      }
    },
    formComponents: {
      type: Array,
      required: false,
      default: function _default() {
        return [];
      }
    },
    formEditable: {
      type: Boolean,
      required: false,
      default: true
    },
    validationConfig: {
      type: Object,
      required: false,
      default: function _default() {
        return {};
      }
    },
    formConfig: {
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
    handleSubmitFail: {
      type: Function,
      required: false,
      default: function _default() {
        console.warn("Form submit fail");
      }
    }
  },
  data: function data() {
    var fields = {};
    var errors = {};

    function addFieldsAndErrors(fieldConfig) {
      fields = _objectSpread2(_objectSpread2({}, fields), {}, _defineProperty({}, fieldConfig.model, "value" in fieldConfig ? fieldConfig.value : ""));
      errors = _objectSpread2(_objectSpread2({}, errors), {}, _defineProperty({}, fieldConfig.model, ""));
    }

    if ("fields" in this.formConfig) {
      var _iterator = _createForOfIteratorHelper(this.formConfig.fields),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var config = _step.value;

          if (this.isArr(config)) {
            var _iterator2 = _createForOfIteratorHelper(config),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var subConfig = _step2.value;
                addFieldsAndErrors(subConfig);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            addFieldsAndErrors(config);
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
    helperComponent: function helperComponent() {
      return "_formHelper";
    },
    activeValidation: function activeValidation() {
      return "activeValidation" in this.formConfig ? this.formConfig.activeValidation : false;
    },
    logs: function logs() {
      return "logs" in this.formConfig ? this.formConfig.logs : false;
    },
    fieldsConfig: function fieldsConfig() {
      return "fields" in this.formConfig && this.formConfig.fields.length ? this.formConfig.fields : [];
    },
    fieldsConfig_FLAT: function fieldsConfig_FLAT() {
      var flatConfig = [];

      var _iterator3 = _createForOfIteratorHelper(this.fieldsConfig),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var config = _step3.value;

          if (this.isArr(config)) {
            flatConfig = [].concat(_toConsumableArray(flatConfig), _toConsumableArray(config));
          } else {
            flatConfig = [].concat(_toConsumableArray(flatConfig), [config]);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return flatConfig;
    },
    vModelValid: function vModelValid() {
      var parentValid = this.value && _typeof(this.value) === 'object' && !this.isArr(this.value);
      var hasChildren = parentValid && 'values' in this.value && 'errors' in this.value;
      return hasChildren && _typeof(this.value.values) === 'object' && !this.isArr(this.value.values) && _typeof(this.value.errors) === 'object' && !this.isArr(this.value.errors);
    }
  },
  watch: {
    formEditable: {
      handler: function handler(newVal) {
        !newVal && this.removeAllErrors();
      }
    },
    value: {
      handler: function handler() {
        if (this.vModelValid) {
          for (var fieldName in this.value["values"]) {
            fieldName in this.fields && (this.fields[fieldName] = this.value["values"][fieldName]);
            fieldName in this.errors && (this.errors[fieldName] = this.value["errors"][fieldName]);
          }
        }
      },
      // immediate: true,
      deep: true
    },
    fields: {
      handler: function handler(newVal) {
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
    var _this = this;

    this.$emit("setFormContext", this);

    var _loop = function _loop(fieldName) {
      _this.$watch("fields.".concat(fieldName), function (newVal, oldVal) {
        // for number type field.
        this.convertToNumber(fieldName); // for helper components

        this.updateHelpers(fieldName, newVal); // to prevent below calls when only type is changed.

        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        }

        this.validateField(fieldName);
      });
    };

    for (var fieldName in this.fields) {
      _loop(fieldName);
    }
  },
  methods: {
    resetFormState: function resetFormState() {
      this.submit = false;
    },
    removeAllErrors: function removeAllErrors() {
      for (var msg in this.errors) {
        this.errors[msg] = "";
      }
    },
    showErrors: function showErrors(field, msg) {
      this.errors[field] = msg;
    },
    isHelperComponent: function isHelperComponent(fieldName) {
      return fieldName.includes(this.helperComponent);
    },
    updateHelpers: function updateHelpers(fieldName, newVal) {
      var VAL = newVal; // for helper field

      if (this.isHelperComponent(fieldName)) {
        var fieldBeingHelped = fieldName.split(this.helperComponent)[0];
        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
        return;
      } // for field being helped


      if ("".concat(fieldName).concat(this.helperComponent) in this.fields) {
        var helperField = "".concat(fieldName).concat(this.helperComponent);
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue: function setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] = "value" in fieldConfig ? fieldConfig.value : "";
    },
    fieldVisible: function fieldVisible(fieldConfig) {
      var SHOW = "show" in fieldConfig ? typeof fieldConfig.show === "function" ? fieldConfig.show(this) : Boolean(fieldConfig.show) : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },
    bindProps: function bindProps(fieldConfig) {
      var _objectSpread4;

      var componentName = this.computedComponent(fieldConfig);
      var formComponent = this.formComponents.find(function (_ref) {
        var component = _ref.component;
        return component.name === componentName;
      });

      var _ref2 = fieldConfig.errorProp ? {
        component: {
          errorProp: fieldConfig.errorProp
        }
      } : formComponent || {
        component: {
          errorProp: "errorMessage"
        }
      },
          errorProp = _ref2.component.errorProp;

      return _objectSpread2(_objectSpread2({}, fieldConfig.props), {}, (_objectSpread4 = {}, _defineProperty(_objectSpread4, errorProp, this.errors[fieldConfig.model]), _defineProperty(_objectSpread4, "disabled", this.fieldDisabled(fieldConfig)), _objectSpread4));
    },
    findFieldConfig: function findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find(function (conf) {
        return conf.model === fieldName;
      });
    },
    convertToNumber: function convertToNumber(fieldName) {
      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG && FIELD_CONFIG.type === "number" && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    bindEvents: function bindEvents(fieldConfig) {
      return "triggers" in fieldConfig && this.isFunc(fieldConfig.triggers) ? fieldConfig.triggers(this) : {};
    },
    computedComponent: function computedComponent(fieldConfig) {
      var FIELD_TYPE = fieldConfig.type || "text";

      if ("component" in fieldConfig) {
        return fieldConfig.component;
      }

      var _ref3 = this.formComponents.find(function (_ref4) {
        var type = _ref4.type;
        return type.includes(FIELD_TYPE);
      }) || {
        component: {
          name: ""
        }
      },
          name = _ref3.component.name;

      !name && console.error("Component cannot be rendered. Component for type \"".concat(FIELD_TYPE, "\" is not found in form-components."));
      return name;
    },
    fieldDisabled: function fieldDisabled(fieldConfig) {
      var DISABLED = true;
      var DISABLED_PROP = fieldConfig.props && "disabled" in fieldConfig.props ? this.isFunc(fieldConfig.props.disabled) ? fieldConfig.props.disabled(this) : Boolean(fieldConfig.props.disabled) : false;
      return !this.formEditable || DISABLED_PROP ? DISABLED : !DISABLED;
    },
    fieldRequired: function fieldRequired(fieldName) {
      var REQUIRED = true;
      var NOT_REQUIRED = false;
      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      var requiredProp = FIELD_CONFIG.props && "required" in FIELD_CONFIG.props ? this.isFunc(FIELD_CONFIG.props.required) ? FIELD_CONFIG.props.required(this) : Boolean(FIELD_CONFIG.props.required) : this.isHelperComponent(fieldName) ? NOT_REQUIRED : REQUIRED;
      return FIELD_CONFIG && !this.fieldDisabled(FIELD_CONFIG) && this.fieldVisible(FIELD_CONFIG) ? requiredProp : NOT_REQUIRED;
    },
    validateField: function validateField(fieldName) {
      var REQUIRED = this.fieldRequired(fieldName);
      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      var FIELD_IS_VALID = [true, ""];
      var config_rules = FIELD_CONFIG.rules || {};

      var _ref5 = this.submit || this.activeValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], config_rules, this.validationRules, _objectSpread2({}, this.fields), this.submit) : FIELD_IS_VALID,
          _ref6 = _slicedToArray(_ref5, 2),
          fieldValid = _ref6[0],
          fieldErrorMsg = _ref6[1];

      !REQUIRED ? !this.submit && this.showErrors(fieldName, fieldErrorMsg) // for active validation
      : this.showErrors(fieldName, fieldErrorMsg);
      this.logs && console.log("model:".concat(fieldName, "\n"), "value:".concat(this.fields[fieldName], "\n"), "type:".concat(_typeof(this.fields[fieldName]), "\n"), "isValid:".concat(fieldValid, "\n"), "required:".concat(REQUIRED, "\n"), "errorMessage:".concat(fieldErrorMsg));
      return fieldValid;
    },
    submitForm: function submitForm() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var formValidationStatus, submitFail;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this2.submit = true;
                formValidationStatus = {};
                Object.keys(_this2.fields).forEach(function (fieldName) {
                  var required = _this2.fieldRequired(fieldName);

                  formValidationStatus[fieldName] = _this2.validateField(fieldName) || !required;
                });
                submitFail = Object.keys(formValidationStatus).find(function (fieldName) {
                  return !formValidationStatus[fieldName];
                });

                if (_this2.logs) {
                  console.log("form data:", _this2.fields);
                  console.log("form validations:", formValidationStatus);
                }

                if (!submitFail) {
                  _context.next = 9;
                  break;
                }

                _this2.resetFormState();

                _this2.handleSubmitFail(_this2.fields);

                return _context.abrupt("return");

              case 9:
                _context.next = 11;
                return _this2.submitHandler(_this2.fields);

              case 11:
                _this2.resetFormState();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    isUndef: function isUndef(val) {
      return typeof val === "undefined";
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
    throwError: function throwError(msg) {
      throw new Error(msg);
    },
    warn: function warn(msg) {
      console.warn(msg);
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
    staticClass: "generated-form",
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
        return _vm.submitForm($event);
      }
    }
  }, [_vm._ssrNode("<div class=\"generated-form__header\">", "</div>", [_vm._t("header")], 2), _vm._ssrNode(" "), _vm.formEditable ? _vm._ssrNode("<div class=\"generated-form__body\">", "</div>", [_vm._l(_vm.fieldsConfig, function (fieldConfig) {
    return [_vm._t("sectionLabel", null, {
      "fieldConfig": fieldConfig,
      "fieldsConfigFlat": _vm.fieldsConfig_FLAT
    }), _vm._ssrNode(" "), _vm.isArr(fieldConfig) || _vm.fieldVisible(fieldConfig) && _vm.computedComponent(fieldConfig) ? _vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row', _vm.classes.row]) + ">", "</div>", [_vm.isArr(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row__col', "col-" + subFieldConfig.model, _vm.classes.col]) + _vm._ssrStyle(null, null, {
        display: _vm.fieldVisible(subFieldConfig) && _vm.computedComponent(subFieldConfig) ? '' : 'none'
      }) + ">", "</div>", [[_vm._t(subFieldConfig.model + "_before"), _vm._ssrNode(" "), _c(_vm.computedComponent(subFieldConfig), _vm._g(_vm._b({
        key: subFieldConfig.model,
        ref: subFieldConfig.model,
        refInFor: true,
        tag: "component",
        attrs: {
          "type": subFieldConfig.type || 'text'
        },
        model: {
          value: _vm.fields[subFieldConfig.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subFieldConfig.model, $$v);
          },
          expression: "fields[subFieldConfig.model]"
        }
      }, 'component', _vm.bindProps(subFieldConfig), false), _vm.bindEvents(subFieldConfig)), [_vm._t("" + subFieldConfig.model)], 2), _vm._ssrNode(" "), _vm._t(subFieldConfig.model + "_after")]], 2)];
    })] : [_vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row__col', "col-" + fieldConfig.model, _vm.classes.col]) + ">", "</div>", [[_vm._t(fieldConfig.model + "_before"), _vm._ssrNode(" "), _c(_vm.computedComponent(fieldConfig), _vm._g(_vm._b({
      key: fieldConfig.model,
      ref: fieldConfig.model,
      refInFor: true,
      tag: "component",
      attrs: {
        "type": fieldConfig.type || 'text'
      },
      model: {
        value: _vm.fields[fieldConfig.model],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, fieldConfig.model, $$v);
        },
        expression: "fields[fieldConfig.model]"
      }
    }, 'component', _vm.bindProps(fieldConfig), false), _vm.bindEvents(fieldConfig)), [_vm._t("" + fieldConfig.model)], 2), _vm._ssrNode(" "), _vm._t(fieldConfig.model + "_after")]], 2)]], 2) : _vm._e()];
  })], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.formEditable ? _vm._t("disabled", null, {
    "fieldsConfigFlat": _vm.fieldsConfig_FLAT
  }) : _vm._e(), _vm._ssrNode(" "), _vm._t("agreement"), _vm._ssrNode(" "), _vm._t("actions"), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"generated-form__footer\">", "</div>", [_vm._t("footer")], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-09b250ff";
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