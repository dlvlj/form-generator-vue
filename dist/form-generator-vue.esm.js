const UTILS = {
  isUndef(val) {
    return typeof val === 'undefined';
  },

  isObjNotArr(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val);
    }

    return val.every(v => UTILS.isObj(v) && !UTILS.isArr(v));
  },

  isObj(val) {
    if (!UTILS.isArr(val)) {
      return typeof val === 'object';
    }

    return val.every(v => typeof v === 'object');
  },

  isArr(val) {
    return Array.isArray(val);
  },

  isFunc(val) {
    return typeof val === 'function';
  },

  isBool(val) {
    return typeof val === 'boolean';
  },

  isStr(val) {
    return typeof val === 'string';
  },

  throwError(msg) {
    throw new Error(msg);
  },

  warn(msg) {
    console.warn(msg);
  },

  hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }

    return children.every(child => child in parent);
  },

  handleFunc(func, params) {
    if (UTILS.isFunc(func)) {
      return func(params);
    }
  },

  handleFuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  },

  debounce(func) {
    let debounce_timeout;
    return (time, data) => {
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(() => {
        clearTimeout(debounce_timeout);
        func(data);
      }, time);
    };
  }

};

const CLASS = {
  form: 'fgv-form',
  header: 'fgv-header',
  body: 'fgv-body',
  footer: 'fgv-footer',
  row: 'fgv-row',
  rowContainer: 'fgv-row-container',
  colContainer: 'fgv-col-container',
  col: 'fgv-col'
};
const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `before-${v}`,
  afterComponent: v => `after-${v}`,
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowEnd: 'row-end',
  afterRow: 'after-row',
  beforeCol: 'before-col',
  afterCol: 'after-col'
};
const SCHEMA = {
  fields: 'fields',
  av: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
};
const VMODEL = {
  fields: 'fields',
  errors: 'errors'
};
const FIELD = {
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
};

var constants = {
  computed: {
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS
  }
};

