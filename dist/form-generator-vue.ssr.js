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
      default: function _default() {// console.warn('submit handler prop not present');
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
      default: function _default() {// console.warn('Form submit failed');
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
  colContainer: 'fgv-form__body__row__col-container',
  col: 'fgv-form__body__row__col-container__col'
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
  vBind: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  rules: 'rules'
};var script = {
  mixins: [props],
  emits: ['input'],
  data: function data() {
    var _this = this;

    var fields = {};
    var errors = {};
    var schemaValid = this.schemaValid();

    var addFieldsAndErrors = function addFieldsAndErrors(model) {
      var _this$value, _this$value$VMODEL$fi, _this$value2, _this$value2$VMODEL$e;

      fields[model] = ((_this$value = _this.value) === null || _this$value === void 0 ? void 0 : (_this$value$VMODEL$fi = _this$value[VMODEL.fields]) === null || _this$value$VMODEL$fi === void 0 ? void 0 : _this$value$VMODEL$fi[model]) || '';
      errors[model] = ((_this$value2 = _this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$e = _this$value2[VMODEL.errors]) === null || _this$value2$VMODEL$e === void 0 ? void 0 : _this$value2$VMODEL$e[model]) || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach(function (fieldConf) {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach(function (subFieldConf) {
            addFieldsAndErrors(subFieldConf.model);
          });
          return;
        }

        addFieldsAndErrors(fieldConf.model);
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
          return;
        }

        arr.push(fieldConf);
      });
      return arr;
    },
    allFieldsFlatObj: function allFieldsFlatObj() {
      return Object.fromEntries(this.allFieldsFlatArray.map(function (fieldConf) {
        return [fieldConf.model, fieldConf];
      }));
    },
    debounceValidateField: function debounceValidateField() {
      var _this2 = this;

      return UTILS.debounce(function (model) {
        _this2.fieldValidation(model);
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
        var _this$value3,
            _this3 = this;

        Object.keys(((_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : _this$value3[VMODEL.fields]) || {}).forEach(function (model) {
          var _this3$value, _this3$value$VMODEL$f, _this3$value2, _this3$value2$VMODEL$;

          _this3.fields[model] = (_this3$value = _this3.value) === null || _this3$value === void 0 ? void 0 : (_this3$value$VMODEL$f = _this3$value[VMODEL.fields]) === null || _this3$value$VMODEL$f === void 0 ? void 0 : _this3$value$VMODEL$f[model];
          _this3.errors[model] = (_this3$value2 = _this3.value) === null || _this3$value2 === void 0 ? void 0 : (_this3$value2$VMODEL$ = _this3$value2[VMODEL.errors]) === null || _this3$value2$VMODEL$ === void 0 ? void 0 : _this3$value2$VMODEL$[model];
        });
      },
      deep: true
    },
    fields: {
      handler: function handler() {
        this.emitData();
      },
      deep: true,
      immediate: true
    }
  },
  created: function created() {
    var _this4 = this;

    Object.keys(this.fields).forEach(function (model) {
      var fieldConf = _this4.fieldConf(model);

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
    logger: function logger(items) {
      if (this.logs) {
        var _console;

        (_console = console).log.apply(_console, _toConsumableArray(items));
      }
    },
    emitData: function emitData() {
      var _this$$emit;

      this.$emit('input', (_this$$emit = {}, _defineProperty(_this$$emit, VMODEL.fields, _objectSpread2({}, this.fields)), _defineProperty(_this$$emit, VMODEL.errors, _objectSpread2({}, this.errors)), _this$$emit));
    },
    resetForm: function resetForm() {
      this.submit = false;
    },
    schemaValid: function schemaValid() {
      var _this$schema2, _this$schema3, _this$schema3$SCHEMA$;

      return UTILS.isArr((_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : _this$schema2[SCHEMA.fields]) && ((_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$SCHEMA$ = _this$schema3[SCHEMA.fields]) === null || _this$schema3$SCHEMA$ === void 0 ? void 0 : _this$schema3$SCHEMA$.length);
    },
    showRow: function showRow(fieldConf) {
      return UTILS.isArr(fieldConf) ? this.showCols(fieldConf) : this.showCol(fieldConf);
    },
    showCols: function showCols(fieldConf) {
      var _this5 = this;

      return fieldConf.length && fieldConf.some(function (conf) {
        return _this5.showCol(conf);
      });
    },
    showCol: function showCol(fieldConf) {
      return this.componentName(fieldConf) && !this.fieldHidden(fieldConf);
    },
    slotProps: function slotProps(fieldConf) {
      if (UTILS.isArr(fieldConf)) {
        return fieldConf.map(function (_ref) {
          var model = _ref.model;
          return model;
        });
      }

      return [fieldConf.model];
    },
    componentProps: function componentProps(fieldConf) {
      var _fieldConf$vBind;

      var componentName = this.componentName(fieldConf);
      var componentData = this.componentData(componentName); // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';

      var errorPropName = componentData === null || componentData === void 0 ? void 0 : componentData.errorProp;
      return _objectSpread2(_objectSpread2(_objectSpread2({}, errorPropName ? _defineProperty({}, errorPropName, this.errors[fieldConf.model]) : {}), fieldConf.vBind), {}, {
        type: (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind = fieldConf.vBind) === null || _fieldConf$vBind === void 0 ? void 0 : _fieldConf$vBind.type) || FIELD.type.text
      });
    },
    removeAllErrors: function removeAllErrors() {
      var _this6 = this;

      Object.keys(this.errors).forEach(function (model) {
        _this6.errors[model] = '';
      });
    },
    setError: function setError(model, err, noErr) {
      if (UTILS.isBool(err) && err || !UTILS.isBool(err) && !err) {
        this.errors[model] = noErr;
        return;
      }

      this.errors[model] = err;
    },
    componentData: function componentData(name) {
      return this.components.find(function (component) {
        return (component === null || component === void 0 ? void 0 : component.name) === name;
      });
    },
    typeCoercion: function typeCoercion(fieldConf) {
      var _fieldConf$vBind2;

      if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
        return;
      }

      if ((fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind2 = fieldConf.vBind) === null || _fieldConf$vBind2 === void 0 ? void 0 : _fieldConf$vBind2.type) === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },
    componentEvents: function componentEvents(fieldConf) {
      return UTILS.isObj(fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.vOn]) ? fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.vOn] : {};
    },
    componentName: function componentName(fieldConf) {
      var _fieldConf$vBind3, _fieldConf$vBind4;

      var fieldType = (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind3 = fieldConf.vBind) === null || _fieldConf$vBind3 === void 0 ? void 0 : _fieldConf$vBind3.type) || FIELD.type.text;
      var component = this.components.find(function (_ref3) {
        var types = _ref3.types;
        return types.includes(fieldType);
      });
      var componentName = (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind4 = fieldConf.vBind) === null || _fieldConf$vBind4 === void 0 ? void 0 : _fieldConf$vBind4.is) || (component === null || component === void 0 ? void 0 : component.name);
      return componentName;
    },
    fieldConf: function fieldConf(model) {
      return this.allFieldsFlatObj[model];
    },
    fieldDisabled: function fieldDisabled(fieldConf) {
      var _fieldConf$vBind5;

      var DISABLED = true;
      var fieldDisabled = (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.disabled in fieldConf.vBind ? (_fieldConf$vBind5 = fieldConf.vBind) === null || _fieldConf$vBind5 === void 0 ? void 0 : _fieldConf$vBind5[FIELD.vBind.disabled] : !DISABLED;
      return this.disabled || fieldDisabled;
    },
    fieldRequired: function fieldRequired(fieldConf) {
      var _fieldConf$vBind6;

      var REQUIRED = true;

      if (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.rules]) {
        return REQUIRED;
      }

      return (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.required in fieldConf.vBind ? Boolean(fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind6 = fieldConf.vBind) === null || _fieldConf$vBind6 === void 0 ? void 0 : _fieldConf$vBind6[FIELD.vBind.required]) : !REQUIRED;
    },
    fieldHidden: function fieldHidden(fieldConf) {
      var _fieldConf$vBind7;

      var HIDDEN = true;
      return (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.hidden in fieldConf.vBind ? (_fieldConf$vBind7 = fieldConf.vBind) === null || _fieldConf$vBind7 === void 0 ? void 0 : _fieldConf$vBind7[FIELD.vBind.hidden] : !HIDDEN;
    },
    runRules: function runRules(noErr, rules, val) {
      var res;

      if (UTILS.isArr(rules)) {
        var _iterator = _createForOfIteratorHelper(rules),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rule = _step.value;
            // valid return values: string
            res = rule;

            if (UTILS.isFunc(rule)) {
              res = UTILS.handleFunc(rule, val);
            }

            if (UTILS.isStr(res)) {
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return UTILS.isStr(res) ? res : noErr;
    },
    fieldValidation: function fieldValidation(fieldConf) {
      var NO_ERR = '';
      var fieldRequired = this.fieldRequired(fieldConf);
      var err = this.submit || (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.av]) || this.globalAv ? this.runRules(NO_ERR, fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.rules], this.fields[fieldConf.model]) : NO_ERR;

      if (!fieldRequired) {
        if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      } else this.setError(fieldConf.model, err, NO_ERR);

      return err;
    },
    validate: function validate() {
      var _this7 = this;

      var fieldConf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var isWatcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // watcher handler
      if (fieldConf && isWatcher) {
        var fieldAv = fieldConf[FIELD.av] || this.globalAv;
        var fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

        if (fieldAv && fieldAvDelay) {
          this.debounceValidateField(fieldAvDelay)(fieldConf);
        } else this.fieldValidation(fieldConf);

        return;
      } // watcher handler end
      // On form submit


      var fieldsStatus = {};
      Object.values(this.allFieldsFlatObj).forEach(function (conf) {
        var err = _this7.fieldValidation(conf);

        fieldsStatus[conf.model] = {
          validationSuccess: !err ? true : !_this7.fieldRequired(conf),
          schema: conf
        };
      });
      var submitFail = Object.keys(fieldsStatus).find(function (model) {
        return !fieldsStatus[model].validationSuccess;
      });
      return {
        fieldsStatus: fieldsStatus,
        submitFail: submitFail
      };
    },
    handleSubmit: function handleSubmit() {
      var _this8 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this8$validate, fieldsStatus, submitFail;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this8.submit = true;
                _this8$validate = _this8.validate(), fieldsStatus = _this8$validate.fieldsStatus, submitFail = _this8$validate.submitFail;

                _this8.logger(["[SUBMIT ".concat(submitFail ? 'FAIL' : 'SUCCESS', "]"), fieldsStatus]);

                if (!submitFail) {
                  _context.next = 8;
                  break;
                }

                _this8.resetForm();

                _context.next = 7;
                return _this8.onSubmitFail();

              case 7:
                return _context.abrupt("return");

              case 8:
                _context.next = 10;
                return _this8.onSubmit();

              case 10:
                _this8.resetForm();

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
    tag: "component",
    class: [_vm.CLASS.form],
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
        return _vm.handleSubmit($event);
      }
    }
  }, [_c('div', {
    class: [_vm.CLASS.header]
  }, [_vm._t(_vm.SLOT.header)], 2), _vm._v(" "), _c('div', {
    class: [_vm.CLASS.body]
  }, [_vm._l(_vm.allFieldsArray, function (conf, i) {
    return [_vm.showRow(conf) ? _vm._t(_vm.SLOT.beforeRow, null, {
      "models": _vm.slotProps(conf)
    }) : _vm._e(), _vm._v(" "), _vm.showRow(conf) ? _c('div', {
      key: i,
      class: [_vm.CLASS.row, _vm.classes.row]
    }, [_vm._t(_vm.SLOT.rowStart, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('div', {
      class: [_vm.CLASS.colContainer]
    }, [!_vm.UTILS.isArr(conf) ? [_vm.showCol(conf) ? _vm._t(_vm.SLOT.beforeCol, null, {
      "models": _vm.slotProps(conf)
    }) : _vm._e(), _vm._v(" "), _vm.showCol(conf) ? _c('div', {
      key: conf.model,
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
    }, 'component', _vm.componentProps(conf), false), _vm.componentEvents(conf)), [_vm._t(conf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(conf.model))], 2) : _vm._e(), _vm._v(" "), _vm.showCol(conf) ? _vm._t(_vm.SLOT.afterCol, null, {
      "models": _vm.slotProps(conf)
    }) : _vm._e()] : [_vm._l(conf, function (subConf) {
      return [_vm.showCol(subConf) ? _vm._t(_vm.SLOT.beforeCol, null, {
        "models": _vm.slotProps(subConf)
      }) : _vm._e(), _vm._v(" "), _vm.showCol(subConf) ? _c('div', {
        key: subConf.model,
        class: [_vm.CLASS.col, subConf.model, _vm.classes.col]
      }, [_vm._t(_vm.SLOT.beforeComponent(subConf.model)), _vm._v(" "), _c(_vm.componentName(subConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subConf.model],
          callback: function callback($$v) {
            _vm.$set(_vm.fields, subConf.model, $$v);
          },
          expression: "fields[subConf.model]"
        }
      }, 'component', _vm.componentProps(subConf), false), _vm.componentEvents(subConf)), [_vm._t(subConf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(subConf.model))], 2) : _vm._e(), _vm._v(" "), _vm.showCol(subConf) ? _vm._t(_vm.SLOT.afterCol, null, {
        "models": _vm.slotProps(subConf)
      }) : _vm._e()];
    })]], 2), _vm._v(" "), _vm._t(_vm.SLOT.rowEnd, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e(), _vm._v(" "), _vm.showRow(conf) ? _vm._t(_vm.SLOT.afterRow, null, {
      "models": _vm.slotProps(conf)
    }) : _vm._e()];
  })], 2), _vm._v(" "), _c('div', {
    class: _vm.CLASS.footer
  }, [_vm._t(_vm.SLOT.footer)], 2)]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-34cfa44e";
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