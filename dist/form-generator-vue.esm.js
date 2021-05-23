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
      default: () => {// console.warn('submit handler prop not present');
      }
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
      default: () => {// console.warn('Form submit failed');
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
};

let debounce_timeout;
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
    return time => data => {
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
  header: 'fgv-form__header',
  body: 'fgv-form__body',
  footer: 'fgv-form__footer',
  row: 'fgv-form__body__row',
  colContainer: 'fgv-form__body__row__col-container',
  col: 'fgv-form__body__row__col-container__col'
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

//
var script = {
  mixins: [props],
  emits: ['input'],

  data() {
    const fields = {};
    const errors = {};
    const schemaValid = this.schemaValid();

    const addFieldsAndErrors = model => {
      var _this$value, _this$value$VMODEL$fi, _this$value2, _this$value2$VMODEL$e;

      fields[model] = ((_this$value = this.value) === null || _this$value === void 0 ? void 0 : (_this$value$VMODEL$fi = _this$value[VMODEL.fields]) === null || _this$value$VMODEL$fi === void 0 ? void 0 : _this$value$VMODEL$fi[model]) || '';
      errors[model] = ((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$e = _this$value2[VMODEL.errors]) === null || _this$value2$VMODEL$e === void 0 ? void 0 : _this$value2$VMODEL$e[model]) || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach(fieldConf => {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach(subFieldConf => {
            addFieldsAndErrors(subFieldConf.model);
          });
          return;
        }

        addFieldsAndErrors(fieldConf.model);
      });
    }

    return {
      fields,
      errors,
      submit: false
    };
  },

  computed: {
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS,

    globalAv() {
      return this.activeValidation || false;
    },

    globalAvDelay() {
      return this.activeValidationDelay || 0;
    },

    allFieldsArray() {
      var _this$schema;

      return UTILS.isArr((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },

    allFieldsFlatArray() {
      const arr = [];
      this.allFieldsArray.forEach(fieldConf => {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach(subFieldConf => {
            arr.push(subFieldConf);
          });
          return;
        }

        arr.push(fieldConf);
      });
      return arr;
    },

    allFieldsFlatObj() {
      return Object.fromEntries(this.allFieldsFlatArray.map(fieldConf => [fieldConf.model, fieldConf]));
    },

    debounceValidateField() {
      return UTILS.debounce(model => {
        this.fieldValidation(model);
      });
    }

  },
  watch: {
    disabled: {
      handler(newVal) {
        if (newVal) this.removeAllErrors();
      }

    },
    value: {
      handler() {
        var _this$value3;

        Object.keys(((_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : _this$value3[VMODEL.fields]) || {}).forEach(model => {
          var _this$value4, _this$value4$VMODEL$f, _this$value5, _this$value5$VMODEL$e;

          this.fields[model] = (_this$value4 = this.value) === null || _this$value4 === void 0 ? void 0 : (_this$value4$VMODEL$f = _this$value4[VMODEL.fields]) === null || _this$value4$VMODEL$f === void 0 ? void 0 : _this$value4$VMODEL$f[model];
          this.errors[model] = (_this$value5 = this.value) === null || _this$value5 === void 0 ? void 0 : (_this$value5$VMODEL$e = _this$value5[VMODEL.errors]) === null || _this$value5$VMODEL$e === void 0 ? void 0 : _this$value5$VMODEL$e[model];
        });
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
    Object.keys(this.fields).forEach(model => {
      const fieldConf = this.fieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(fieldConf); // when only data type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }

        this.validate(fieldConf, true);
      }, {
        deep: true
      });
    });
  },

  methods: {
    logger(items) {
      if (this.logs) {
        console.log(...items);
      }
    },

    emitData() {
      this.$emit('input', {
        [VMODEL.fields]: { ...this.fields
        },
        [VMODEL.errors]: { ...this.errors
        }
      });
    },

    resetForm() {
      this.submit = false;
    },

    schemaValid() {
      var _this$schema2, _this$schema3, _this$schema3$SCHEMA$;

      return UTILS.isArr((_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : _this$schema2[SCHEMA.fields]) && ((_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$SCHEMA$ = _this$schema3[SCHEMA.fields]) === null || _this$schema3$SCHEMA$ === void 0 ? void 0 : _this$schema3$SCHEMA$.length);
    },

    showRow(fieldConf) {
      return UTILS.isArr(fieldConf) ? this.showCols(fieldConf) : this.showCol(fieldConf);
    },

    showCols(fieldConf) {
      return fieldConf.length && fieldConf.some(conf => this.showCol(conf));
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

    componentProps(fieldConf) {
      var _fieldConf$vBind;

      const componentName = this.componentName(fieldConf);
      const componentData = this.componentData(componentName); // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';

      const errorPropName = componentData === null || componentData === void 0 ? void 0 : componentData.errorProp;
      return { ...(errorPropName ? {
          [errorPropName]: this.errors[fieldConf.model]
        } : {}),
        ...fieldConf.vBind,
        type: (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind = fieldConf.vBind) === null || _fieldConf$vBind === void 0 ? void 0 : _fieldConf$vBind.type) || FIELD.type.text
      };
    },

    removeAllErrors() {
      Object.keys(this.errors).forEach(model => {
        this.errors[model] = '';
      });
    },

    setError(model, err, noErr) {
      if (UTILS.isBool(err) && err || !UTILS.isBool(err) && !err) {
        this.errors[model] = noErr;
        return;
      }

      this.errors[model] = err;
    },

    componentData(name) {
      return this.components.find(component => (component === null || component === void 0 ? void 0 : component.name) === name);
    },

    typeCoercion(fieldConf) {
      var _fieldConf$vBind2;

      if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
        return;
      }

      if ((fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind2 = fieldConf.vBind) === null || _fieldConf$vBind2 === void 0 ? void 0 : _fieldConf$vBind2.type) === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },

    componentEvents(fieldConf) {
      return UTILS.isObj(fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.vOn]) ? fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.vOn] : {};
    },

    componentName(fieldConf) {
      var _fieldConf$vBind3, _fieldConf$vBind4;

      const fieldType = (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind3 = fieldConf.vBind) === null || _fieldConf$vBind3 === void 0 ? void 0 : _fieldConf$vBind3.type) || FIELD.type.text;
      const component = this.components.find(({
        types
      }) => types.includes(fieldType));
      const componentName = (fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind4 = fieldConf.vBind) === null || _fieldConf$vBind4 === void 0 ? void 0 : _fieldConf$vBind4.is) || (component === null || component === void 0 ? void 0 : component.name);
      return componentName;
    },

    fieldConf(model) {
      return this.allFieldsFlatObj[model];
    },

    fieldDisabled(fieldConf) {
      var _fieldConf$vBind5;

      const DISABLED = true;
      const fieldDisabled = (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.disabled in fieldConf.vBind ? (_fieldConf$vBind5 = fieldConf.vBind) === null || _fieldConf$vBind5 === void 0 ? void 0 : _fieldConf$vBind5[FIELD.vBind.disabled] : !DISABLED;
      return this.disabled || fieldDisabled;
    },

    fieldRequired(fieldConf) {
      var _fieldConf$vBind6;

      const REQUIRED = true;

      if (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.rules]) {
        return REQUIRED;
      }

      return (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.required in fieldConf.vBind ? Boolean(fieldConf === null || fieldConf === void 0 ? void 0 : (_fieldConf$vBind6 = fieldConf.vBind) === null || _fieldConf$vBind6 === void 0 ? void 0 : _fieldConf$vBind6[FIELD.vBind.required]) : !REQUIRED;
    },

    fieldHidden(fieldConf) {
      var _fieldConf$vBind7;

      const HIDDEN = true;
      return (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf.vBind) && FIELD.vBind.hidden in fieldConf.vBind ? (_fieldConf$vBind7 = fieldConf.vBind) === null || _fieldConf$vBind7 === void 0 ? void 0 : _fieldConf$vBind7[FIELD.vBind.hidden] : !HIDDEN;
    },

    runRules(noErr, rules, val) {
      let res;

      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          res = rule;

          if (UTILS.isFunc(rule)) {
            res = UTILS.handleFunc(rule, val);
          }

          if (UTILS.isStr(res)) {
            break;
          }
        }
      }

      return UTILS.isStr(res) ? res : noErr;
    },

    fieldValidation(fieldConf) {
      const NO_ERR = '';
      const fieldRequired = this.fieldRequired(fieldConf);
      const err = this.submit || (fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.av]) || this.globalAv ? this.runRules(NO_ERR, fieldConf === null || fieldConf === void 0 ? void 0 : fieldConf[FIELD.rules], this.fields[fieldConf.model]) : NO_ERR;

      if (!fieldRequired) {
        if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      } else this.setError(fieldConf.model, err, NO_ERR);

      return err;
    },

    validate(fieldConf = undefined, isWatcher = false) {
      // watcher handler
      if (fieldConf && isWatcher) {
        const fieldAv = fieldConf[FIELD.av] || this.globalAv;
        const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

        if (fieldAv && fieldAvDelay) {
          this.debounceValidateField(fieldAvDelay)(fieldConf);
        } else this.fieldValidation(fieldConf);

        return;
      } // watcher handler end
      // On form submit


      const fieldsStatus = {};
      Object.values(this.allFieldsFlatObj).forEach(conf => {
        const err = this.fieldValidation(conf);
        fieldsStatus[conf.model] = {
          validationSuccess: !err ? true : !this.fieldRequired(conf),
          schema: conf
        };
      });
      const submitFail = Object.keys(fieldsStatus).find(model => !fieldsStatus[model].validationSuccess);
      return {
        fieldsStatus,
        submitFail
      };
    },

    async handleSubmit() {
      this.submit = true;
      const {
        fieldsStatus,
        submitFail
      } = this.validate();
      this.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus]);

      if (submitFail) {
        this.resetForm();
        await this.onSubmitFail();
        return;
      }

      await this.onSubmit();
      this.resetForm();
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

  return _c('form', {
    tag: "component",
    class: [_vm.CLASS.form],
    on: {
      "submit": function ($event) {
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
        callback: function ($$v) {
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
          callback: function ($$v) {
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

// Import vue component

const install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;
