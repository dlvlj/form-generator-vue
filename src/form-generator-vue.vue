<template>
  <form class="generated-form" @submit.prevent="submitForm">
    <div class="generated-form__header">
      <slot name="header" />
    </div>
    <div v-if="formEditable" class="generated-form__body">
      <template v-for="fieldConfig in fieldsConfig">
        <slot
          name="sectionLabel"
          :fieldConfig="fieldConfig"
          :fieldsConfigFlat="fieldsConfig_FLAT"
        />
        <!-- ROW -->
        <div
          v-if="
            isArr(fieldConfig) ||
            (fieldVisible(fieldConfig) && computedComponent(fieldConfig))
          "
          :key="fieldConfig.model"
          :class="['generated-form__body__row', classes.row]"
        >
          <!-- IF ARRAY THEN LOAD MULTIPLE COLUMNS -->
          <template v-if="isArr(fieldConfig)">
            <template v-for="subFieldConfig in fieldConfig">
              <div
                v-show="
                  fieldVisible(subFieldConfig) &&
                  computedComponent(subFieldConfig)
                "
                :key="subFieldConfig.model"
                :class="[
                  'generated-form__body__row__col',
                  `col-${subFieldConfig.model}`,
                  classes.col,
                ]"
              >
                <template>
                  <slot :name="`${subFieldConfig.model}_before`" />
                  <!-- COMPONENT -->
                  <component
                    :is="computedComponent(subFieldConfig)"
                    :ref="subFieldConfig.model"
                    :key="subFieldConfig.model"
                    v-model="fields[subFieldConfig.model]"
                    :type="subFieldConfig.type || 'text'"
                    v-bind="bindProps(subFieldConfig)"
                    v-on="bindEvents(subFieldConfig)"
                  >
                    <slot :name="`${subFieldConfig.model}`" />
                  </component>
                  <slot :name="`${subFieldConfig.model}_after`" />
                </template>
              </div>
            </template>
          </template>
          <!-- IF NOT AN ARRAY THEN ITS A FIELD, (CREATES ONE COLUMN PER ROW) -->
          <template v-else>
            <div
              :class="[
                'generated-form__body__row__col',
                `col-${fieldConfig.model}`,
                classes.col,
              ]"
            >
              <template>
                <slot :name="`${fieldConfig.model}_before`" />
                <!-- COMPONENT -->
                <component
                  :is="computedComponent(fieldConfig)"
                  :ref="fieldConfig.model"
                  :key="fieldConfig.model"
                  v-model="fields[fieldConfig.model]"
                  :type="fieldConfig.type || 'text'"
                  v-bind="bindProps(fieldConfig)"
                  v-on="bindEvents(fieldConfig)"
                >
                  <slot :name="`${fieldConfig.model}`" />
                </component>
                <slot :name="`${fieldConfig.model}_after`" />
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- SHOW DISABLED FIELDS THE WAY YOU WANT USING THIS SLOT -->
    <slot
      v-if="!formEditable"
      name="disabled"
      :fieldsConfigFlat="fieldsConfig_FLAT"
    />
    <!-- FOR TEXTUAL AGREEMENTS ABOVE FORM ACTIONS -->
    <slot name="agreement" />
    <!-- FORM ACTIONS -->
    <slot name="actions" />
    <div class="generated-form__footer">
      <slot name="footer" />
    </div>
  </form>
</template>

