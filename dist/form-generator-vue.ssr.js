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
        console.error('submit handler not present');
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
        console.warn('Form submit fail');
      }
    },
    activeValidation: {
      type: Boolean,
      required: false,
      default: false
    },
    activeValidationDelay: {
      type: Number,
      required: false,
      default: 0
    },
    logs: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};var debounce_timeout;
var UTILS = {
  isUndef: function isUndef(val) {
    return typeof val === 'undefined';
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
    if (UTILS.isFunc(func)) {
      return func();
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
      return function (data) {
        clearTimeout(debounce_timeout);
        debounce_timeout = setTimeout(function () {
          clearTimeout(debounce_timeout);
          func(data);
        }, time);
      };
    };
  }
};var CLASS = {
  form: 'fgv-form',
  header: 'fgv-form__header',
  body: 'fgv-form__body',
  footer: 'fgv-form__footer',
  row: 'fgv-form__body__row',
  col: 'fgv-form__body__row__col'
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
  events: 'v-on',
  component: 'component',
  hide: 'hide',
  type: {
    text: 'text',
    number: 'number'
  },
  props: {
    required: 'required',
    disabled: 'disabled'
  },
  validator: 'validator'
};var script = {
  mixins: [props],
  emits: ['input'],
  data: function data() {
    var _this = this;

    var init = true;
    var fields = {};
    var errors = {};
    var vModelValid = this.vModelValid(init);
    var schemaValid = this.schemaValid();

    var addFieldsAndErrors = function addFieldsAndErrors(model) {
      var _this$value$VMODEL$fi, _this$value$VMODEL$er;

      fields[model] = vModelValid && ((_this$value$VMODEL$fi = _this.value[VMODEL.fields]) === null || _this$value$VMODEL$fi === void 0 ? void 0 : _this$value$VMODEL$fi[model]) || '';
      errors[model] = vModelValid && ((_this$value$VMODEL$er = _this.value[VMODEL.errors]) === null || _this$value$VMODEL$er === void 0 ? void 0 : _this$value$VMODEL$er[model]) || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach(function (fieldConf) {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach(function (subFieldConf) {
            addFieldsAndErrors(subFieldConf.model);
          });
        } else {
          addFieldsAndErrors(fieldConf.model);
        }
      });
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
    globalAv: function globalAv() {
      return this.activeValidation || false;
    },
    globalAvDelay: function globalAvDelay() {
      return this.activeValidationDelay || 0;
    },
    allFieldsArray: function allFieldsArray() {
      var _this$schema;

      return UTILS.isArr((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },
    allFieldsFlatArray: function allFieldsFlatArray() {
      var arr = [];
      this.allFieldsArray.forEach(function (fieldConf) {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach(function (subFieldConf) {
            arr.push(subFieldConf);
          });
        } else {
          arr.push(fieldConf);
        }
      });
      return arr;
    },
    allFieldsFlatObj: function allFieldsFlatObj() {
      var obj = this.allFieldsFlatArray.map(function (fieldConf) {
        return [fieldConf.model, fieldConf];
      });
      return Object.fromEntries(obj);
    },
    debounceValidateField: function debounceValidateField() {
      var _this2 = this;

      return UTILS.debounce(function (model) {
        _this2.validateField(model);
      });
    }
  },
  watch: {
    disabled: {
      handler: function handler(newVal) {
        if (newVal) this.removeAllErrors();
      }
    },
    value: {
      handler: function handler() {
        var _this3 = this;

        if (this.vModelValid()) {
          Object.keys(this.value[VMODEL.fields]).forEach(function (model) {
            _this3.fields[model] = _this3.value[VMODEL.fields][model];
            _this3.errors[model] = _this3.value[VMODEL.errors][model];
          });
        }
      },
      deep: true
    },
    fields: {
      handler: function handler() {
        var _this$$emit;

        this.filterFields();
        this.$emit('input', (_this$$emit = {}, _defineProperty(_this$$emit, VMODEL.fields, this.fields), _defineProperty(_this$$emit, VMODEL.errors, this.errors), _this$$emit));
      },
      deep: true,
      immediate: true
    }
  },
  created: function created() {
    var _this4 = this;

    Object.keys(this.fields).forEach(function (model) {
      var fieldConf = _this4.getFieldConf(model);

      _this4.$watch("fields.".concat(model), function (newVal, oldVal) {
        _this4.typeCoercion(fieldConf); // when only data type is changed.


        if (newVal == oldVal && _typeof(newVal) !== _typeof(oldVal)) {
          return;
        }

        _this4.validate(fieldConf, true);
      }, {
        deep: true
      });
    });
  },
  methods: {
    slotProps: function slotProps(fieldConf) {
      if (UTILS.isArr()) {
        return fieldConf.map(function (_ref) {
          var model = _ref.model;
          return model;
        });
      }

      return fieldConf.model;
    },
    validate: function validate() {
      var _this5 = this;

      var fieldConf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var isWatcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // for watcher
      if (fieldConf && isWatcher) {
        var fieldAv = fieldConf[FIELD.av] || this.globalAv;
        var fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

        if (fieldAv && fieldAvDelay) {
          this.debounceValidateField(fieldAvDelay)(fieldConf);
        } else this.validateField(fieldConf);

        return;
      } // for submit


      var validationsStatus = {};
      Object.values(this.allFieldsFlatObj).forEach(function (conf) {
        var err = _this5.validateField(conf);

        validationsStatus[conf.model] = !err ? true : !_this5.fieldRequired(conf);
      });
      var submitFail = Object.keys(validationsStatus).find(function (model) {
        return !validationsStatus[model];
      });
      return {
        validationsStatus: validationsStatus,
        submitFail: submitFail
      };
    },
    showRow: function showRow(fieldConf) {
      return this.hasFieldsToRender(fieldConf) || this.showCol(fieldConf);
    },
    hasFieldsToRender: function hasFieldsToRender(fieldConf) {
      var _this6 = this;

      return UTILS.isArr(fieldConf) && fieldConf.length && fieldConf.some(function (conf) {
        return !_this6.fieldHidden(conf);
      });
    },
    showCol: function showCol(fieldConf) {
      return this.componentToRender(fieldConf) && !this.fieldHidden(fieldConf);
    },
    vModelValid: function vModelValid() {
      var _this$value, _this$value2;

      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var isObj = this.value && UTILS.isObjNotArr(this.value);

      var hasFields = UTILS.isObjNotArr((_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value[VMODEL.fields]);

      var hasErrors = UTILS.isObjNotArr((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : _this$value2[VMODEL.errors]);

      if (init) {
        return isObj && hasFields;
      }

      return isObj && hasFields && hasErrors;
    },
    resetForm: function resetForm() {
      this.submit = false;
    },
    removeAllErrors: function removeAllErrors() {
      var _this7 = this;

      Object.keys(this.errors).forEach(function (model) {
        _this7.errors[model] = '';
      });
    },
    setError: function setError(model, err) {
      var oldErr = this.errors[model];

      if (oldErr === err || UTILS.isObj([oldErr, err]) && JSON.stringify(oldErr) === JSON.stringify(err)) {
        return;
      }

      this.errors[model] = err;
    },
    findComponentData: function findComponentData(name) {
      return this.components.find(function (component) {
        return (component === null || component === void 0 ? void 0 : component.name) === name;
      });
    },
    componentProps: function componentProps(fieldConf) {
      var _objectSpread2$1;

      var componentName = this.componentToRender(fieldConf);
      var component = this.findComponentData(componentName);
      var errorPropName = (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.errorProp) || (component === null || component === void 0 ? void 0 : component.errorProp) || 'errorMessages';
      return _objectSpread2(_objectSpread2({}, fieldConf.props), {}, (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, errorPropName, this.errors[fieldConf.model]), _defineProperty(_objectSpread2$1, "type", fieldConf.type || FIELD.type.text), _defineProperty(_objectSpread2$1, "disabled", this.fieldDisabled(fieldConf)), _defineProperty(_objectSpread2$1, "required", this.fieldRequired(fieldConf)), _objectSpread2$1));
    },
    typeCoercion: function typeCoercion(fieldConf) {
      if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
        return;
      }

      if ((fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.type) === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },
    componentEvents: function componentEvents(fieldConf) {
      return UTILS.isObj(fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.events]) ? fieldConf[FIELD.events] : {};
    },
    componentToRender: function componentToRender(fieldConf) {
      var fieldType = fieldConf.type || FIELD.type.text;

      if ((fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.component]) && UTILS.isStr(fieldConf[FIELD.component])) {
        return fieldConf.component;
      }

      var component = this.components.find(function (_ref2) {
        var type = _ref2.type;
        return type.includes(fieldType);
      });
      var componentName = component === null || component === void 0 ? void 0 : component.name;

      if (!componentName) {
        console.error("Component cannot be rendered. Component for type \"".concat(fieldType, "\" is not found in form-components."));
      }

      return componentName;
    },
    getFieldConf: function getFieldConf(m) {
      return this.allFieldsFlatObj[m];
    },
    fieldDisabled: function fieldDisabled(fieldConf) {
      var DISABLED = true;
      var hasDisabledProp = UTILS.isObj(fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.props) && FIELD.props.disabled in fieldConf.props;
      var fieldDisabled = hasDisabledProp ? UTILS.handleFuncOrBool(fieldConf.props[FIELD.props.disabled]) : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldRequired: function fieldRequired(fieldConf) {
      var REQUIRED = true;
      var hasRequiredProp = (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.props) && FIELD.props.required in fieldConf.props;
      var fieldRequired = hasRequiredProp ? UTILS.handleFuncOrBool(fieldConf.props[FIELD.props.required]) : !REQUIRED;
      return fieldConf && !this.fieldDisabled(fieldConf) && !this.fieldHidden(fieldConf) ? fieldRequired : !REQUIRED;
    },
    filterFields: function filterFields() {
      var _this8 = this;

      var unwantedFields = Object.keys(this.fields).filter(function (m) {
        return !_this8.allFieldsFlatArray.find(function (_ref3) {
          var model = _ref3.model;
          return m === model;
        });
      });
      unwantedFields.forEach(function (model) {
        delete _this8.fields[model];
        delete _this8.errors[model];
      });
    },
    fieldHidden: function fieldHidden(fieldConf) {
      var HIDDEN = true;
      var fieldHidden = FIELD.hide in fieldConf ? UTILS.handleFuncOrBool(fieldConf[FIELD.hide]) : !HIDDEN;
      return fieldHidden;
    },
    validateField: function validateField(fieldConf) {
      var NO_ERROR = '';
      var fieldRequired = this.fieldRequired(fieldConf);
      var validator = fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.validator;
      var avField = (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.av]) || this.globalAv;
      var error = this.submit || avField ? UTILS.handleFunc(validator) || NO_ERROR : NO_ERROR;

      if (!fieldRequired) {
        if (!this.submit) this.setError(fieldConf.model, error);
      } else this.setError(fieldConf.model, error);

      if (this.logs) {
        console.log(fieldConf.model, {
          value: this.fields[fieldConf.model],
          valid: !error,
          required: fieldRequired,
          error: error
        });
      }

      return error;
    },
    schemaValid: function schemaValid() {
      var _this$schema2;

      return UTILS.isArr((_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : _this$schema2[SCHEMA.fields]) && this.schema[SCHEMA.fields].length;
    },
    handleSubmit: function handleSubmit() {
      var _this9 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this9$validate, validationsStatus, submitFail;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this9.submit = true;

                _this9.filterFields();

                _this9$validate = _this9.validate(), validationsStatus = _this9$validate.validationsStatus, submitFail = _this9$validate.submitFail;

                if (_this9.logs) {
                  console.log('form validations:', validationsStatus);
                }

                if (!submitFail) {
                  _context.next = 9;
                  break;
                }

                _this9.resetForm();

                _context.next = 8;
                return _this9.onSubmitFail();

              case 8:
                return _context.abrupt("return");

              case 9:
                _context.next = 11;
                return _this9.onSubmit();

              case 11:
                _this9.resetForm();

              case 12:
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
  }, [_vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.header]) + ">", "</div>", [_vm._t(_vm.SLOT.header)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.body]) + ">", "</div>", [_vm._l(_vm.allFieldsArray, function (fieldConf, i) {
    return [_vm.showRow(fieldConf) ? _vm._t(_vm.SLOT.beforeRow, null, {
      "model": _vm.slotProps(fieldConf)
    }) : _vm._e(), _vm._ssrNode(" "), _vm.showRow(fieldConf) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.row, _vm.classes.row]) + ">", "</div>", [!_vm.UTILS.isArr(fieldConf) ? [_vm.showCol(fieldConf) ? _vm._t(_vm.SLOT.beforeCol, null, {
      "model": _vm.slotProps(fieldConf)
    }) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(fieldConf) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.col, fieldConf.model, _vm.classes.col]) + ">", "</div>", [_vm._t(_vm.SLOT.beforeComponent(fieldConf.model)), _vm._ssrNode(" "), _c(_vm.componentToRender(fieldConf), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[fieldConf.model],
        callback: function callback($$v) {
          _vm.$set(_vm.fields, fieldConf.model, $$v);
        },
        expression: "fields[fieldConf.model]"
      }
    }, 'component', _vm.componentProps(fieldConf), false), _vm.componentEvents(fieldConf)), [_vm._t(fieldConf.model)], 2), _vm._ssrNode(" "), _vm._t(_vm.SLOT.afterComponent(fieldConf.model))], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(fieldConf) ? _vm._t(_vm.SLOT.afterCol, null, {
      "model": _vm.slotProps(fieldConf)
    }) : _vm._e()] : [_vm._l(fieldConf, function (subFieldConf) {
      return [_vm.showCol(subFieldConf) ? _vm._t(_vm.SLOT.beforeCol, null, {
        "model": _vm.slotProps(subFieldConf)
      }) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(subFieldConf) ? _vm._ssrNode("<div" + _vm._ssrClass(null, [_vm.CLASS.col, subFieldConf.model, _vm.classes.col]) + ">", "</div>", [_vm._t(_vm.SLOT.beforeComponent(subFieldConf.model)), _vm._ssrNode(" "), _c(_vm.componentToRender(subFieldConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subFieldConf.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subFieldConf.model, $$v);
          },
          expression: "fields[subFieldConf.model]"
        }
      }, 'component', _vm.componentProps(subFieldConf), false), _vm.componentEvents(subFieldConf)), [_vm._t(subFieldConf.model)], 2), _vm._ssrNode(" "), _vm._t(_vm.SLOT.afterComponent(subFieldConf.model))], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showCol(subFieldConf) ? _vm._t(_vm.SLOT.afterCol, null, {
        "model": _vm.slotProps(subFieldConf)
      }) : _vm._e()];
    })]], 2) : _vm._e(), _vm._ssrNode(" "), _vm.showRow(fieldConf) ? _vm._t(_vm.SLOT.afterRow, null, {
      "model": _vm.slotProps(fieldConf)
    }) : _vm._e()];
  })], 2), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrClass(null, _vm.CLASS.footer) + ">", "</div>", [_vm._t(_vm.SLOT.footer)], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-521c28c6";
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