//
var script = {
  mixins: [constants],
  props: {
    models: {
      type: Array,
      required: false,
      default: () => []
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: [_vm.CLASS.rowContainer]
  }, [_vm._t(_vm.SLOT.beforeRow, null, {
    "models": _vm.models
  }), _vm._v(" "), _c('div', {
    key: _vm.i,
    class: [_vm.CLASS.row, _vm.classes.row]
  }, [_vm._t(_vm.SLOT.rowStart, null, {
    "models": _vm.models
  }), _vm._v(" "), _vm._t("default"), _vm._v(" "), _vm._t(_vm.SLOT.rowEnd, null, {
    "models": _vm.models
  })], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterRow, null, {
    "models": _vm.models
  })], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

//
var script$1 = {
  mixins: [constants],
  props: {
    models: {
      type: Array,
      required: false,
      default: () => []
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    }
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: [_vm.CLASS.colContainer]
  }, [_vm._t(_vm.SLOT.beforeCol, null, {
    "models": _vm.models
  }), _vm._v(" "), _c('div', {
    class: [_vm.CLASS.col, _vm.models[0], _vm.classes.col]
  }, [_vm._t(_vm.SLOT.beforeComponent(_vm.models[0])), _vm._v(" "), _vm._t("default"), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(_vm.models[0]))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
    "models": _vm.models
  })], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    onSubmit: {
      type: Function,
      required: false,
      default: undefined
    },
    components: {
      type: Array,
      required: false,
      default: () => []
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    schema: {
      type: Object,
      default: () => ({})
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    },
    onSubmitFail: {
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
};

//
var script$2 = {
  components: {
    Row: __vue_component__,
    Column: __vue_component__$1
  },
  mixins: [props, constants],
  emits: ['input'],

  data() {
    var _this$value3;

    const fields = {};
    const errors = {};

    const addFieldsAndErrors = model => {
      var _this$value, _this$value$VMODEL$fi, _this$value2, _this$value2$VMODEL$e;

      fields[model] = ((_this$value = this.value) === null || _this$value === void 0 ? void 0 : (_this$value$VMODEL$fi = _this$value[VMODEL.fields]) === null || _this$value$VMODEL$fi === void 0 ? void 0 : _this$value$VMODEL$fi[model]) || '';
      errors[model] = ((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$e = _this$value2[VMODEL.errors]) === null || _this$value2$VMODEL$e === void 0 ? void 0 : _this$value2$VMODEL$e[model]) || '';
    };

    for (const fieldConf of this.schema[SCHEMA.fields]) {
      if (UTILS.isArr(fieldConf)) {
        for (const subFieldConf of fieldConf) {
          addFieldsAndErrors(subFieldConf.model);
        } // break;

      } else {
        addFieldsAndErrors(fieldConf.model);
      }
    }

    return {
      form: (_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : _this$value3.form,
      fields,
      errors,
      submit: false
    };
  },

  computed: {
    // SLOT: () => SLOT,
    // CLASS: () => CLASS,
    // UTILS: () => UTILS,
    globalAv() {
      return this.activeValidation || false;
    },

    // globalAvDelay() {
    //   return this.activeValidationDelay || 0;
    // },
    allFieldsArray() {
      var _this$schema;

      return UTILS.isArr((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },

    allFieldsFlatObj() {
      const obj = {};

      for (const fieldConf of this.allFieldsArray) {
        if (UTILS.isArr(fieldConf)) {
          for (const subFieldConf of fieldConf) {
            obj[subFieldConf.model] = subFieldConf;
          } // break;

        } else {
          obj[fieldConf.model] = fieldConf;
        }
      }

      return obj;
    } // debounceValidateField() {
    //   return UTILS.debounce((model) => {
    //     this.validateField(model);
    //   });
    // },


  },
  watch: {
    disabled: {
      handler() {
        this.removeAllErrors();
      }

    },
    value: {
      handler() {
        for (const model in (_this$value4 = this.value) === null || _this$value4 === void 0 ? void 0 : _this$value4[VMODEL.fields]) {
          var _this$value4, _this$value5, _this$value5$VMODEL$f, _this$value6, _this$value6$VMODEL$e;

          this.fields[model] = (_this$value5 = this.value) === null || _this$value5 === void 0 ? void 0 : (_this$value5$VMODEL$f = _this$value5[VMODEL.fields]) === null || _this$value5$VMODEL$f === void 0 ? void 0 : _this$value5$VMODEL$f[model];
          this.errors[model] = (_this$value6 = this.value) === null || _this$value6 === void 0 ? void 0 : (_this$value6$VMODEL$e = _this$value6[VMODEL.errors]) === null || _this$value6$VMODEL$e === void 0 ? void 0 : _this$value6$VMODEL$e[model];
        }
      },

      deep: true
    },
    fields: {
      handler() {
        this.emitData();
      },

      deep: true,
      immediate: true
    }
  },

  created() {
    for (const model in this.fields) {
      const fieldConf = this.fieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(fieldConf); // when only data type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        } // this.validate(fieldConf, true);


        this.validateField(fieldConf);
      }, {
        deep: true
      });
    } // Object.keys(this.fields).forEach((model) => {
    //   const fieldConf = this.fieldConf(model);
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
    logger(items) {
      if (this.logs) {
        console.log(...items);
      }
    },

    emitData() {
      this.$emit('input', {
        form: this.form,
        [VMODEL.fields]: { ...this.fields
        },
        [VMODEL.errors]: { ...this.errors
        }
      });
    },

    resetForm() {
      this.submit = false;
    },

    showRow(fieldConf) {
      return UTILS.isArr(fieldConf) ? fieldConf.length && fieldConf.some(conf => this.showCol(conf)) : this.showCol(fieldConf);
    },

    showCol(fieldConf) {
      return this.componentName(fieldConf) && !this.fieldHidden(fieldConf);
    },

    slotProps(fieldConf) {
      if (UTILS.isArr(fieldConf)) {
        return fieldConf.map(({
          model
        }) => model);
      }

      return [fieldConf.model];
    },

    componentProps(conf, options = {}) {
      const {
        form,
        field
      } = options;
      const componentName = this.componentName(conf, options);
      const componentData = this.componentData(componentName); // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;

      const p = { ...(conf === null || conf === void 0 ? void 0 : conf.vBind),
        disabled: Boolean(this.disabled || (conf === null || conf === void 0 ? void 0 : conf.disabled))
      };

      if (form) {
        var _conf$vBind;

        p.is = (conf === null || conf === void 0 ? void 0 : (_conf$vBind = conf.vBind) === null || _conf$vBind === void 0 ? void 0 : _conf$vBind.is) || 'form';
      }

      if (field) {
        var _conf$vBind2;

        if (componentData === null || componentData === void 0 ? void 0 : componentData.errorProp) {
          p[componentData.errorProp] = this.errors[conf.model];
        }

        p.type = (conf === null || conf === void 0 ? void 0 : (_conf$vBind2 = conf.vBind) === null || _conf$vBind2 === void 0 ? void 0 : _conf$vBind2.type) || FIELD.type.text;
      }

      return p;
    },

    removeAllErrors() {
      for (const model in this.errors) {
        this.errors[model] = '';
      }
    },

    setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }
      this.errors[model] = err;
    },

    componentData(name) {
      return this.components.find(component => (component === null || component === void 0 ? void 0 : component.name) === name);
    },

    typeCoercion(fieldConf) {
      var _fieldConf$vBind;

      if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
        return;
      }

      if ((fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind = fieldConf.vBind) === null || _fieldConf$vBind === void 0 ? void 0 : _fieldConf$vBind.type) === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },

    componentEvents(conf, options = {}) {
      const {
        form
      } = options;
      const e = (conf === null || conf === void 0 ? void 0 : conf[FIELD.vOn]) || {};

      if (form) {
        var _conf$vOn;

        e.submit = (conf === null || conf === void 0 ? void 0 : (_conf$vOn = conf.vOn) === null || _conf$vOn === void 0 ? void 0 : _conf$vOn.submit) || this.handleSubmit;
      }

      return e;
    },

    componentName(fieldConf) {
      var _fieldConf$vBind2;

      if (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind2 = fieldConf.vBind) === null || _fieldConf$vBind2 === void 0 ? void 0 : _fieldConf$vBind2.is) {
        var _fieldConf$vBind3;

        return fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind3 = fieldConf.vBind) === null || _fieldConf$vBind3 === void 0 ? void 0 : _fieldConf$vBind3.is;
      }

      const componentData = this.components.find(({
        types
      }) => {
        var _fieldConf$vBind4;

        return types.includes(fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind4 = fieldConf.vBind) === null || _fieldConf$vBind4 === void 0 ? void 0 : _fieldConf$vBind4.type);
      });
      return componentData === null || componentData === void 0 ? void 0 : componentData.name;
    },

    fieldConf(model) {
      return this.allFieldsFlatObj[model];
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
    fieldHidden(fieldConf) {
      var _fieldConf$vBind5;

      const HIDDEN = true;
      return (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.hidden in fieldConf.vBind ? (_fieldConf$vBind5 = fieldConf.vBind) === null || _fieldConf$vBind5 === void 0 ? void 0 : _fieldConf$vBind5[FIELD.vBind.hidden] : !HIDDEN;
    },

    runFieldRules(rules, val) {
      let res;

      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          res = rule;

          if (UTILS.isFunc(rule)) {
            res = UTILS.handleFunc(rule, val);
          }

          if (![undefined, null, true].includes(res)) {
            break;
          }
        }
      }

      return res;
    },

    validateField(fieldConf) {
      const NO_ERR = ''; // const fieldRequired = this.fieldRequired(fieldConf);

      const err = this.submit || (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.av]) || this.globalAv ? this.runFieldRules(fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.rules], this.fields[fieldConf.model]) : NO_ERR; // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);

      this.setError(fieldConf.model, err);
      return err;
    },

    validateForm() {
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
      const fieldsStatus = {}; // Object.values(this.allFieldsFlatObj).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });

      for (const model in this.allFieldsFlatObj) {
        const conf = this.allFieldsFlatObj[model];
        const err = this.validateField(conf);
        fieldsStatus[conf.model] = {
          // validationSuccess: !err ? true : !this.fieldRequired(conf),
          validationSuccess: !err,
          schema: conf
        };
      }

      const submitFail = Object.keys(fieldsStatus).find(model => !fieldsStatus[model].validationSuccess);
      return {
        fieldsStatus,
        submitFail
      };
    },

    async handleSubmit(e) {
      e.preventDefault();
      this.submit = true;
      const {
        fieldsStatus,
        submitFail
      } = this.validateForm();
      this.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus]);

      if (submitFail) {
        this.resetForm();

        if (UTILS.isFunc(this.onSubmitFail)) {
          await this.onSubmitFail();
        }

        return;
      }

      if (UTILS.isFunc(this.onSubmit)) {
        await this.onSubmit();
        this.resetForm();
      }
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.componentName(_vm.schema.form), _vm._g(_vm._b({
    tag: "component",
    class: [_vm.CLASS.form],
    model: {
      value: _vm.form,
      callback: function ($$v) {
        _vm.form = $$v;
      },
      expression: "form"
    }
  }, 'component', _vm.componentProps(_vm.schema.form, {
    form: _vm.schema.form
  }), false), _vm.componentEvents(_vm.schema.form, {
    form: _vm.schema.form
  })), [_c('div', {
    class: [_vm.CLASS.header]
  }, [_vm._t(_vm.SLOT.header)], 2), _vm._v(" "), _c('div', {
    class: [_vm.CLASS.body]
  }, [_vm._l(_vm.allFieldsArray, function (conf, i) {
    return [_vm.showRow(conf) ? _c('Row', {
      key: i,
      attrs: {
        "models": _vm.slotProps(conf),
        "classes": _vm.classes
      }
    }, [!_vm.UTILS.isArr(conf) ? [_vm.showCol(conf) ? _c('Column', {
      key: conf.model,
      attrs: {
        "models": _vm.slotProps(conf),
        "classes": _vm.classes
      }
    }, [_c(_vm.componentName(conf), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[conf.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, conf.model, $$v);
        },
        expression: "fields[conf.model]"
      }
    }, 'component', _vm.componentProps(conf, {
      field: true
    }), false), _vm.componentEvents(conf)), [_vm._t(conf.model)], 2)], 1) : _vm._e()] : _vm._l(conf, function (subConf) {
      return [_vm.showCol(subConf) ? _c('Column', {
        key: subConf.model,
        attrs: {
          "models": _vm.slotProps(conf),
          "classes": _vm.classes
        }
      }, [_c(_vm.componentName(subConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subConf.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subConf.model, $$v);
          },
          expression: "fields[subConf.model]"
        }
      }, 'component', _vm.componentProps(subConf, {
        field: true
      }), false), _vm.componentEvents(subConf)), [_vm._t(subConf.model)], 2)], 1) : _vm._e()];
    })], 2) : _vm._e()];
  })], 2), _vm._v(" "), _c('div', {
    class: _vm.CLASS.footer
  }, [_vm._t(_vm.SLOT.footer)], 2)]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

// Import vue component

const install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__$2);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__$2.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__$2;
