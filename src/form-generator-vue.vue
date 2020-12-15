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
    formRules: {
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
      fields = {
        ...fields,
        [fieldConfig.model]: "value" in fieldConfig ? fieldConfig.value : "",
      };
      errors = {
        ...errors,
        [fieldConfig.model]: "",
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
  },
  watch: {
    formEditable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      },
    },
    fields: {
      handler: function (newVal) {
        this.$emit("input", this.fields);
      },
      deep: true,
    },
    // value: {
    //   handler: function (newVal) {
    //     this.fields = this.value
    //   },
    //   immediate: true,
    // }
  },
  created() {
    this.$emit("setFormContext", this);
    if (this.value && Object.keys(this.value).length) {
      for (const fieldName in this.value) {
        if (fieldName in this.fields) {
          this.$watch(
            `value.${fieldName}`,
            function (newVal, oldVal) {
              this.fields[fieldName] = newVal;
            },
            { immediate: true }
          );
        }
      }
    }
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
        this.validateField(fieldName);
      });
    }
  },
  methods: {
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
      // const config_required = this.isFunc(FIELD_CONFIG.required)
      //   ? FIELD_CONFIG.required(this)
      //   : Boolean(FIELD_CONFIG.required);

      // return FIELD_CONFIG &&
      //   !this.fieldDisabled(FIELD_CONFIG) &&
      //   this.fieldVisible(FIELD_CONFIG)
      //   ? !this.isHelperComponent(fieldName)
      //     ? "required" in FIELD_CONFIG
      //       ? config_required
      //       : REQUIRED
      //     : "required" in FIELD_CONFIG
      //     ? config_required
      //     : NOT_REQUIRED
      //   : NOT_REQUIRED;

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
              this.formRules,
              { ...this.fields },
              this.submit
            )
          : FIELD_IS_VALID;

      !REQUIRED
        ? !this.submit && this.showErrors(fieldName, fieldErrorMsg)
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
      const INVALID = false;
      let fieldsStatus = [];
      Object.keys(this.fields).forEach((fieldName) => {
        fieldsStatus = [
          ...fieldsStatus,
          [fieldName, this.validateField(fieldName)],
        ];
      });
      const [firstInvalidField] = fieldsStatus.find(([fieldName, status]) => {
        const REQUIRED = this.fieldRequired(fieldName);
        return REQUIRED && status === INVALID;
      }) || [""];

      this.logs && console.log("fields data", this.fields);
      console.log("validations status:", fieldsStatus);

      if (firstInvalidField) {
        this.handleSubmitFail(this.fields);
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
      this.logs &&
        console.log(
          "scroll to:",
          `${componentName ? fieldName : `${fieldName}(component not found)`}`
        );
      if (!componentName) {
        return;
      }
      const ref = fieldName;
      const el = this.$refs[ref][0].$el;
      el &&
        el.scrollIntoView({
          behavior: "smooth",
        }) &&
        el.focus();
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

<style lang="scss" scoped>
</style>
