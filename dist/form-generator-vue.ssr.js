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
    editable: {
      type: Boolean,
      required: false,
      default: true
    },
    // validationConfig: {
    //   type: Object,
    //   required: false,
    //   default: () => ({}),
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
    onSubmitFail: {
      type: Function,
      required: false,
      default: function _default() {
        console.warn("Form submit fail");
      }
    }
  }
};var UTILS = {
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
    return _typeof(val) === 'object';
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
  handlefuncOrBool: function handlefuncOrBool(val, funcParams) {
    var res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  }
};var FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
var FIELD_IS_VALID = '';
var SUCCESS = [true, FIELD_IS_VALID]; // VALIDATION ENGINE 

function VALIDATION_ENGINE (fieldName, fieldValue, fieldRule, validationRules, allFields, submit) {
  var error = checkEmpty(fieldValue);
  var emptyErr = 'emptyErr' in fieldRule ? fieldRule.emptyErr : 'Required';
  var filterData = validationRules.FILTER;
  var fieldValidator = fieldRule.validator || validationRules[fieldName];

  if (error !== FIELD_IS_EMPTY) {
    if (!UTILS.isFunc(filterData)) {
      !UTILS.isUndef(filterData) && console.error("filter ".concat(filterData, " is not a function."));
    } else {
      error = filterData(fieldValue, fieldRule, allFields);

      if (error !== FIELD_IS_VALID) {
        return result(error);
      }
    }

    if (!UTILS.isFunc(fieldValidator)) {
      !UTILS.isUndef(fieldValidator) && console.error("validator ".concat(fieldValidator, " is not a function."));
      return result(error);
    }

    error = fieldValidator(fieldValue, fieldRule, allFields);
    return result(error);
  } else {
    error = submit ? emptyErr : '';
    return result(error);
  }
}

function checkEmpty(value) {
  return String(value).trim() === '' || ![false, 0].includes(value) && !value ? FIELD_IS_EMPTY : FIELD_IS_VALID;
}