<script>
import VALIDATION_ENGINE from "./validation-engine.js";
export default {
  props: {
    value: {
      type: Object,
      default: null,
      required: false,
    },
    submitHandler: {
      type: Function,
      required: false,
      default: () => {
        console.error("submit handler not present");
      },
    },
    validationRules: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    formComponents: {
      type: Array,
      required: false,
      default: () => [],
    },
    formEditable: {
      type: Boolean,
      required: false,
      default: true,
    },
    validationConfig: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    handleSubmitFail: {
      type: Function,
      required: false,
      default: () => {
        console.warn("Form submit fail");
      },
    },
  },
  data() {
    let fields = {};
    let errors = {};
    function addFieldsAndErrors(fieldConfig) {
        fields[fieldConfig.model] = "value" in fieldConfig ? fieldConfig.value : "";
        errors[fieldConfig.model] = "";
    }
    if ("fields" in this.formConfig && this.isArr(this.formConfig.fields) && this.formConfig.fields.length) {
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
      submit: false,
    };
  },

  computed: {
    helperComponent: () => "_formHelper",
    activeValidation() {
      return "activeValidation" in this.formConfig
        ? this.formConfig.activeValidation
        : false;
    },
    activeValidationDelay() {
      const hasActiveValidationDelay = "activeValidationDelay" in this.formConfig && this.formConfig.activeValidationDelay && !isNaN(this.formConfig.activeValidationDelay);
      return this.activeValidation && hasActiveValidationDelay? this.formConfig.activeValidationDelay : false;
    },
    logs() {
      return "logs" in this.formConfig ? this.formConfig.logs : false;
    },
    fieldsConfig() {
      return "fields" in this.formConfig && this.formConfig.fields.length
        ? this.formConfig.fields
        : [];
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
    },
    vModelValid() {
      const parentValid =  this.value && typeof this.value === 'object' && !this.isArr(this.value); 
      const hasChildren = parentValid && 'values' in this.value && 'errors' in this.value;
      return hasChildren && typeof this.value.values === 'object' && !this.isArr(this.value.values) && typeof this.value.errors === 'object' && !this.isArr(this.value.errors);
    },
    debounceValidateField() {
      return this.debounce((fieldName) => {
        this.validateField(fieldName)
      }, this.activeValidationDelay);
    },
  },
  watch: {
    formEditable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      },
    },
    value: {
      handler: function () {
        if (this.vModelValid) {
          for (const fieldName in this.value["values"]) {
            this.fields[fieldName] = this.value["values"][fieldName];
            this.errors[fieldName] = this.value["errors"][fieldName];
          }
        }
      },
      deep: true,
    },
    fields: {
      handler: function (newVal) {
        this.cleanData();
        this.$emit("input", { values: this.fields, errors: this.errors });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$emit("setFormContext", this);
    for (const fieldName in this.fields) {
      this.$watch(`fields.${fieldName}`, function (newVal, oldVal) {
        // for number type field.
        this.convertToNumber(fieldName);
        // for helper components
        this.updateHelpers(fieldName, newVal);
        // to prevent below calls when only type is changed.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        this.activeValidationDelay ? this.debounceValidateField(fieldName) : this.validateField(fieldName);
      });
    }
  },
  methods: {
    cleanData() {
      const uf = Object.keys(this.fields).filter(fieldName => !this.fieldsConfig_FLAT.find(({model}) => model === fieldName));
      uf.forEach(fieldName => {
        delete this.fields[fieldName];
        delete this.errors[fieldName];
      })
    },
    debounce: (func, wait)=> {
      let timeOut;
      return function executedFunction(param) {
        clearTimeout(timeOut);
        timeOut=setTimeout(function(){
          clearTimeout(timeOut);
          func(param);
        },wait);
      }
    },
    resetFormState() {
      this.submit = false;
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
      const VAL = newVal;
      // for helper field
      if (this.isHelperComponent(fieldName)) {
        const fieldBeingHelped = fieldName.split(this.helperComponent)[0];
        fieldBeingHelped in this.fields &&
          (this.fields[fieldBeingHelped] = VAL);
        return;
      }
      // for field being helped
      if (`${fieldName}${this.helperComponent}` in this.fields) {
        const helperField = `${fieldName}${this.helperComponent}`;
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] =
        "value" in fieldConfig ? fieldConfig.value : "";
    },
    fieldVisible(fieldConfig) {
      const SHOW =
        "show" in fieldConfig
          ? typeof fieldConfig.show === "function"
            ? fieldConfig.show(this)
            : Boolean(fieldConfig.show)
          : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },
    bindProps(fieldConfig) {
      const componentName = this.computedComponent(fieldConfig);
      const formComponent = this.formComponents.find(
        ({ component }) => component.name === componentName
      );

      const {
        component: { errorProp },
      } = fieldConfig.errorProp
        ? {
            component: { errorProp: fieldConfig.errorProp },
          }
        : formComponent || { component: { errorProp: "errorMessage" } };

      return {
        ...fieldConfig.props,
        [errorProp]: this.errors[fieldConfig.model],
        disabled: this.fieldDisabled(fieldConfig),
      };
    },
    findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find((conf) => conf.model === fieldName);
    },
    convertToNumber(fieldName) {
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG &&
        FIELD_CONFIG.type === "number" &&
        this.fields[fieldName] &&
        (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    bindEvents(fieldConfig) {
      return "triggers" in fieldConfig && this.isFunc(fieldConfig.triggers)
        ? fieldConfig.triggers(this)
        : {};
    },
    computedComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || "text";
      if ("component" in fieldConfig) {
        return fieldConfig.component;
      }
      const {
        component: { name },
      } = this.formComponents.find(({ type }) => type.includes(FIELD_TYPE)) || {
        component: { name: "" },
      };
      !name &&
        console.error(
          `Component cannot be rendered. Component for type "${FIELD_TYPE}" is not found in form-components.`
        );
      return name;
    },
    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const DISABLED_PROP =
        fieldConfig.props && "disabled" in fieldConfig.props
          ? this.isFunc(fieldConfig.props.disabled)
            ? fieldConfig.props.disabled(this)
            : Boolean(fieldConfig.props.disabled)
          : false;
      return !this.formEditable || DISABLED_PROP ? DISABLED : !DISABLED;
    },
    fieldRequired(fieldName) {
      const REQUIRED = true;
      const NOT_REQUIRED = false;
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const requiredProp =
        FIELD_CONFIG.props && "required" in FIELD_CONFIG.props
          ? this.isFunc(FIELD_CONFIG.props.required)
            ? FIELD_CONFIG.props.required(this)
            : Boolean(FIELD_CONFIG.props.required)
          : this.isHelperComponent(fieldName)
          ? NOT_REQUIRED
          : REQUIRED;

      return FIELD_CONFIG &&
        !this.fieldDisabled(FIELD_CONFIG) &&
        this.fieldVisible(FIELD_CONFIG)
        ? requiredProp
        : NOT_REQUIRED;
    },

    validateField(fieldName) {
      const REQUIRED = this.fieldRequired(fieldName);
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const FIELD_IS_VALID = [true, ""];
      const config_rules = FIELD_CONFIG.rules || {};

      const [fieldValid, fieldErrorMsg] =
        this.submit || this.activeValidation
          ? VALIDATION_ENGINE(
              fieldName,
              this.fields[fieldName],
              config_rules,
              this.validationRules,
              { ...this.fields },
              this.submit
            )
          : FIELD_IS_VALID;

      !REQUIRED
        ? !this.submit && this.showErrors(fieldName, fieldErrorMsg) // for active validation
        : this.showErrors(fieldName, fieldErrorMsg);

      this.logs &&
        console.log(
          `model:${fieldName}\n`,
          `value:${this.fields[fieldName]}\n`,
          `type:${typeof this.fields[fieldName]}\n`,
          `isValid:${fieldValid}\n`,
          `required:${REQUIRED}\n`,
          `errorMessage:${fieldErrorMsg}`
        );
      return fieldValid;
    },
    async submitForm() {
      this.submit = true;
      let formValidationStatus = {};

      this.cleanData();
      Object.keys(this.fields).forEach((fieldName) => {
        const required = this.fieldRequired(fieldName);
        formValidationStatus[fieldName] = this.validateField(fieldName) || !required;
      });

      const submitFail = Object.keys(formValidationStatus).find(fieldName => !formValidationStatus[fieldName]);
      if(this.logs) {
        console.log("form data:", this.fields); 
        console.log("form validations:", formValidationStatus);
      }
      if (submitFail) {
        this.resetFormState();
        this.handleSubmitFail(this.fields);
        return;
      }
      await this.submitHandler(this.fields);
      this.resetFormState();
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
    },
  },
};
</script>
