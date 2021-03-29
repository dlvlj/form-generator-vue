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
      default: () => {
        console.error("submit handler not present");
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
      default: () => {
        console.warn("Form submit fail");
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
      return UTILS.isObj(val) && !UTILS.isArr(val);
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

  handleFunc(func, params = undefined) {
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
    return function (time) {
      return function exeFunction(p) {
        clearTimeout(debounce_timeout);
        debounce_timeout = setTimeout(() => {
          clearTimeout(debounce_timeout);
          func(p);
        }, time);
      };
    };
  }

};

const CLASS = {
  form: 'fgv-form',
  header: 'fgv-form__header',
  body: 'fgv-form__body',
  footer: 'fgv-form__footer',
  row: 'fgv-form__body__row',
  col: 'fgv-form__body__row__col'
};
const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `before-${v}`,
  afterComponent: v => `after-${v}`,
  beforeRow: 'before-row',
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
  values: 'values',
  errors: 'errors'
};
const FIELD = {
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
};

//
var script = {
  mixins: [props],
  emits: ['input'],

  data() {
    var _this$schema;

    const init = true;
    const fields = {};
    const errors = {};
    const vModelValid = this.vModelValid(init);
    const schemaValid = UTILS.isArr((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : _this$schema[SCHEMA.fields]) && this.schema[SCHEMA.fields].length;

    const addFieldsAndErrors = model => {
      var _this$value$VMODEL$va, _this$value$VMODEL$er;

      fields[model] = vModelValid && ((_this$value$VMODEL$va = this.value[VMODEL.values]) === null || _this$value$VMODEL$va === void 0 ? void 0 : _this$value$VMODEL$va[model]) || '';
      errors[model] = vModelValid && ((_this$value$VMODEL$er = this.value[VMODEL.errors]) === null || _this$value$VMODEL$er === void 0 ? void 0 : _this$value$VMODEL$er[model]) || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach(fieldsSchema => {
        if (UTILS.isArr(fieldsSchema)) {
          fieldsSchema.forEach(schema => {
            addFieldsAndErrors(schema.model);
          });
        } else {
          addFieldsAndErrors(fieldsSchema.model);
        }
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

    avGlobal() {
      return this.activeValidation || false;
    },

    avDelayGlobal() {
      return this.activeValidationDelay || 0;
    },

    fieldsSchema() {
      var _this$schema2;

      return UTILS.isArr((_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : _this$schema2[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },

    fieldsSchemaFlat() {
      const flatSchema = [];
      this.fieldsSchema.forEach(schema => {
        if (UTILS.isArr(schema)) {
          schema.forEach(s => {
            flatSchema.push(s);
          });
        } else {
          flatSchema.push(schema);
        }
      });
      return flatSchema;
    },

    fieldsSchemaMap() {
      const schemaMap = this.fieldsSchemaFlat.map(s => [s.model, s]);
      return Object.fromEntries(schemaMap);
    },

    debValidateField() {
      return UTILS.debounce(model => {
        this.validateField(model);
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
        if (this.vModelValid()) {
          Object.keys(this.value[VMODEL.values]).forEach(model => {
            this.fields[model] = this.value[VMODEL.values][model];
            this.errors[model] = this.value[VMODEL.errors][model];
          });
        }
      },

      deep: true
    },
    fields: {
      handler() {
        this.rmUnwantedModels();
        this.$emit('input', {
          values: this.fields,
          errors: this.errors
        });
      },

      deep: true,
      immediate: true
    }
  },

  created() {
    Object.keys(this.fields).forEach(model => {
      const schema = this.findSchema(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(schema); // when only data type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        } // validation ---------------------------


        this.validate(schema, true);
      }, {
        deep: true
      });
    });
  },

  methods: {
    slotProps(schema) {
      if (UTILS.isArr()) {
        return schema.map(({
          model
        }) => model);
      }

      return schema.model;
    },

    validate(schema = undefined, watcher = false) {
      // for watcher
      if (schema && watcher) {
        const avField = schema[FIELD.av] || this.avGlobal;
        const avDelayField = schema[FIELD.avDelay] || this.avDelayGlobal;

        if (avField && avDelayField) {
          this.debValidateField(avDelayField)(schema);
        } else this.validateField(schema);

        return;
      } // for submit


      const valStatus = {};
      Object.values(this.fieldsSchemaMap).forEach(s => {
        const err = this.validateField(s);
        valStatus[s.model] = !err ? true : !this.fieldRequired(s);
      });
      const submitFail = Object.keys(valStatus).find(k => !valStatus[k]);
      return {
        valStatus,
        submitFail
      };
    },

    showRow(schema) {
      return this.hasFieldsToRender(schema) || this.showCol(schema);
    },

    hasFieldsToRender(schema) {
      return UTILS.isArr(schema) && schema.length && schema.some(s => !this.fieldHidden(s));
    },

    showCol(schema) {
      return this.componentToRender(schema) && !this.fieldHidden(schema);
    },

    vModelValid(init = false) {
      var _this$value, _this$value2;

      const parentValid = this.value && UTILS.isObjNotArr(this.value);
      const valValid = UTILS.isObjNotArr((_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value[VMODEL.values]);
      const errValid = UTILS.isObjNotArr((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : _this$value2[VMODEL.errors]);

      if (init) {
        return parentValid && valValid;
      }

      return parentValid && valValid && errValid;
    },

    resetForm() {
      this.submit = false;
    },

    removeAllErrors() {
      Object.keys(this.errors).forEach(model => {
        this.errors[model] = '';
      });
    },

    setError(model, err) {
      const oldErr = this.errors[model];

      if (oldErr === err || UTILS.isObj([oldErr, err]) && JSON.stringify(oldErr) === JSON.stringify(err)) {
        return;
      }

      this.errors[model] = err;
    },

    findComponentData(name) {
      return this.components.find(c => c && c.name === name);
    },

    componentProps(schema) {
      const componentName = this.componentToRender(schema);
      const component = this.findComponentData(componentName);
      const errorPropName = (schema === null || schema === void 0 ? void 0 : schema.errorProp) || (component === null || component === void 0 ? void 0 : component.errorProp) || 'errorMessages';
      return { ...schema.props,
        [errorPropName]: this.errors[schema.model],
        ref: schema.model,
        type: schema.type || FIELD.type.text,
        disabled: this.fieldDisabled(schema),
        required: this.fieldRequired(schema)
      };
    },

    typeCoercion(schema) {
      if (!Number.isNaN(Number(this.fields[schema.model]))) {
        return;
      }

      if ((schema === null || schema === void 0 ? void 0 : schema.type) === FIELD.type.number && this.fields[schema.model]) {
        this.fields[schema.model] = Number(this.fields[schema.model]);
      }
    },

    componentEvents(schema) {
      return UTILS.isObj(schema === null || schema === void 0 ? void 0 : schema[FIELD.events]) ? schema[FIELD.events] : {};
    },

    componentToRender(schema) {
      const fieldType = schema.type || FIELD.type.text;

      if ((schema === null || schema === void 0 ? void 0 : schema[FIELD.component]) && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }

      const component = this.components.find(({
        type
      }) => type.includes(fieldType));
      const componentName = component === null || component === void 0 ? void 0 : component.name;

      if (!componentName) {
        console.error(`Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`);
      }

      return componentName;
    },

    findSchema(m) {
      return this.fieldsSchemaMap[m];
    },

    fieldDisabled(schema) {
      const DISABLED = true;
      const hasDisabledProp = UTILS.isObj(schema === null || schema === void 0 ? void 0 : schema.props) && FIELD.props.disabled in schema.props;
      const fieldDisabled = hasDisabledProp ? UTILS.handleFuncOrBool(schema.props[FIELD.props.disabled]) : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },

    fieldRequired(schema) {
      const REQUIRED = true;
      const hasRequiredProp = schema && schema.props && FIELD.props.required in schema.props;
      const fieldRequired = hasRequiredProp ? UTILS.handleFuncOrBool(schema.props[FIELD.props.required]) : !REQUIRED;
      return schema && !this.fieldDisabled(schema) && !this.fieldHidden(schema) ? fieldRequired : !REQUIRED;
    },

    rmUnwantedModels() {
      const um = Object.keys(this.fields).filter(m => !this.fieldsSchemaFlat.find(({
        model
      }) => m === model));
      um.forEach(model => {
        delete this.fields[model];
        delete this.errors[model];
      });
    },

    fieldHidden(schema) {
      const HIDDEN = true;
      const fieldHidden = FIELD.hide in schema ? UTILS.handleFuncOrBool(schema[FIELD.hide]) : !HIDDEN;
      return fieldHidden;
    },

    validateField(schema) {
      const NO_ERROR = '';
      const fieldRequired = this.fieldRequired(schema);
      const validator = schema === null || schema === void 0 ? void 0 : schema.validator;
      const avField = (schema === null || schema === void 0 ? void 0 : schema[FIELD.av]) || this.avGlobal;
      const error = this.submit || avField ? UTILS.handleFunc(validator) : NO_ERROR;
      const valid = !error ? !NO_ERROR : Boolean(error);
      console.log(schema.model, error);

      if (!fieldRequired) {
        if (!this.submit) this.setError(schema.model, error);
      } else this.setError(schema.model, error); // !fieldRequired
      //   ? !this.submit && this.setError(schema.model, error)
      //   : this.setError(schema.model, error);


      if (this.logs) {
        console.log({
          model: schema.model,
          value: this.fields[schema.model],
          type: typeof this.fields[schema.model],
          valid,
          required: fieldRequired,
          error
        });
      }

      return valid;
    },

    async handleSubmit() {
      this.submit = true;
      this.rmUnwantedModels();
      const {
        valStatus,
        submitFail
      } = this.validate();

      if (this.logs) {
        console.log('form validations:', valStatus);
      }

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
  }, [_vm._l(_vm.fieldsSchema, function (schema, i) {
    return [_vm.showRow(schema) ? _vm._t(_vm.SLOT.beforeRow, null, {
      "model": _vm.slotProps(schema)
    }) : _vm._e(), _vm._v(" "), _vm.showRow(schema) ? _c('div', {
      key: i,
      class: [_vm.CLASS.row, _vm.classes.row]
    }, [!_vm.UTILS.isArr(schema) ? [_vm.showCol(schema) ? _vm._t(_vm.SLOT.beforeCol, null, {
      "model": _vm.slotProps(schema)
    }) : _vm._e(), _vm._v(" "), _vm.showCol(schema) ? _c('div', {
      key: schema.model,
      class: [_vm.CLASS.col, schema.model, _vm.classes.col]
    }, [_vm._t(_vm.SLOT.beforeComponent(schema.model)), _vm._v(" "), _c(_vm.componentToRender(schema), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[schema.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, schema.model, $$v);
        },
        expression: "fields[schema.model]"
      }
    }, 'component', _vm.componentProps(schema), false), _vm.componentEvents(schema)), [_vm._t(schema.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(schema.model))], 2) : _vm._e(), _vm._v(" "), _vm.showCol(schema) ? _vm._t(_vm.SLOT.afterCol, null, {
      "model": _vm.slotProps(schema)
    }) : _vm._e()] : [_vm._l(schema, function (s) {
      return [_vm.showCol(s) ? _vm._t(_vm.SLOT.beforeCol, null, {
        "model": _vm.slotProps(s)
      }) : _vm._e(), _vm._v(" "), _vm.showCol(s) ? _c('div', {
        key: s.model,
        class: [_vm.CLASS.col, s.model, _vm.classes.col]
      }, [_vm._t(_vm.SLOT.beforeComponent(s.model)), _vm._v(" "), _c(_vm.componentToRender(s), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[s.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, s.model, $$v);
          },
          expression: "fields[s.model]"
        }
      }, 'component', _vm.componentProps(s), false), _vm.componentEvents(s)), [_vm._t(s.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(s.model))], 2) : _vm._e(), _vm._v(" "), _vm.showCol(s) ? _vm._t(_vm.SLOT.afterCol, null, {
        "model": _vm.slotProps(s)
      }) : _vm._e()];
    })]], 2) : _vm._e(), _vm._v(" "), _vm.showRow(schema) ? _vm._t(_vm.SLOT.afterRow, null, {
      "model": _vm.slotProps(schema)
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
