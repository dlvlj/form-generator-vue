// helpers -------------------------------------------
const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';

function fieldIsEmpty(value) {
  return String(value).trim() === '' ? FIELD_IS_EMPTY : FIELD_IS_VALID;
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
        msg = COMMON_VALIDATORS[validator](value);
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
        console.log(this.fields);
        alert('submit handler not present');
      }
    },
    formRules: {
      type: Object,
      required: false,
      default: () => ({})
    },
    customComponentsMap: {
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

    function addFieldsAndErrors(field) {
      fields = { ...fields,
        [field.name]: 'value' in field ? field.value : ''
      };
      errors = { ...errors,
        [field.name]: ''
      };
    }

    'fields' in this.formConfig && this.formConfig.fields.forEach(field => {
      if (Array.isArray(field)) {
        field.forEach(subField => {
          addFieldsAndErrors(subField);
        });
      } else {
        addFieldsAndErrors(field);
      }
    });
    return {
      fields,
      errors,
      loading: false,
      submit: false
    };
  },

  computed: {
    formHelper: () => '_formHelper',

    hasCustomComponentsMap() {
      return Boolean(this.customComponentsMap.length);
    },

    activeValidation() {
      return 'activeValidation' in this.formConfig ? this.formConfig.activeValidation : false;
    },

    fieldsConfig() {
      return this.formConfig.fields;
    },

    fieldsConfig_FLAT() {
      let flatConfig = [];
      this.fieldsConfig.forEach(conf => {
        if (Array.isArray(conf)) {
          flatConfig = [...flatConfig, ...conf];
        } else {
          flatConfig = [...flatConfig, conf];
        }
      });
      return flatConfig;
    },

    hasFieldsConfig() {
      return this.fieldsConfig && Boolean(this.fieldsConfig.length);
    },

    defaultFieldComponents: () => []
  },
  watch: {
    formEditable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      }
    }
  },

  created() {
    this.$emit('setFormContext', this);
  },

  mounted() {
    Object.keys(this.fields).forEach(fieldName => {
      this.$watch(`fields.${fieldName}`, function (newVal, oldVal) {
        //  fields value type to number (for fields with type number)
        this.convertToNumber(fieldName); // to prevent any unnecessary function call when only type of field property is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        } // for helpers ---------------------------


        this.fieldHelpers(fieldName, newVal); // validations ------------------------

        this.validateField(fieldName);
      } // { deep: true }
      );
    });
  },

  methods: {
    resetForm() {
      this.submit = false;
      this.loading = false;
    },

    removeAllErrors() {
      Object.keys(this.errors).forEach(msg => {
        this.errors[msg] = '';
      });
    },

    showErrors(field, msg) {
      this.errors[field] = msg;
    },

    fieldIsHelper(fieldName) {
      return fieldName.includes(this.formHelper);
    },

    fieldHelpers(fieldName, newVal) {
      const VAL = newVal; // helping field ------------------

      if (this.fieldIsHelper(fieldName)) {
        const fieldBeingHelped = fieldName.split(this.formHelper)[0];
        fieldBeingHelped in this.fields && (this.fields[fieldBeingHelped] = VAL);
      } // field being helped
      else if (`${fieldName}${this.formHelper}` in this.fields) {
          const helperField = `${fieldName}${this.formHelper}`;
          this.fields[helperField] = VAL;
        }
    },

    setDefaultFieldValue(fieldConfig) {
      // const FIELD_NAME = Object.keys(this.fields).find(
      //   name => name === fieldConfig.name
      // );
      // this.fields[fieldConfig.name] = fieldConfig.value || '';
      this.fields[fieldConfig.name] = 'value' in fieldConfig ? fieldConfig.value : '';
    },

    fieldVisible(fieldConfig) {
      const SHOW = 'show' in fieldConfig ? fieldConfig.show(this) : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },

    bindProps(fieldConfig) {
      return {
        name: fieldConfig.name,
        ...fieldConfig.props,
        errorMsg: this.errors[fieldConfig.name],
        error: this.errors[fieldConfig.name],
        disabled: this.fieldDisabled(fieldConfig)
      };
    },

    findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find(conf => conf.name === fieldName);
    },

    convertToNumber(fieldName) {
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG && FIELD_CONFIG.type === 'number' && this.fields[fieldName] && (this.fields[fieldName] = Number(this.fields[fieldName]));
    },

    bindEvents(fieldConfig) {
      let events = {};

      if ('triggers' in fieldConfig) {
        events = fieldConfig.triggers(this);
        return events;
      }

      return events;
    },

    // custom component ---------------------------------------------
    hasCustomComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || 'text';
      return 'component' in fieldConfig || this.findCustomComponentByType(FIELD_TYPE);
    },

    findCustomComponentByType(fieldType) {
      return !this.hasCustomComponentsMap ? undefined : this.customComponentsMap.find(component => component.type.includes(fieldType));
    },

    // ---------------------------------------------------------------
    computedComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || 'text';
      const DEFAULT_COMPONENT = this.findDefaultComponent(FIELD_TYPE);

      if ('component' in fieldConfig) {
        return fieldConfig.component;
      }

      const CUSTOM_COMPONENT = this.findCustomComponentByType(FIELD_TYPE);
      return CUSTOM_COMPONENT ? CUSTOM_COMPONENT.name : DEFAULT_COMPONENT;
    },

    findDefaultComponent() {
      return 'default component';
    },

    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const FIELD_IS_DISABLED_IN_PROPS = fieldConfig.props && 'disabled' in fieldConfig.props ? fieldConfig.props.disabled : false;
      return !this.formEditable || FIELD_IS_DISABLED_IN_PROPS ? DISABLED : !DISABLED;
    },

    fieldRequired(fieldName) {
      const REQUIRED = true;
      const NOT_REQUIRED = false;
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      return FIELD_CONFIG && !this.fieldDisabled(FIELD_CONFIG) && this.fieldVisible(FIELD_CONFIG) ? !this.fieldIsHelper(fieldName) ? 'required' in FIELD_CONFIG ? FIELD_CONFIG.required : REQUIRED : 'required' in FIELD_CONFIG ? FIELD_CONFIG.required : NOT_REQUIRED : NOT_REQUIRED;
    },

    validateField(fieldName) {
      const REQUIRED = this.fieldRequired(fieldName); // const HAS_CONFIG = Object.keys(this.validationConfig).length;

      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const FIELD_IS_VALID = [true, ''];
      const fieldRules = FIELD_CONFIG.rules || {}; // console.log('validate field', fieldName, REQUIRED);

      const [fieldValid, fieldErrorMsg] = // REQUIRED && HAS_CONFIG
      REQUIRED ? this.submit || this.activeValidation ? VALIDATION_ENGINE(fieldName, this.fields[fieldName], fieldRules, this.formRules, { ...this.fields
      }, //sending immutable copy of fields
      this.submit) : FIELD_IS_VALID : FIELD_IS_VALID;
      this.showErrors(fieldName, fieldErrorMsg);
      return fieldValid;
    },

    async submitForm() {
      let inputs = [];
      const NOT_VALID = false;
      this.loading = true;
      this.submit = true;
      Object.keys(this.fields).forEach(field => {
        inputs.push(this.validateField(field));
      });

      if (inputs.includes(NOT_VALID)) {
        console.log('Form not valid');
        this.resetForm();
        return;
      }

      console.log('Form valid, calling submit handler');
      await this.submitHandler(this.fields);
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

  return _vm.hasFieldsConfig ? _c('form', {
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
      key: fieldConfig.name,
      staticClass: "generated-form__body__row"
    }, 'div', {
      class: _vm.classes.row
    }, false), [Array.isArray(fieldConfig) ? [_vm._l(fieldConfig, function (subFieldConfig) {
      return [_vm.fieldVisible(subFieldConfig) ? _c('div', _vm._b({
        key: subFieldConfig.name,
        staticClass: "generated-form__body__row__col",
        class: "col-" + subFieldConfig.name
      }, 'div', {
        class: _vm.classes.col
      }, false), [[_vm._t(subFieldConfig.name + "_before"), _vm._v(" "), _vm.hasCustomComponent(subFieldConfig) ? _c(_vm.computedComponent(subFieldConfig), _vm._g(_vm._b({
        key: subFieldConfig.name,
        ref: subFieldConfig.name,
        refInFor: true,
        tag: "component",
        attrs: {
          "type": subFieldConfig.type || 'text'
        },
        model: {
          value: _vm.fields[subFieldConfig.name],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subFieldConfig.name, typeof $$v === 'string' ? $$v.trim() : $$v);
          },
          expression: "fields[subFieldConfig.name]"
        }
      }, 'component', _vm.bindProps(subFieldConfig), false), _vm.bindEvents(subFieldConfig))) : _vm._e(), _vm._v(" "), _vm._t(subFieldConfig.name + "_after")]], 2) : _vm._e()];
    })] : [_vm.fieldVisible(fieldConfig) ? _c('div', _vm._b({
      staticClass: "generated-form__body__row__col",
      class: "col-" + fieldConfig.name
    }, 'div', {
      class: _vm.classes.col
    }, false), [[_vm._t(fieldConfig.name + "_before"), _vm._v(" "), _vm.hasCustomComponent(fieldConfig) ? _c(_vm.computedComponent(fieldConfig), _vm._g(_vm._b({
      key: fieldConfig.name,
      ref: fieldConfig.name,
      refInFor: true,
      tag: "component",
      attrs: {
        "type": fieldConfig.type || 'text'
      },
      model: {
        value: _vm.fields[fieldConfig.name],
        callback: function ($$v) {
          _vm.$set(_vm.fields, fieldConfig.name, typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "fields[fieldConfig.name]"
      }
    }, 'component', _vm.bindProps(fieldConfig), false), _vm.bindEvents(fieldConfig))) : _vm._e(), _vm._v(" "), _vm._t(fieldConfig.name + "_after")]], 2) : _vm._e()]], 2)];
  })], 2) : _vm._e(), _vm._v(" "), !_vm.formEditable ? _vm._t("disabled", null, {
    "fieldsConfigFlat": _vm.fieldsConfig_FLAT
  }) : _vm._e(), _vm._v(" "), _vm._t("agreement"), _vm._v(" "), _vm._t("actions"), _vm._v(" "), _c('div', {
    staticClass: "generated-form__footer"
  }, [_vm._t("footer")], 2)], 2) : _vm._e();
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = "data-v-2a6e4118";
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
