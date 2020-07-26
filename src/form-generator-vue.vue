<template>
  <form v-if="hasFieldsConfig" class="generated-form" @submit.prevent="submitForm">
    <div class="generated-form__header">
      <slot name="header" />
    </div>
    <div v-if="formEditable" class="generated-form__body">
      <template v-for="fieldConfig in fieldsConfig">
        <slot name="sectionLabel" :fieldConfig="fieldConfig" :fieldsConfigFlat="fieldsConfig_FLAT" />
        <!-- ROW  ------------------------------------------------------->
        <div
          :key="fieldConfig.name"
          class="generated-form__body__row"
          v-bind="{class: classes.row}"
        >
          <!-- IF ARRAY THEN LOAD MULTIPLE COLUMNS  ------------------------------------------------------->
          <template v-if="Array.isArray(fieldConfig)">
            <template v-for="subFieldConfig in fieldConfig">
              <div
                v-if="fieldVisible(subFieldConfig)"
                :key="subFieldConfig.name"
                class="generated-form__body__row__col"
                :class="`col-${subFieldConfig.name}`"
                v-bind="{class: classes.col}"
              >
                <template>
                  <slot :name="`${subFieldConfig.name}_before`" />
                  <!-- FIELD-COMPONENT ---------------------------------------------->
                  <component
                    :is="computedComponent(subFieldConfig)"
                    v-if="hasCustomComponent(subFieldConfig)"
                    :ref="subFieldConfig.name"
                    :key="subFieldConfig.name"
                    v-model.trim="fields[subFieldConfig.name]"
                    :type="subFieldConfig.type ||'text'"
                    v-bind="bindProps(subFieldConfig)"
                    v-on="bindEvents(subFieldConfig)"
                  />
                  <slot :name="`${subFieldConfig.name}_after`" />
                </template>
              </div>
            </template>
          </template>
          <!-- IF NOT AN ARRAY THEN ITS A FIELD, (CREATES ONE COLUMN PER ROW) ---------------------->
          <template v-else>
            <div
              v-if="fieldVisible(fieldConfig)"
              class="generated-form__body__row__col"
              :class="`col-${fieldConfig.name}`"
              v-bind="{class: classes.col}"
            >
              <template>
                <slot :name="`${fieldConfig.name}_before`" />
                <!-- FIELD-COMPONENT ---------------------------------------------->
                <component
                  :is="computedComponent(fieldConfig)"
                  v-if="hasCustomComponent(fieldConfig)"
                  :ref="fieldConfig.name"
                  :key="fieldConfig.name"
                  v-model.trim="fields[fieldConfig.name]"
                  :type="fieldConfig.type || 'text'"
                  v-bind="bindProps(fieldConfig)"
                  v-on="bindEvents(fieldConfig)"
                />
                <slot :name="`${fieldConfig.name}_after`" />
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- SHOW DISABLED FIELDS THE WAY YOU WANT USING THIS SLOT ------------------------------------>
    <slot v-if="!formEditable" name="disabled" :fieldsConfigFlat="fieldsConfig_FLAT" />
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
    submitHandler: {
      type: Function,
      required: false,
      default: function () {
        console.log(this.fields);
        alert("submit handler not present");
      },
    },
    formRules: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    customComponentsMap: {
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
  },
  data() {
    let fields = {};
    let errors = {};
    function addFieldsAndErrors(field) {
      fields = {
        ...fields,
        [field.name]: "value" in field ? field.value : "",
      };
      errors = {
        ...errors,
        [field.name]: "",
      };
    }
    "fields" in this.formConfig &&
      this.formConfig.fields.forEach((field) => {
        if (Array.isArray(field)) {
          field.forEach((subField) => {
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
      submit: false,
    };
  },

  computed: {
    formHelper: () => "_formHelper",
    hasCustomComponentsMap() {
      return Boolean(this.customComponentsMap.length);
    },
    activeValidation() {
      return "activeValidation" in this.formConfig
        ? this.formConfig.activeValidation
        : false;
    },
    fieldsConfig() {
      return this.formConfig.fields;
    },
    fieldsConfig_FLAT() {
      let flatConfig = [];
      this.fieldsConfig.forEach((conf) => {
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
    defaultFieldComponents: () => [],
  },
  watch: {
    formEditable: {
      handler: function (newVal) {
        !newVal && this.removeAllErrors();
      },
    },
  },
  created() {
    this.$emit("setFormContext", this);
  },
  mounted() {
    Object.keys(this.fields).forEach((fieldName) => {
      this.$watch(
        `fields.${fieldName}`,
        function (newVal, oldVal) {
          //  fields value type to number (for fields with type number)
          this.convertToNumber(fieldName);
          // to prevent any unnecessary function call when only type of field property is changed.
          if (newVal == oldVal && typeof newVal !== typeof oldVal) {
            return;
          }
          // for helpers ---------------------------
          this.fieldHelpers(fieldName, newVal);
          // validations ------------------------
          this.validateField(fieldName);
        }
        // { deep: true }
      );
    });
  },
  methods: {
    resetForm() {
      this.submit = false;
      this.loading = false;
    },
    removeAllErrors() {
      Object.keys(this.errors).forEach((msg) => {
        this.errors[msg] = "";
      });
    },
    showErrors(field, msg) {
      this.errors[field] = msg;
    },
    fieldIsHelper(fieldName) {
      return fieldName.includes(this.formHelper);
    },
    fieldHelpers(fieldName, newVal) {
      const VAL = newVal;
      // helping field ------------------
      if (this.fieldIsHelper(fieldName)) {
        const fieldBeingHelped = fieldName.split(this.formHelper)[0];
        fieldBeingHelped in this.fields &&
          (this.fields[fieldBeingHelped] = VAL);
      }
      // field being helped
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
      this.fields[fieldConfig.name] =
        "value" in fieldConfig ? fieldConfig.value : "";
    },
    fieldVisible(fieldConfig) {
      const SHOW = "show" in fieldConfig ? fieldConfig.show(this) : true;
      !SHOW && this.setDefaultFieldValue(fieldConfig);
      return SHOW;
    },
    bindProps(fieldConfig) {
      return {
        name: fieldConfig.name,
        ...fieldConfig.props,
        errorMsg: this.errors[fieldConfig.name],
        error: this.errors[fieldConfig.name],
        disabled: this.fieldDisabled(fieldConfig),
      };
    },
    findFieldConfig(fieldName) {
      return this.fieldsConfig_FLAT.find((conf) => conf.name === fieldName);
    },
    convertToNumber(fieldName) {
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      FIELD_CONFIG &&
        FIELD_CONFIG.type === "number" &&
        this.fields[fieldName] &&
        (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    bindEvents(fieldConfig) {
      let events = {};

      if ("triggers" in fieldConfig) {
        events = fieldConfig.triggers(this);
        return events;
      }

      return events;
    },
    // custom component ---------------------------------------------
    hasCustomComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || "text";
      return (
        "component" in fieldConfig || this.findCustomComponentByType(FIELD_TYPE)
      );
    },
    findCustomComponentByType(fieldType) {
      return !this.hasCustomComponentsMap
        ? undefined
        : this.customComponentsMap.find((component) =>
            component.type.includes(fieldType)
          );
    },

    // ---------------------------------------------------------------
    computedComponent(fieldConfig) {
      const FIELD_TYPE = fieldConfig.type || "text";
      const DEFAULT_COMPONENT = this.findDefaultComponent(FIELD_TYPE);
      if ("component" in fieldConfig) {
        return fieldConfig.component;
      }
      const CUSTOM_COMPONENT = this.findCustomComponentByType(FIELD_TYPE);
      return CUSTOM_COMPONENT ? CUSTOM_COMPONENT.name : DEFAULT_COMPONENT;
    },
    findDefaultComponent() {
      return "default component";
    },
    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const FIELD_IS_DISABLED_IN_PROPS =
        fieldConfig.props && "disabled" in fieldConfig.props
          ? fieldConfig.props.disabled
          : false;
      return !this.formEditable || FIELD_IS_DISABLED_IN_PROPS
        ? DISABLED
        : !DISABLED;
    },
    fieldRequired(fieldName) {
      const REQUIRED = true;
      const NOT_REQUIRED = false;
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      return FIELD_CONFIG &&
        !this.fieldDisabled(FIELD_CONFIG) &&
        this.fieldVisible(FIELD_CONFIG)
        ? !this.fieldIsHelper(fieldName)
          ? "required" in FIELD_CONFIG
            ? FIELD_CONFIG.required
            : REQUIRED
          : "required" in FIELD_CONFIG
          ? FIELD_CONFIG.required
          : NOT_REQUIRED
        : NOT_REQUIRED;
    },

    validateField(fieldName) {
      const REQUIRED = this.fieldRequired(fieldName);
      // const HAS_CONFIG = Object.keys(this.validationConfig).length;
      const FIELD_CONFIG = this.findFieldConfig(fieldName);
      const FIELD_IS_VALID = [true, ""];
      const fieldRules = FIELD_CONFIG.rules || {};

      // console.log('validate field', fieldName, REQUIRED);

      const [fieldValid, fieldErrorMsg] =
        // REQUIRED && HAS_CONFIG
        REQUIRED
          ? this.submit || this.activeValidation
            ? VALIDATION_ENGINE(
                fieldName,
                this.fields[fieldName],
                fieldRules,
                this.formRules,
                { ...this.fields }, //sending immutable copy of fields
                this.submit
              )
            : FIELD_IS_VALID
          : FIELD_IS_VALID;

      this.showErrors(fieldName, fieldErrorMsg);
      return fieldValid;
    },
    async submitForm() {
      let inputs = [];
      const NOT_VALID = false;
      this.loading = true;
      this.submit = true;

      Object.keys(this.fields).forEach((field) => {
        inputs.push(this.validateField(field));
      });

      if (inputs.includes(NOT_VALID)) {
        console.log("Form not valid");
        this.resetForm();
        return;
      }

      console.log("Form valid, calling submit handler");
      await this.submitHandler(this.fields);

      this.resetForm();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
