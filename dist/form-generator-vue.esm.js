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

  handlefuncOrBool(val, funcParams) {
    let res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
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

//
const HELPER_COMPONENT = "_helper";
var script = {
  mixins: [props],

  data() {
    const INIT = true;
    let fields = {};
    let errors = {};

    const addFieldsAndErrors = model => {
      fields[model] = this.vModelValid(INIT) && 'values' in this.value ? this.value.values[model] : '';
      errors[model] = this.vModelValid(INIT) && 'errors' in this.value ? this.value.errors[model] : '';
    };

    if ("fields" in this.schema && UTILS.isArr(this.schema.fields) && this.schema.fields.length) {
      for (const config of this.schema.fields) {
        if (UTILS.isArr(config)) {
          for (const subConfig of config) {
            addFieldsAndErrors(subConfig.model);
          }
        } else {
          addFieldsAndErrors(config.model);
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
    UTILS: () => UTILS,

    activeValidation() {
      return "activeValidation" in this.schema ? this.schema.activeValidation : false;
    },

    activeValidationDelay() {
      const hasActiveValidationDelay = "activeValidationDelay" in this.schema && this.schema.activeValidationDelay && !isNaN(this.schema.activeValidationDelay);
      return this.activeValidation && hasActiveValidationDelay ? this.schema.activeValidationDelay : false;
    },

    logs() {
      return "logs" in this.schema ? this.schema.logs : false;
    },

    fieldsConfig() {
      return "fields" in this.schema && this.schema.fields.length ? this.schema.fields : [];
    },

    fieldsConfigFlat() {
      let flatConfig = [];

      for (const config of this.fieldsConfig) {
        if (UTILS.isArr(config)) {
          for (const subConfig of config) {
            flatConfig.push(subConfig);
          }
        } else {
          flatConfig.push(config);
        }
      }

      return flatConfig;
    },

    debounceValidateField() {
      return this.debounce(fieldName => {
        this.validateField(fieldName);
      }, this.activeValidationDelay);
    }

  },
  watch: {
    editable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      }
    },
    value: {
      handler: function () {
        if (this.vModelValid()) {
          for (const fieldName in this.value["values"]) {
            this.fields[fieldName] = this.value["values"][fieldName];
            this.errors[fieldName] = this.value["errors"][fieldName];
          }
        }
      },
      deep: true
    },
    fields: {
      handler: function () {
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

  created() {
    this.$emit("setFormContext", this);

    for (const fieldName in this.fields) {
      this.$watch(`fields.${fieldName}`, function (newVal, oldVal) {
        // for number type field.
        this.convertToNumber(fieldName); // for helper components

        this.updateHelpers(fieldName, newVal); // to prevent below calls when only type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }

        this.activeValidationDelay ? this.debounceValidateField(fieldName) : this.validateField(fieldName);
      });
    }
  },

  methods: {
    vModelValid(init = false) {
      const parentValid = this.value && UTILS.isObjNotArr(this.value);

      if (init) {
        return parentValid && 'values' in this.value;
      }

      const hasChildren = parentValid && UTILS.hasProperty(['values', 'errors'], this.value);
      return hasChildren && UTILS.isObjNotArr([this.value.values, this.value.errors]);
    },

    removeUnwantedFields() {
      const uf = Object.keys(this.fields).filter(fieldName => !this.fieldsConfigFlat.find(({
        model
      }) => model === fieldName));
      uf.forEach(fieldName => {
        delete this.fields[fieldName];
        delete this.errors[fieldName];
      });
    },

    debounce: (func, wait) => {
      let timeOut;
      return function executedFunction(param) {
        clearTimeout(timeOut);
        timeOut = setTimeout(function () {
          clearTimeout(timeOut);
          func(param);
        }, wait);
      };
    },

    resetFormState() {
      this.submit = false;
    },

    removeAllErrors() {
      for (const fieldName in this.errors) {
        this.errors[fieldName] = "";
      }
    },

    setError(field, msg) {
      this.errors[field] = msg;
    },

    isHelperComponent(fieldName) {
      return fieldName.includes(HELPER_COMPONENT);
    },

    updateHelpers(fieldName, newVal) {
      const VAL = newVal; // for helper field

      if (this.isHelperComponent(fieldName)) {
        const [fieldBeingHelped] = fieldName.split(HELPER_COMPONENT);
        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
        return;
      } // for field being helped


      if (`${fieldName}${HELPER_COMPONENT}` in this.fields) {
        const helperField = `${fieldName}${HELPER_COMPONENT}`;
        this.fields[helperField] = VAL;
      }
    },

    setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] = fieldConfig.model in this.value.values ? this.value.values[fieldConfig.model] : '';
    },

    fieldIsVisible(fieldConfig) {
      const VISIBLE = true;
      const fieldVisible = "show" in fieldConfig ? UTILS.handlefuncOrBool(fieldConfig.show, this) : VISIBLE;
      !fieldVisible && this.setDefaultFieldValue(fieldConfig);
      return fieldVisible;
    },

    componentProps(fieldConfig) {
      const componentName = this.componentToRender(fieldConfig);
      const component = this.formComponents.find(c => c.compData && c.compData.name === componentName);
      const errorPropName = fieldConfig.errorProp || component.compData.errorProp || 'error';
      return { ...fieldConfig.props,
        [errorPropName]: this.errors[fieldConfig.model],
        ref: fieldConfig.model,
        key: fieldConfig.model,
        type: fieldConfig.type || 'text',
        disabled: this.fieldIsDisabled(fieldConfig),
        required: this.fieldIsRequired(null, fieldConfig)
      };
    },

    findFieldConfig(fieldName) {
      return this.fieldsConfigFlat.find(conf => conf.model === fieldName);
    },

    convertToNumber(fieldName) {
      const fieldConfig = this.findFieldConfig(fieldName);
      fieldConfig && fieldConfig.type === "number" && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },

    componentEvents(fieldConfig) {
      return 'triggers' in fieldConfig && UTILS.isFunc(fieldConfig.triggers) ? fieldConfig.triggers(this) : {};
    },

    componentToRender(fieldConfig) {
      const fieldType = fieldConfig.type || 'text';

      if ('component' in fieldConfig && fieldConfig.component && UTILS.isStr(fieldConfig.component)) {
        return fieldConfig.component;
      }

      const component = this.formComponents.find(({
        type
      }) => type.includes(fieldType));
      const componentName = component && component.compData ? component.compData.name : '';
      !componentName && console.error(`Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`);
      return componentName;
    },

    fieldIsDisabled(fieldConfig) {
      const DISABLED = true;
      const hasDisabledProp = fieldConfig && fieldConfig.props && "disabled" in fieldConfig.props;
      const fieldDisabled = hasDisabledProp ? UTILS.handlefuncOrBool(fieldConfig.props.disabled, this) : !DISABLED;
      return !this.editable || fieldDisabled ? DISABLED : !DISABLED;
    },

    fieldIsRequired(name, config) {
      const REQUIRED = true;
      const fieldName = name || config.model;
      const fieldConfig = config || this.findFieldConfig(fieldName);
      const hasRequiredProp = fieldConfig && fieldConfig.props && 'required' in fieldConfig.props;
      const fieldRequired = hasRequiredProp ? UTILS.handlefuncOrBool(fieldConfig.props.required, this) : !this.isHelperComponent(fieldName);
      return fieldConfig && !this.fieldIsDisabled(fieldConfig) && this.fieldIsVisible(fieldConfig) ? fieldRequired : !REQUIRED;
    },

    validateField(fieldName) {
      const SUCCESS = [true, ""];
      const fieldConfig = this.findFieldConfig(fieldName);
      const fieldRequired = this.fieldIsRequired(null, fieldConfig);
      const fieldRule = fieldConfig.rules || {};
      const fieldActiveValidation = 'activeValidation' in fieldConfig ? Boolean(fieldConfig.activeValidation) : this.activeValidation;
      const [valid, error] = this.submit || fieldActiveValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], fieldRule, this.validationRules, { ...this.fields
      }, this.submit) : SUCCESS;
      !fieldRequired ? !this.submit && this.setError(fieldName, error) : this.setError(fieldName, error);
      this.logs && console.log(`model:${fieldName}\n`, `value:${this.fields[fieldName]}\n`, `type:${typeof this.fields[fieldName]}\n`, `valid:${valid}\n`, `required:${fieldRequired}\n`, `error:${error}`);
      return valid;
    },

    async handleSubmit() {
      this.submit = true;
      const formValidationStatus = {};
      this.removeUnwantedFields();
      Object.keys(this.fields).forEach(fieldName => {
        formValidationStatus[fieldName] = this.validateField(fieldName) || !this.fieldIsRequired(fieldName);
      });
      const submitFail = Object.keys(formValidationStatus).find(fieldName => !formValidationStatus[fieldName]);

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
    staticClass: "generated-form",
    on: {
      "submit": function ($event) {
        $event.preventDefault();
        return _vm.handleSubmit($event);
      }
    }
  }, [_c('div', {
    staticClass: "generated-form__header"
  }, [_vm._t("header")], 2), _vm._v(" "), _vm.editable ? _c('div', {
    staticClass: "generated-form__body"
  }, [_vm._t("body-start"), _vm._v(" "), _vm._l(_vm.fieldsConfig, function (fieldConfig, i) {
    return [_vm._t("sectionLabel", null, {
      "fieldConfig": fieldConfig,
      "fieldsConfigFlat": _vm.fieldsConfigFlat
    }), _vm._v(" "), _vm.UTILS.isArr(fieldConfig) || _vm.fieldIsVisible(fieldConfig) && _vm.componentToRender(fieldConfig) ? _c('div', {
      key: i,
      class: ['generated-form__body__row', _vm.classes.row]
    }, [_vm.UTILS.isArr(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_c('div', {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: _vm.fieldIsVisible(subFieldConfig) && _vm.componentToRender(subFieldConfig),
          expression: "\n                fieldIsVisible(subFieldConfig) &&\n                componentToRender(subFieldConfig)\n              "
        }],
        key: subFieldConfig.model,
        class: ['generated-form__body__row__col', "col-" + subFieldConfig.model, _vm.classes.col]
      }, [[_vm._t(subFieldConfig.model + "_before"), _vm._v(" "), _c(_vm.componentToRender(subFieldConfig), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subFieldConfig.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subFieldConfig.model, $$v);
          },
          expression: "fields[subFieldConfig.model]"
        }
      }, 'component', _vm.componentProps(subFieldConfig), false), _vm.componentEvents(subFieldConfig)), [_vm._t("" + subFieldConfig.model)], 2), _vm._v(" "), _vm._t(subFieldConfig.model + "_after")]], 2)];
    })] : [_c('div', {
      key: fieldConfig.model,
      class: ['generated-form__body__row__col', "col-" + fieldConfig.model, _vm.classes.col]
    }, [[_vm._t(fieldConfig.model + "_before"), _vm._v(" "), _c(_vm.componentToRender(fieldConfig), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[fieldConfig.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, fieldConfig.model, $$v);
        },
        expression: "fields[fieldConfig.model]"
      }
    }, 'component', _vm.componentProps(fieldConfig), false), _vm.componentEvents(fieldConfig)), [_vm._t("" + fieldConfig.model)], 2), _vm._v(" "), _vm._t(fieldConfig.model + "_after")]], 2)]], 2) : _vm._e()];
  }), _vm._v(" "), _vm._t("body-end")], 2) : _vm._e(), _vm._v(" "), !_vm.editable ? _vm._t("uneditable", null, {
    "fieldsConfigFlat": _vm.fieldsConfigFlat
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "generated-form__footer"
  }, [_vm._t("footer")], 2)], 2);
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