function result(error) {
  var fail = [false, error];
  return error !== FIELD_IS_VALID ? fail : SUCCESS;
}var HELPER_COMPONENT = "_helper";
var script = {
  mixins: [props],
  data: function data() {
    var _this = this;

    var INIT = true;
    var fields = {};
    var errors = {};

    var addFieldsAndErrors = function addFieldsAndErrors(model) {
      fields[model] = _this.vModelValid(INIT) && 'values' in _this.value ? _this.value.values[model] : '';
      errors[model] = _this.vModelValid(INIT) && 'errors' in _this.value ? _this.value.errors[model] : '';
    };

    if ("fields" in this.schema && UTILS.isArr(this.schema.fields) && this.schema.fields.length) {
      var _iterator = _createForOfIteratorHelper(this.schema.fields),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var config = _step.value;

          if (UTILS.isArr(config)) {
            var _iterator2 = _createForOfIteratorHelper(config),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var subConfig = _step2.value;
                addFieldsAndErrors(subConfig.model);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            addFieldsAndErrors(config.model);
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
    UTILS: function UTILS$1() {
      return UTILS;
    },
    activeValidation: function activeValidation() {
      return "activeValidation" in this.schema ? this.schema.activeValidation : false;
    },
    activeValidationDelay: function activeValidationDelay() {
      var hasActiveValidationDelay = "activeValidationDelay" in this.schema && this.schema.activeValidationDelay && !isNaN(this.schema.activeValidationDelay);
      return this.activeValidation && hasActiveValidationDelay ? this.schema.activeValidationDelay : false;
    },
    logs: function logs() {
      return "logs" in this.schema ? this.schema.logs : false;
    },
    fieldsConfig: function fieldsConfig() {
      return "fields" in this.schema && this.schema.fields.length ? this.schema.fields : [];
    },
    fieldsConfigFlat: function fieldsConfigFlat() {
      var flatConfig = [];

      var _iterator3 = _createForOfIteratorHelper(this.fieldsConfig),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var config = _step3.value;

          if (UTILS.isArr(config)) {
            var _iterator4 = _createForOfIteratorHelper(config),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var subConfig = _step4.value;
                flatConfig.push(subConfig);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else {
            flatConfig.push(config);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return flatConfig;
    },
    debounceValidateField: function debounceValidateField() {
      var _this2 = this;

      return this.debounce(function (fieldName) {
        _this2.validateField(fieldName);
      }, this.activeValidationDelay);
    }
  },
  watch: {
    editable: {
      handler: function handler(newVal) {
        !newVal && this.removeAllErrors();
      }
    },
    value: {
      handler: function handler() {
        if (this.vModelValid()) {
          for (var fieldName in this.value["values"]) {
            this.fields[fieldName] = this.value["values"][fieldName];
            this.errors[fieldName] = this.value["errors"][fieldName];
          }
        }
      },
      deep: true
    },
    fields: {
      handler: function handler() {
        this.removeUnwantedFields();
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

    this.$emit("setFormContext", this);

    var _loop = function _loop(fieldName) {
      _this3.$watch("fields.".concat(fieldName), function (newVal, oldVal) {
        // for number type field.
        this.convertToNumber(fieldName); // for helper components

        this.updateHelpers(fieldName, newVal); // to prevent below calls when only type is changed.

        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        }

        this.activeValidationDelay ? this.debounceValidateField(fieldName) : this.validateField(fieldName);
      });
    };

    for (var fieldName in this.fields) {
      _loop(fieldName);
    }
  },
  methods: {
    vModelValid: function vModelValid() {
      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var parentValid = this.value && UTILS.isObjNotArr(this.value);

      if (init) {
        return parentValid && 'values' in this.value;
      }

      var hasChildren = parentValid && UTILS.hasProperty(['values', 'errors'], this.value);

      return hasChildren && UTILS.isObjNotArr([this.value.values, this.value.errors]);
    },
    removeUnwantedFields: function removeUnwantedFields() {
      var _this4 = this;

      var uf = Object.keys(this.fields).filter(function (fieldName) {
        return !_this4.fieldsConfigFlat.find(function (_ref) {
          var model = _ref.model;
          return model === fieldName;
        });
      });
      uf.forEach(function (fieldName) {
        delete _this4.fields[fieldName];
        delete _this4.errors[fieldName];
      });
    },
    debounce: function debounce(func, wait) {
      var timeOut;
      return function executedFunction(param) {
        clearTimeout(timeOut);
        timeOut = setTimeout(function () {
          clearTimeout(timeOut);
          func(param);
        }, wait);
      };
    },
    resetFormState: function resetFormState() {
      this.submit = false;
    },
    removeAllErrors: function removeAllErrors() {
      for (var fieldName in this.errors) {
        this.errors[fieldName] = "";
      }
    },
    setError: function setError(field, msg) {
      this.errors[field] = msg;
    },
    isHelperComponent: function isHelperComponent(fieldName) {
      return fieldName.includes(HELPER_COMPONENT);
    },
    updateHelpers: function updateHelpers(fieldName, newVal) {
      var VAL = newVal; // for helper field

      if (this.isHelperComponent(fieldName)) {
        var _fieldName$split = fieldName.split(HELPER_COMPONENT),
            _fieldName$split2 = _slicedToArray(_fieldName$split, 1),
            fieldBeingHelped = _fieldName$split2[0];

        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
        return;
      } // for field being helped


      if ("".concat(fieldName).concat(HELPER_COMPONENT) in this.fields) {
        var helperField = "".concat(fieldName).concat(HELPER_COMPONENT);
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue: function setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] = fieldConfig.model in this.value.values ? this.value.values[fieldConfig.model] : '';
    },
    fieldIsVisible: function fieldIsVisible(fieldConfig) {
      var VISIBLE = true;
      var fieldVisible = "show" in fieldConfig ? UTILS.handlefuncOrBool(fieldConfig.show, this) : VISIBLE;
      !fieldVisible && this.setDefaultFieldValue(fieldConfig);
      return fieldVisible;
    },
    componentProps: function componentProps(fieldConfig) {
      var _objectSpread2$1;

      var componentName = this.componentToRender(fieldConfig);
      var component = this.formComponents.find(function (c) {
        return c.compData && c.compData.name === componentName;
      });
      var errorPropName = fieldConfig.errorProp || component.compData.errorProp || 'error';
      return _objectSpread2(_objectSpread2({}, fieldConfig.props), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, errorPropName, this.errors[fieldConfig.model]), _defineProperty(_objectSpread2$1, "ref", fieldConfig.model), _defineProperty(_objectSpread2$1, "key", fieldConfig.model), _defineProperty(_objectSpread2$1, "type", fieldConfig.type || 'text'), _defineProperty(_objectSpread2$1, "disabled", this.fieldIsDisabled(fieldConfig)), _defineProperty(_objectSpread2$1, "required", this.fieldIsRequired(null, fieldConfig)), _objectSpread2$1));
    },
    findFieldConfig: function findFieldConfig(fieldName) {
      return this.fieldsConfigFlat.find(function (conf) {
        return conf.model === fieldName;
      });
    },
    convertToNumber: function convertToNumber(fieldName) {
      var fieldConfig = this.findFieldConfig(fieldName);
      fieldConfig && fieldConfig.type === "number" && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    componentEvents: function componentEvents(fieldConfig) {
      return 'triggers' in fieldConfig && UTILS.isFunc(fieldConfig.triggers) ? fieldConfig.triggers(this) : {};
    },
    componentToRender: function componentToRender(fieldConfig) {
      var fieldType = fieldConfig.type || 'text';

      if ('component' in fieldConfig && fieldConfig.component && UTILS.isStr(fieldConfig.component)) {
        return fieldConfig.component;
      }

      var component = this.formComponents.find(function (_ref2) {
        var type = _ref2.type;
        return type.includes(fieldType);
      });
      var componentName = component && component.compData ? component.compData.name : '';
      !componentName && console.error("Component cannot be rendered. Component for type \"".concat(fieldType, "\" is not found in form-components."));
      return componentName;
    },
    fieldIsDisabled: function fieldIsDisabled(fieldConfig) {
      var DISABLED = true;
      var hasDisabledProp = fieldConfig && fieldConfig.props && "disabled" in fieldConfig.props;
      var fieldDisabled = hasDisabledProp ? UTILS.handlefuncOrBool(fieldConfig.props.disabled, this) : !DISABLED;
      return !this.editable || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldIsRequired: function fieldIsRequired(name, config) {
      var REQUIRED = true;
      var fieldName = name || config.model;
      var fieldConfig = config || this.findFieldConfig(fieldName);
      var hasRequiredProp = fieldConfig && fieldConfig.props && 'required' in fieldConfig.props;
      var fieldRequired = hasRequiredProp ? UTILS.handlefuncOrBool(fieldConfig.props.required, this) : !this.isHelperComponent(fieldName);
      return fieldConfig && !this.fieldIsDisabled(fieldConfig) && this.fieldIsVisible(fieldConfig) ? fieldRequired : !REQUIRED;
    },
    validateField: function validateField(fieldName) {
      var SUCCESS = [true, ""];
      var fieldConfig = this.findFieldConfig(fieldName);
      var fieldRequired = this.fieldIsRequired(null, fieldConfig);
      var fieldRule = fieldConfig.rules || {};
      var fieldActiveValidation = 'activeValidation' in fieldConfig ? Boolean(fieldConfig.activeValidation) : this.activeValidation;

      var _ref3 = this.submit || fieldActiveValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], fieldRule, this.validationRules, _objectSpread2({}, this.fields), this.submit) : SUCCESS,
          _ref4 = _slicedToArray(_ref3, 2),
          valid = _ref4[0],
          error = _ref4[1];

      !fieldRequired ? !this.submit && this.setError(fieldName, error) : this.setError(fieldName, error);
      this.logs && console.log("model:".concat(fieldName, "\n"), "value:".concat(this.fields[fieldName], "\n"), "type:".concat(_typeof(this.fields[fieldName]), "\n"), "valid:".concat(valid, "\n"), "required:".concat(fieldRequired, "\n"), "error:".concat(error));
      return valid;
    },
    handleSubmit: function handleSubmit() {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var formValidationStatus, submitFail;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this5.submit = true;
                formValidationStatus = {};

                _this5.removeUnwantedFields();

                Object.keys(_this5.fields).forEach(function (fieldName) {
                  formValidationStatus[fieldName] = _this5.validateField(fieldName) || !_this5.fieldIsRequired(fieldName);
                });
                submitFail = Object.keys(formValidationStatus).find(function (fieldName) {
                  return !formValidationStatus[fieldName];
                });

                if (_this5.logs) {
                  console.log("form data:", _this5.fields);
                  console.log("form validations:", formValidationStatus);
                }

                if (!submitFail) {
                  _context.next = 10;
                  break;
                }

                _this5.resetFormState();

                _this5.onSubmitFail(_this5.fields);

                return _context.abrupt("return");

              case 10:
                _context.next = 12;
                return _this5.onSubmit(_this5.fields);

              case 12:
                _this5.resetFormState();

              case 13:
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
    staticClass: "generated-form",
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
        return _vm.handleSubmit($event);
      }
    }
  }, [_vm._ssrNode("<div class=\"generated-form__header\">", "</div>", [_vm._t("header")], 2), _vm._ssrNode(" "), _vm.editable ? _vm._ssrNode("<div class=\"generated-form__body\">", "</div>", [_vm._t("body-start"), _vm._ssrNode(" "), _vm._l(_vm.fieldsConfig, function (fieldConfig, i) {
    return [_vm._t("sectionLabel", null, {
      "fieldConfig": fieldConfig,
      "fieldsConfigFlat": _vm.fieldsConfigFlat
    }), _vm._ssrNode(" "), _vm.UTILS.isArr(fieldConfig) || _vm.fieldIsVisible(fieldConfig) && _vm.componentToRender(fieldConfig) ? _vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row', _vm.classes.row]) + ">", "</div>", [_vm.UTILS.isArr(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row__col', "col-" + subFieldConfig.model, _vm.classes.col]) + _vm._ssrStyle(null, null, {
        display: _vm.fieldIsVisible(subFieldConfig) && _vm.componentToRender(subFieldConfig) ? '' : 'none'
      }) + ">", "</div>", [[_vm._t(subFieldConfig.model + "_before"), _vm._ssrNode(" "), _c(_vm.componentToRender(subFieldConfig), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subFieldConfig.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subFieldConfig.model, $$v);
          },
          expression: "fields[subFieldConfig.model]"
        }
      }, 'component', _vm.componentProps(subFieldConfig), false), _vm.componentEvents(subFieldConfig)), [_vm._t("" + subFieldConfig.model)], 2), _vm._ssrNode(" "), _vm._t(subFieldConfig.model + "_after")]], 2)];
    })] : [_vm._ssrNode("<div" + _vm._ssrClass(null, ['generated-form__body__row__col', "col-" + fieldConfig.model, _vm.classes.col]) + ">", "</div>", [[_vm._t(fieldConfig.model + "_before"), _vm._ssrNode(" "), _c(_vm.componentToRender(fieldConfig), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[fieldConfig.model],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, fieldConfig.model, $$v);
        },
        expression: "fields[fieldConfig.model]"
      }
    }, 'component', _vm.componentProps(fieldConfig), false), _vm.componentEvents(fieldConfig)), [_vm._t("" + fieldConfig.model)], 2), _vm._ssrNode(" "), _vm._t(fieldConfig.model + "_after")]], 2)]], 2) : _vm._e()];
  }), _vm._ssrNode(" "), _vm._t("body-end")], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.editable ? _vm._t("uneditable", null, {
    "fieldsConfigFlat": _vm.fieldsConfigFlat
  }) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"generated-form__footer\">", "</div>", [_vm._t("footer")], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-2062e0c2";
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