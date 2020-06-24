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
}// helpers -------------------------------------------
var FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
var FIELD_IS_VALID = '';

function fieldIsEmpty(value) {
  return String(value).trim() === '' ? FIELD_IS_EMPTY : FIELD_IS_VALID;
}

function throwError(msg) {
  throw new Error(msg);
} //  -------------------------------------------
// VALIDATION ENGINE ------------------------------------------------------------


var VALIDATION_ENGINE = function VALIDATION_ENGINE(fieldName, value, fieldRules, MASTER_RULES, fields, formSubmit) {
  var msg = fieldIsEmpty(value);
  var COMMON_VALIDATORS = MASTER_RULES.COMMON_VALIDATORS;
  var HAS_COMMON_RULES = !COMMON_VALIDATORS || !Object.keys(COMMON_VALIDATORS).length ? false : true;
  var VALIDATION_FUNCTION = MASTER_RULES[fieldName] || MASTER_RULES[fieldRules.type] || undefined;

  if (msg !== FIELD_IS_EMPTY) {
    //RUN COMMON VALIDATIONS ---------------------------------------------
    if (HAS_COMMON_RULES) {
      for (var validator in COMMON_VALIDATORS) {
        typeof COMMON_VALIDATORS[validator] !== 'function' && throwError("".concat(validator, " is not a function."));
        msg = COMMON_VALIDATORS[validator](value);
        typeof msg === 'undefined' && throwError("".concat(validator, " must return a string, empty incase of success and error message if field is invalid."));
      }
    } // ---------------------------------------------------------------


    if (typeof VALIDATION_FUNCTION !== 'function') {
      return validationResult(msg);
    }

    msg = VALIDATION_FUNCTION(value, fieldRules, fields);
    return validationResult(msg);
  } else {
    msg = formSubmit ? 'Required' : '';
    return validationResult(msg);
  }
};

