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
    validationRules: {
      type: Object,
      required: false,
      default: () => ({})
    },
    formComponents: {
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
    }
  }
};

const UTILS = {
  isUndef(val) {
    return typeof val === "undefined";
  },

  isObjNotArr(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val) && !UTILS.isArr(val);
    }

    return val.every(v => UTILS.isObj(v) && !UTILS.isArr(v));
  },

  isObj(val) {
    return typeof val === 'object';
  },

  isArr(val) {
    return Array.isArray(val);
  },

  isFunc(val) {
    return typeof val === "function";
  },

  isBool(val) {
    return typeof val === "boolean";
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

  handlefuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  },

  debounce(func, wait) {
    let timeOut;
    return function executedFunction(param) {
      clearTimeout(timeOut);
      timeOut = setTimeout(function () {
        clearTimeout(timeOut);
        func(param);
      }, wait);
    };
  }

};

const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';
const SUCCESS = [true, FIELD_IS_VALID]; // VALIDATION ENGINE 

function VALIDATION_ENGINE (fieldName, fieldValue, fieldRule, validationRules, allFields, submit) {
  let error = checkEmpty(fieldValue);
  const emptyErr = 'emptyErr' in fieldRule ? fieldRule.emptyErr : 'Required';
  const filterData = validationRules.FILTER;
  const fieldValidator = fieldRule.validator || validationRules[fieldName];

  if (error !== FIELD_IS_EMPTY) {
    if (!UTILS.isFunc(filterData)) {
      !UTILS.isUndef(filterData) && console.error(`filter ${filterData} is not a function.`);
    } else {
      error = filterData(fieldValue, fieldRule, allFields);

      if (error !== FIELD_IS_VALID) {
        return result(error);
      }
    }

    if (!UTILS.isFunc(fieldValidator)) {
      !UTILS.isUndef(fieldValidator) && console.error(`validator ${fieldValidator} is not a function.`);
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
  const fail = [false, error];
  return error !== FIELD_IS_VALID ? fail : SUCCESS;
}

const CLASS = {
  form: 'fgv-form',
  header: `fgv-form__header`,
  body: `fgv-form__body`,
  footer: `fgv-form__footer`,
  row: `fgv-form__body__row`,
  col: `fgv-form__body__row__col`
};
const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `${v}_before`,
  afterComponent: v => `${v}_after`
};
const SCHEMA = {
  fields: 'fields',
  activeValidation: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
};
const VMODEL = {
  values: 'values',
  errors: 'errors'
};
const FIELD = {
  activeValidation: SCHEMA.activeValidation,
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
};

//
var script = {
  mixins: [props],

  data() {
    const INIT = true;
    let fields = {};
    let errors = {};

    const addFieldsAndErrors = model => {
      // on init if v-model has values then validate and apply those values.
      fields[model] = this.vModelValid(INIT) && VMODEL.values in this.value && this.value[VMODEL.values][model] || '';
      errors[model] = this.vModelValid(INIT) && VMODEL.errors in this.value && this.value[VMODEL.errors][model] || '';
    };

    if (SCHEMA.fields in this.schema && UTILS.isArr(this.schema.fields) && this.schema.fields.length) {
      for (const schema of this.schema.fields) {
        if (UTILS.isArr(schema)) {
          for (const s of schema) {
            addFieldsAndErrors(s.model);
          }
        } else {
          addFieldsAndErrors(schema.model);
        }
      }
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

    activeValidation() {
      return SCHEMA.activeValidation in this.schema ? this.schema[SCHEMA.activeValidation] : false;
    },

    activeValidationDelay() {
      const hasActiveValidationDelay = SCHEMA.activeValidationDelay in this.schema && this.schema[SCHEMA.activeValidationDelay] && !isNaN(this.schema[SCHEMA.activeValidationDelay]);
      return this.activeValidation && hasActiveValidationDelay ? this.schema[SCHEMA.activeValidationDelay] : false;
    },

    logs() {
      return SCHEMA.logs in this.schema ? this.schema[SCHEMA.logs] : false;
    },

    fieldsSchema() {
      return SCHEMA.fields in this.schema && UTILS.isArr(this.schema[SCHEMA.fields]) ? this.schema[SCHEMA.fields] : [];
    },

    fieldsSchemaFlat() {
      let flatSchema = [];

      for (const schema of this.fieldsSchema) {
        if (UTILS.isArr(schema)) {
          for (const s of schema) {
            flatSchema.push(s);
          }
        } else {
          flatSchema.push(schema);
        }
      }

      return flatSchema;
    },

    deValidateField() {
      return UTILS.debounce(model => {
        this.validateField(model);
      }, this.activeValidationDelay);
    }

  },
  watch: {
    disabled: {
      handler: function (newVal) {
        newVal && this.removeAllErrors();
      }
    },
    value: {
      handler: function () {
        if (this.vModelValid()) {
          for (const model in this.value[VMODEL.values]) {
            this.fields[model] = this.value[VMODEL.values][model];
            this.errors[model] = this.value[VMODEL.errors][model];
          }
        }
      },
      deep: true
    },
    fields: {
      handler: function () {
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

  created() {
    for (const model in this.fields) {
      this.$watch(`fields.${model}`, function (newVal, oldVal) {
        // for number type field.
        this.typeCoercion(model); // this.updateHelpers(model, newVal);
        // to prevent below calls when only type is changed and not value.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }

        this.activeValidationDelay ? this.deValidateField(model) : this.validateField(model);
      }, {
        deep: true
      });
    }
  },

  methods: {
    hasFields(schema) {
      return UTILS.isArr(schema) && schema.length;
    },

    isfield(schema) {
      return !this.fieldHidden(schema) && this.componentToRender(schema);
    },

    vModelValid(init = false) {
      const parentValid = this.value && UTILS.isObjNotArr(this.value);
      const valValid = VMODEL.values in this.value && UTILS.isObjNotArr(this.value[VMODEL.values]);
      const errValid = VMODEL.errors in this.value && UTILS.isObjNotArr(this.value[VMODEL.errors]);

      if (init) {
        return parentValid && valValid;
      }

      return parentValid && valValid && errValid;
    },

    resetFormState() {
      this.submit = false;
    },

    removeAllErrors() {
      for (const model in this.errors) {
        this.errors[model] = "";
      }
    },

    setError(model, msg) {
      this.errors[model] = msg;
    },

    findComponentData(name) {
      return this.formComponents.find(c => c.compData && c.compData.name === name);
    },

    componentProps(schema) {
      const componentName = this.componentToRender(schema);
      const component = this.findComponentData(componentName);
      const errorPropName = schema.errorProp || component && component.compData.errorProp || 'error';
      return { ...schema.props,
        [errorPropName]: this.errors[schema.model],
        ref: schema.model,
        type: schema.type || FIELD.type.text,
        disabled: this.fieldDisabled(schema),
        required: this.fieldRequired(null, schema)
      };
    },

    typeCoercion(model) {
      if (!isNaN(this.fields[model])) {
        return;
      }

      const schema = this.findSchema(model);
      schema && schema.type === FIELD.type.number && this.fields[model] && (this.fields[model] = Number(this.fields[model]));
    },

    componentEvents(schema) {
      return FIELD.events in schema && UTILS.isFunc(schema[FIELD.events]) ? schema[FIELD.events](this) : {};
    },

    componentToRender(schema) {
      const fieldType = schema.type || FIELD.type.text;

      if (FIELD.component in schema && schema[FIELD.component] && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }

      const component = this.formComponents.find(({
        type
      }) => type.includes(fieldType));
      const componentName = component && component.compData ? component.compData.name : '';
      !componentName && console.error(`Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`);
      return componentName;
    },

    findSchema(m) {
      return this.fieldsSchemaFlat.find(({
        model
      }) => m === model);
    },

    fieldDisabled(schema) {
      const DISABLED = true;
      const hasDisabledProp = schema && schema.props && FIELD.props.disabled in schema.props;
      const fieldDisabled = hasDisabledProp ? UTILS.handlefuncOrBool(schema.props[FIELD.props.disabled]) : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },

    fieldRequired(m, s = null) {
      const REQUIRED = true;
      const model = m || s.model;
      const schema = s || this.findSchema(model);
      const hasRequiredProp = schema && schema.props && FIELD.props.required in schema.props;
      const fieldRequired = hasRequiredProp ? UTILS.handlefuncOrBool(schema.props[FIELD.props.required]) : REQUIRED; // : !this.isHelperComponent(model);

      return schema && !this.fieldDisabled(schema) && !this.fieldHidden(schema) ? fieldRequired : !REQUIRED;
    },

    rmUnwantedModels() {
      const uf = Object.keys(this.fields).filter(m => !this.fieldsSchemaFlat.find(({
        model
      }) => m === model));
      uf.forEach(model => {
        delete this.fields[model];
        delete this.errors[model];
      });
    },

    fieldHidden(schema) {
      const HIDDEN = true;
      const fieldHidden = FIELD.hide in schema ? UTILS.handlefuncOrBool(schema[FIELD.hide]) : !HIDDEN; // !fieldVisible && this.setDefaultFieldValue(schema);

      return fieldHidden;
    },

    validateField(model) {
      const SUCCESS = [true, ""];
      const schema = this.findSchema(model);
      const fieldRequired = this.fieldRequired(null, schema);
      const fieldRule = schema.rules || {};
      const fieldActiveValidation = FIELD.activeValidation in schema ? Boolean(schema[FIELD.activeValidation]) : this.activeValidation;
      const [valid, error] = this.submit || fieldActiveValidation ? VALIDATION_ENGINE(model, this.fields[model], fieldRule, this.validationRules, { ...this.fields
      }, this.submit) : SUCCESS;
      !fieldRequired ? !this.submit && this.setError(model, error) : this.setError(model, error);
      this.logs && console.log({
        model,
        value: this.fields[model],
        type: typeof this.fields[model],
        valid,
        required: fieldRequired,
        error
      });
      return valid;
    },

    async handleSubmit() {
      this.submit = true;
      const formValidationStatus = {};
      this.rmUnwantedModels();
      Object.keys(this.fields).forEach(model => {
        formValidationStatus[model] = this.validateField(model) || !this.fieldRequired(model);
      });
      const submitFail = Object.keys(formValidationStatus).find(model => !formValidationStatus[model]);

      if (this.logs) {
        console.log("form data:", this.fields);
        console.log("form validations:", formValidationStatus);
      }

      if (submitFail) {
        this.resetFormState();
        this.onSubmitFail(this.fields);
        return;
      }

      await this.onSubmit(this.fields);
      this.resetFormState();
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
    return [_vm.hasFields(schema) || _vm.isfield(schema) ? _c('div', {
      key: i,
      class: [_vm.CLASS.row, _vm.classes.row]
    }, [_vm.UTILS.isArr(schema) ? [_vm._l(schema, function (s) {
      return [_c('div', {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: _vm.isfield(s),
          expression: "isfield(s)"
        }],
        key: s.model,
        class: [_vm.CLASS.col, s.model, _vm.classes.col]
      }, [[_vm._t(_vm.SLOT.beforeComponent(s.model)), _vm._v(" "), _c(_vm.componentToRender(s), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[s.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, s.model, $$v);
          },
          expression: "fields[s.model]"
        }
      }, 'component', _vm.componentProps(s), false), _vm.componentEvents(s)), [_vm._t(s.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(s.model))]], 2)];
    })] : [_c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.isfield(schema),
        expression: "isfield(schema)"
      }],
      key: schema.model,
      class: [_vm.CLASS.col, schema.model, _vm.classes.col]
    }, [[_vm._t(_vm.SLOT.beforeComponent(schema.model)), _vm._v(" "), _c(_vm.componentToRender(schema), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[schema.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, schema.model, $$v);
        },
        expression: "fields[schema.model]"
      }
    }, 'component', _vm.componentProps(schema), false), _vm.componentEvents(schema)), [_vm._t(schema.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(schema.model))]], 2)]], 2) : _vm._e()];
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
