// helpers -------------------------------------------
const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';

function fieldIsEmpty(value) {
  return String(value).trim() === '' || ![false, 0].includes(value) && !value ? FIELD_IS_EMPTY : FIELD_IS_VALID;
}

function throwError(msg) {
  throw new Error(msg);
} //  -------------------------------------------
// VALIDATION ENGINE ------------------------------------------------------------


const VALIDATION_ENGINE = (fieldName, value, fieldRules, MASTER_RULES, fields, formSubmit) => {
  let msg = fieldIsEmpty(value);
  const COMMON_VALIDATORS = MASTER_RULES.COMMON_VALIDATORS;
  const HAS_COMMON_RULES = !COMMON_VALIDATORS || !Object.keys(COMMON_VALIDATORS).length ? false : true;
  const VALIDATION_FUNCTION = MASTER_RULES[fieldName] || MASTER_RULES[fieldRules.type] || undefined;

  if (msg !== FIELD_IS_EMPTY) {
    //RUN COMMON VALIDATIONS ---------------------------------------------
    if (HAS_COMMON_RULES) {
      for (const validator in COMMON_VALIDATORS) {
        typeof COMMON_VALIDATORS[validator] !== 'function' && throwError(`${validator} is not a function.`);
        msg = COMMON_VALIDATORS[validator](value, fieldRules, fields);
        typeof msg === 'undefined' && throwError(`${validator} must return a string, empty incase of success and error message if field is invalid.`);
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
  const PASS = [true, ''];
  const FAIL = [false, msg];
  return msg !== FIELD_IS_VALID ? FAIL : PASS;
}

//
var script = {
  props: {
    submitHandler: {
      type: Function,
      required: false,
      default: function () {
        alert("submit handler not present");
      }
    },
    formRules: {
      type: Object,
      required: false,
      default: () => ({})
    },
    formComponents: {
      type: Array,
      required: false,
      default: () => []
    },
    formEditable: {
      type: Boolean,
      required: false,
      default: true
    },
    validationConfig: {
      type: Object,
      required: false,
      default: () => ({})
    },
    formConfig: {
      type: Object,
      default: () => ({})
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data() {
    let fields = {};
    let errors = {};

    function addFieldsAndErrors(fieldConfig) {
      fields = { ...fields,
        [fieldConfig.model]: "value" in fieldConfig ? fieldConfig.value : ""
      };
      errors = { ...errors,
        [fieldConfig.model]: ""
      };
    }

    if ("fields" in this.formConfig) {
      for (const config of this.formConfig.fields) {
        if (this.isArr(config)) {
          for (const subConfig of config) {
            addFieldsAndErrors(subConfig);
          }
        } else {
          addFieldsAndErrors(config);
        }
      }
    }

    return {
      fields,
      errors,
      loading: false,
      submit: false
    };
  },

  computed: {
    helperComponent: () => "_formHelper",

    activeValidation() {
      return "activeValidation" in this.formConfig ? this.formConfig.activeValidation : false;
    },

    logs() {
      return "logs" in this.formConfig ? this.formConfig.logs : false;
    },

    fieldsConfig() {
      return "fields" in this.formConfig && this.formConfig.fields.length ? this.formConfig.fields : [];
    },

    fieldsConfig_FLAT() {
      let flatConfig = [];

      for (const config of this.fieldsConfig) {
        if (this.isArr(config)) {
          flatConfig = [...flatConfig, ...config];
        } else {
          flatConfig = [...flatConfig, config];
        }
      }

      return flatConfig;
    }

  },
  watch: {
    formEditable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      }
    }
  },

  created() {
    this.$emit("setFormContext", this);

    for (const fieldName in this.fields) {
      this.$watch(`fields.${fieldName}`, function (newVal, oldVal) {
        // for number type field. cannot add multiple directives dynamically
        this.convertToNumber(fieldName); // for helper components

        this.updateHelpers(fieldName, newVal); // prevent below function calls when only type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }

        this.validateField(fieldName);
      });
    }
  },

  methods: {
    resetFormState() {
      this.submit = false;
      this.loading = false;
    },

    removeAllErrors() {
      for (const msg in this.errors) {
        this.errors[msg] = "";
      }
    },

    showErrors(field, msg) {
      this.errors[field] = msg;
    },

    isHelperComponent(fieldName) {
      return fieldName.includes(this.helperComponent);
    },

    updateHelpers(fieldName, newVal) {
      const VAL = newVal; // helper

      if (this.isHelperComponent(fieldName)) {
        const fieldBeingHelped = fieldName.split(this.helperComponent)[0];
        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
        return;
      } // being helped


      if (`${fieldName}${this.helperComponent}` in this.fields) {
        const helperField = `${fieldName}${this.helperComponent}`;
        this.fields[helperField] = VAL;
      }
    },

    setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] = "value" in fieldConfig ? fieldConfig.value : "";
    },

    fieldVisible(fieldConfig) {
      const SHOW = "show" in fieldConfig ? typeof fieldConfig.show === "function" ? fieldConfig.show(this) : Boolean(fieldConfig.show) : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },

    bindProps(fieldConfig) {
      const componentName = this.computedComponent(fieldConfig);
      const componentData = this.formComponents.find(({
        component
      }) => component.name === componentName);
      const {
        component: {
          errorProp
        }
      } = fieldConfig.errorProp ? {
        component: {
          errorProp: fieldConfig.errorProp
        }
      } : componentData || {
        component: {
          errorProp: "errorMessage"
        }
      };
      return { ...fieldConfig.props,
        [errorProp]: this.errors[fieldConfig.model],
        disabled: this.fieldDisabled(fieldConfig)
      };
    },

    findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find(conf => conf.model === fieldName);
    },

    convertToNumber(fieldName) {
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG && FIELD_CONFIG.type === "number" && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },

    bindEvents(fieldConfig) {
      return "triggers" in fieldConfig && this.isFunc(fieldConfig.triggers) ? fieldConfig.triggers(this) : {};
    },

    computedComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || "text";

      if ("component" in fieldConfig) {
        return fieldConfig.component;
      }

      const {
        component: {
          name
        }
      } = this.formComponents.find(({
        type
      }) => type.includes(FIELD_TYPE)) || {
        component: {
          name: ""
        }
      };
      !name && this.throwError(`Component cannot be rendered. Component for type "${FIELD_TYPE}" is not found in form-components.`);
      return name;
    },

    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const DISABLED_PROP = fieldConfig.props && "disabled" in fieldConfig.props ? this.isFunc(fieldConfig.props.disabled) ? fieldConfig.props.disabled(this) : Boolean(fieldConfig.props.disabled) : false;
      return !this.formEditable || DISABLED_PROP ? DISABLED : !DISABLED;
    },

    fieldRequired(fieldName) {
      const REQUIRED = true;
      const NOT_REQUIRED = false;
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const config_required = this.isFunc(FIELD_CONFIG.required) ? FIELD_CONFIG.required(this) : Boolean(FIELD_CONFIG.required);
      return FIELD_CONFIG && !this.fieldDisabled(FIELD_CONFIG) && this.fieldVisible(FIELD_CONFIG) ? !this.isHelperComponent(fieldName) ? "required" in FIELD_CONFIG ? config_required : REQUIRED : "required" in FIELD_CONFIG ? config_required : NOT_REQUIRED : NOT_REQUIRED;
    },

    validateField(fieldName) {
      const REQUIRED = this.fieldRequired(fieldName);
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const FIELD_IS_VALID = [true, ""];
      const config_rules = FIELD_CONFIG.rules || {}; // const [fieldValid, fieldErrorMsg] = REQUIRED
      //   ? this.submit || this.activeValidation
      //     ? VALIDATION_ENGINE(
      //         fieldName,
      //         this.fields[fieldName],
      //         config_rules,
      //         this.formRules,
      //         { ...this.fields }, //sending immutable copy of fields
      //         this.submit
      //       )
      //     : FIELD_IS_VALID
      //   : FIELD_IS_VALID;

      const [fieldValid, fieldErrorMsg] = this.submit || this.activeValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], config_rules, this.formRules, { ...this.fields
      }, //sending immutable copy of fields
      this.submit) : FIELD_IS_VALID;
      !REQUIRED ? !this.submit && this.showErrors(fieldName, fieldErrorMsg) : this.showErrors(fieldName, fieldErrorMsg);
      this.logs && console.log(`model:${fieldName}\n`, `value:${this.fields[fieldName]}\n`, `type:${typeof this.fields[fieldName]}\n`, `isValid:${fieldValid}\n`, `required:${REQUIRED}\n`, `errorMessage:${fieldErrorMsg}`);
      return fieldValid;
    },

    async submitForm() {
      this.loading = true;
      this.submit = true;
      const INVALID = false;
      let fieldsStatus = [];
      Object.keys(this.fields).forEach(fieldName => {
        fieldsStatus = [...fieldsStatus, [fieldName, this.validateField(fieldName)]];
      });
      const [firstInvalidField] = fieldsStatus.find(([fieldName, status]) => {
        const REQUIRED = this.fieldRequired(fieldName);
        return REQUIRED && status === INVALID;
      }) || [""];
      this.logs && console.log("fields data", this.fields);
      console.log("validations status:", fieldsStatus);

      if (firstInvalidField) {
        // scroll to the component
        this.scrollToComponent(firstInvalidField);
        console.log("Form is not valid.\n");
        this.resetFormState();
        return;
      }

      console.log("Form is valid. calling submit handler.\n");
      await this.submitHandler(this.fields);
      this.resetFormState();
    },

    scrollToComponent(fieldName) {
      const fieldConfig = this.findFieldConfig(fieldName);
      const componentName = this.computedComponent(fieldConfig);
      this.logs && console.log("scroll to:", `${componentName ? fieldName : `${fieldName}(component not found)`}`);

      if (!componentName) {
        return;
      }

      const ref = fieldName;
      const el = this.$refs[ref][0].$el;
      el && el.scrollIntoView({
        behavior: "smooth"
      }) && el.focus();
    },

    isUndef(val) {
      return typeof val === "undefined";
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

    throwError(msg) {
      throw new Error(msg);
    },

    warn(msg) {
      console.warn(msg);
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
        return _vm.submitForm($event);
      }
    }
  }, [_c('div', {
    staticClass: "generated-form__header"
  }, [_vm._t("header")], 2), _vm._v(" "), _vm.formEditable ? _c('div', {
    staticClass: "generated-form__body"
  }, [_vm._l(_vm.fieldsConfig, function (fieldConfig) {
    return [_vm._t("sectionLabel", null, {
      "fieldConfig": fieldConfig,
      "fieldsConfigFlat": _vm.fieldsConfig_FLAT
    }), _vm._v(" "), _c('div', _vm._b({
      key: fieldConfig.model,
      staticClass: "generated-form__body__row"
    }, 'div', {
      class: _vm.classes.row
    }, false), [_vm.isArr(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_c('div', _vm._b({
        directives: [{
          name: "show",
          rawName: "v-show",
          value: _vm.fieldVisible(subFieldConfig) && _vm.computedComponent(subFieldConfig),
          expression: "fieldVisible(subFieldConfig) && computedComponent(subFieldConfig)"
        }],
        key: subFieldConfig.model,
        staticClass: "generated-form__body__row__col",
        class: "col-" + subFieldConfig.model
      }, 'div', {
        class: _vm.classes.col
      }, false), [[_vm._t(subFieldConfig.model + "_before"), _vm._v(" "), _c(_vm.computedComponent(subFieldConfig), _vm._g(_vm._b({
        key: subFieldConfig.model,
        ref: subFieldConfig.model,
        refInFor: true,
        tag: "component",
        attrs: {
          "type": subFieldConfig.type || 'text'
        },
        model: {
          value: _vm.fields[subFieldConfig.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subFieldConfig.model, typeof $$v === 'string' ? $$v.trim() : $$v);
          },
          expression: "fields[subFieldConfig.model]"
        }
      }, 'component', _vm.bindProps(subFieldConfig), false), _vm.bindEvents(subFieldConfig))), _vm._v(" "), _vm._t(subFieldConfig.model + "_after")]], 2)];
    })] : [_c('div', _vm._b({
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.fieldVisible(fieldConfig) && _vm.computedComponent(fieldConfig),
        expression: "fieldVisible(fieldConfig) && computedComponent(fieldConfig)"
      }],
      staticClass: "generated-form__body__row__col",
      class: "col-" + fieldConfig.model
    }, 'div', {
      class: _vm.classes.col
    }, false), [[_vm._t(fieldConfig.model + "_before"), _vm._v(" "), _c(_vm.computedComponent(fieldConfig), _vm._g(_vm._b({
      key: fieldConfig.model,
      ref: fieldConfig.model,
      refInFor: true,
      tag: "component",
      attrs: {
        "type": fieldConfig.type || 'text'
      },
      model: {
        value: _vm.fields[fieldConfig.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, fieldConfig.model, typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "fields[fieldConfig.model]"
      }
    }, 'component', _vm.bindProps(fieldConfig), false), _vm.bindEvents(fieldConfig))), _vm._v(" "), _vm._t(fieldConfig.model + "_after")]], 2)]], 2)];
  })], 2) : _vm._e(), _vm._v(" "), !_vm.formEditable ? _vm._t("disabled", null, {
    "fieldsConfigFlat": _vm.fieldsConfig_FLAT
  }) : _vm._e(), _vm._v(" "), _vm._t("agreement"), _vm._v(" "), _vm._t("actions"), _vm._v(" "), _c('div', {
    staticClass: "generated-form__footer"
  }, [_vm._t("footer")], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = "data-v-6e4ca01d";
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