function validationResult(msg) {
  var PASS = [true, ''];
  var FAIL = [false, msg];
  return msg !== FIELD_IS_VALID ? FAIL : PASS;
}var script = {
  props: {
    submitHandler: {
      type: Function,
      required: false,
      default: function _default() {
        console.log(this.fields);
        alert('submit handler not present');
      }
    },
    formRules: {
      type: Object,
      required: false,
      default: function _default() {
        return {};
      }
    },
    customComponentsMap: {
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
    }
  },
  data: function data() {
    var fields = {};
    var errors = {};

    function addFieldsAndErrors(field) {
      fields = _objectSpread2(_objectSpread2({}, fields), {}, _defineProperty({}, field.name, 'value' in field ? field.value : ''));
      errors = _objectSpread2(_objectSpread2({}, errors), {}, _defineProperty({}, field.name, ''));
    }

    'fields' in this.formConfig && this.formConfig.fields.forEach(function (field) {
      if (Array.isArray(field)) {
        field.forEach(function (subField) {
          addFieldsAndErrors(subField);
        });
      } else {
        addFieldsAndErrors(field);
      }
    });
    return {
      fields: fields,
      errors: errors,
      loading: false,
      submit: false
    };
  },
  computed: {
    formHelper: function formHelper() {
      return '_formHelper';
    },
    hasCustomComponentsMap: function hasCustomComponentsMap() {
      return Boolean(this.customComponentsMap.length);
    },
    activeValidation: function activeValidation() {
      return 'activeValidation' in this.formConfig ? this.formConfig.activeValidation : false;
    },
    fieldsConfig: function fieldsConfig() {
      return this.formConfig.fields;
    },
    fieldsConfig_FLAT: function fieldsConfig_FLAT() {
      var flatConfig = [];
      this.fieldsConfig.forEach(function (conf) {
        if (Array.isArray(conf)) {
          flatConfig = [].concat(_toConsumableArray(flatConfig), _toConsumableArray(conf));
        } else {
          flatConfig = [].concat(_toConsumableArray(flatConfig), [conf]);
        }
      });
      return flatConfig;
    },
    hasFieldsConfig: function hasFieldsConfig() {
      return this.fieldsConfig && Boolean(this.fieldsConfig.length);
    },
    defaultFieldComponents: function defaultFieldComponents() {
      return [];
    }
  },
  watch: {
    formEditable: {
      handler: function handler(newVal) {
        !newVal && this.removeAllErrors();
      }
    }
  },
  created: function created() {
    this.$emit('setFormContext', this);
  },
  mounted: function mounted() {
    var _this = this;

    Object.keys(this.fields).forEach(function (fieldName) {
      _this.$watch("fields.".concat(fieldName), function (newVal, oldVal) {
        //  fields value type to number (for fields with type number)
        this.convertToNumber(fieldName); // to prevent any unnecessary function call when only type of field property is changed.

        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        } // for helpers ---------------------------


        this.fieldHelpers(fieldName, newVal); // validations ------------------------

        this.validateField(fieldName);
      } // { deep: true }
      );
    });
  },
  methods: {
    resetForm: function resetForm() {
      this.submit = false;
      this.loading = false;
    },
    removeAllErrors: function removeAllErrors() {
      var _this2 = this;

      Object.keys(this.errors).forEach(function (msg) {
        _this2.errors[msg] = '';
      });
    },
    showErrors: function showErrors(field, msg) {
      this.errors[field] = msg;
    },
    fieldIsHelper: function fieldIsHelper(fieldName) {
      return fieldName.includes(this.formHelper);
    },
    fieldHelpers: function fieldHelpers(fieldName, newVal) {
      var VAL = newVal; // helping field ------------------

      if (this.fieldIsHelper(fieldName)) {
        var fieldBeingHelped = fieldName.split(this.formHelper)[0];
        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
      } // field being helped
      else if ("".concat(fieldName).concat(this.formHelper) in this.fields) {
          var helperField = "".concat(fieldName).concat(this.formHelper);
          this.fields[helperField] = VAL;
        }
    },
    setDefaultFieldValue: function setDefaultFieldValue(fieldConfig) {
      // const FIELD_NAME = Object.keys(this.fields).find(
      //   name => name === fieldConfig.name
      // );
      // this.fields[fieldConfig.name] = fieldConfig.value || '';
      this.fields[fieldConfig.name] = 'value' in fieldConfig ? fieldConfig.value : '';
    },
    fieldVisible: function fieldVisible(fieldConfig) {
      var SHOW = 'show' in fieldConfig ? fieldConfig.show(this) : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },
    bindProps: function bindProps(fieldConfig) {
      return _objectSpread2(_objectSpread2({
        name: fieldConfig.name
      }, fieldConfig.props), {}, {
        errorMsg: this.errors[fieldConfig.name],
        error: this.errors[fieldConfig.name],
        disabled: this.fieldDisabled(fieldConfig)
      });
    },
    findFieldConfig: function findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find(function (conf) {
        return conf.name === fieldName;
      });
    },
    convertToNumber: function convertToNumber(fieldName) {
      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG && FIELD_CONFIG.type === 'number' && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    bindEvents: function bindEvents(fieldConfig) {
      var events = {};

      if ('triggers' in fieldConfig) {
        events = fieldConfig.triggers(this);
        return events;
      }

      return events;
    },
    // custom component ---------------------------------------------
    hasCustomComponent: function hasCustomComponent(fieldConfig) {
      var FIELD_TYPE = fieldConfig.type || 'text';
      return 'component' in fieldConfig || this.findCustomComponentByType(FIELD_TYPE);
    },
    findCustomComponentByType: function findCustomComponentByType(fieldType) {
      return !this.hasCustomComponentsMap ? undefined : this.customComponentsMap.find(function (component) {
        return component.type.includes(fieldType);
      });
    },
    // ---------------------------------------------------------------
    computedComponent: function computedComponent(fieldConfig) {
      var FIELD_TYPE = fieldConfig.type || 'text';
      var DEFAULT_COMPONENT = this.findDefaultComponent(FIELD_TYPE);

      if ('component' in fieldConfig) {
        return fieldConfig.component;
      }

      var CUSTOM_COMPONENT = this.findCustomComponentByType(FIELD_TYPE);
      return CUSTOM_COMPONENT ? CUSTOM_COMPONENT.name : DEFAULT_COMPONENT;
    },
    findDefaultComponent: function findDefaultComponent() {
      return 'default component';
    },
    fieldDisabled: function fieldDisabled(fieldConfig) {
      var DISABLED = true;
      var FIELD_IS_DISABLED_IN_PROPS = fieldConfig.props && 'disabled' in fieldConfig.props ? fieldConfig.props.disabled : false;
      return !this.formEditable || FIELD_IS_DISABLED_IN_PROPS ? DISABLED : !DISABLED;
    },
    fieldRequired: function fieldRequired(fieldName) {
      var REQUIRED = true;
      var NOT_REQUIRED = false;
      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      return FIELD_CONFIG && !this.fieldDisabled(FIELD_CONFIG) && this.fieldVisible(FIELD_CONFIG) ? !this.fieldIsHelper(fieldName) ? 'required' in FIELD_CONFIG ? FIELD_CONFIG.required : REQUIRED : 'required' in FIELD_CONFIG ? FIELD_CONFIG.required : NOT_REQUIRED : NOT_REQUIRED;
    },
    validateField: function validateField(fieldName) {
      var REQUIRED = this.fieldRequired(fieldName); // const HAS_CONFIG = Object.keys(this.validationConfig).length;

      var FIELD_CONFIG = this.findFieldConfig(fieldName);
      var FIELD_IS_VALID = [true, ''];
      var fieldRules = FIELD_CONFIG.rules || {}; // console.log('validate field', fieldName, REQUIRED);

      var _ref = // REQUIRED && HAS_CONFIG
      REQUIRED ? this.submit || this.activeValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], fieldRules, this.formRules, _objectSpread2({}, this.fields), //sending immutable copy of fields
      this.submit) : FIELD_IS_VALID : FIELD_IS_VALID,
          _ref2 = _slicedToArray(_ref, 2),
          fieldValid = _ref2[0],
          fieldErrorMsg = _ref2[1];

      this.showErrors(fieldName, fieldErrorMsg);
      return fieldValid;
    },
    submitForm: function submitForm() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var inputs, NOT_VALID;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                inputs = [];
                NOT_VALID = false;
                _this3.loading = true;
                _this3.submit = true;
                Object.keys(_this3.fields).forEach(function (field) {
                  inputs.push(_this3.validateField(field));
                });

                if (!inputs.includes(NOT_VALID)) {
                  _context.next = 9;
                  break;
                }

                console.log('Form not valid');

                _this3.resetForm();

                return _context.abrupt("return");

              case 9:
                console.log('Form valid, calling submit handler');
                _context.next = 12;
                return _this3.submitHandler(_this3.fields);

              case 12:
                _this3.resetForm();

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

  return _vm.hasFieldsConfig ? _c('form', {
    staticClass: "generated-form",
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
        return _vm.submitForm($event);
      }
    }
  }, [_vm._ssrNode("<div class=\"generated-form__header\" data-v-2a6e4118>", "</div>", [_vm._t("header")], 2), _vm._ssrNode(" "), _vm.formEditable ? _vm._ssrNode("<div class=\"generated-form__body\" data-v-2a6e4118>", "</div>", [_vm._l(_vm.fieldsConfig, function (fieldConfig) {
    return [_vm._t("sectionLabel", null, {
      "fieldConfig": fieldConfig,
      "fieldsConfigFlat": _vm.fieldsConfig_FLAT
    }), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrAttrs({
      class: _vm.classes.row
    }) + " class=\"generated-form__body__row\" data-v-2a6e4118>", "</div>", [Array.isArray(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_vm.fieldVisible(subFieldConfig) ? _vm._ssrNode("<div" + _vm._ssrAttrs({
        class: _vm.classes.col
      }) + _vm._ssrClass("generated-form__body__row__col", "col-" + subFieldConfig.name) + " data-v-2a6e4118>", "</div>", [[_vm._t(subFieldConfig.name + "_before"), _vm._ssrNode(" "), _vm.hasCustomComponent(subFieldConfig) ? _c(_vm.computedComponent(subFieldConfig), _vm._g(_vm._b({
        key: subFieldConfig.name,
        ref: subFieldConfig.name,
        refInFor: true,
        tag: "component",
        attrs: {
          "type": subFieldConfig.type || 'text'
        },
        model: {
          value: _vm.fields[subFieldConfig.name],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subFieldConfig.name, typeof $$v === 'string' ? $$v.trim() : $$v);
          },
          expression: "fields[subFieldConfig.name]"
        }
      }, 'component', _vm.bindProps(subFieldConfig), false), _vm.bindEvents(subFieldConfig))) : _vm._e(), _vm._ssrNode(" "), _vm._t(subFieldConfig.name + "_after")]], 2) : _vm._e()];
    })] : [_vm.fieldVisible(fieldConfig) ? _vm._ssrNode("<div" + _vm._ssrAttrs({
      class: _vm.classes.col
    }) + _vm._ssrClass("generated-form__body__row__col", "col-" + fieldConfig.name) + " data-v-2a6e4118>", "</div>", [[_vm._t(fieldConfig.name + "_before"), _vm._ssrNode(" "), _vm.hasCustomComponent(fieldConfig) ? _c(_vm.computedComponent(fieldConfig), _vm._g(_vm._b({
      key: fieldConfig.name,
      ref: fieldConfig.name,
      refInFor: true,
      tag: "component",
      attrs: {
        "type": fieldConfig.type || 'text'
      },
      model: {
        value: _vm.fields[fieldConfig.name],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, fieldConfig.name, typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "fields[fieldConfig.name]"
      }
    }, 'component', _vm.bindProps(fieldConfig), false), _vm.bindEvents(fieldConfig))) : _vm._e(), _vm._ssrNode(" "), _vm._t(fieldConfig.name + "_after")]], 2) : _vm._e()]], 2)];
  })], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.formEditable ? _vm._t("disabled", null, {
    "fieldsConfigFlat": _vm.fieldsConfig_FLAT
  }) : _vm._e(), _vm._ssrNode(" "), _vm._t("agreement"), _vm._ssrNode(" "), _vm._t("actions"), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"generated-form__footer\" data-v-2a6e4118>", "</div>", [_vm._t("footer")], 2)], 2) : _vm._e();
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = "data-v-2a6e4118";
/* module identifier */

var __vue_module_identifier__ = "data-v-2a6e4118";
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