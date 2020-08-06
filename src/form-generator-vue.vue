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
          :key="fieldConfig.model"
          class="generated-form__body__row"
          v-bind="{class: classes.row}"
        >
          <!-- IF ARRAY THEN LOAD MULTIPLE COLUMNS  ------------------------------------------------------->
          <template v-if="Array.isArray(fieldConfig)">
            <template v-for="subFieldConfig in fieldConfig">
              <div
                v-if="fieldVisible(subFieldConfig)"
                :key="subFieldConfig.model"
                class="generated-form__body__row__col"
                :class="`col-${subFieldConfig.model}`"
                v-bind="{class: classes.col}"
              >
                <template>
                  <slot :name="`${subFieldConfig.model}_before`" />
                  <!-- FIELD-COMPONENT ---------------------------------------------->
                  <component
                    :is="computedComponent(subFieldConfig)"
                    v-if="hasCustomComponent(subFieldConfig)"
                    :ref="subFieldConfig.model"
                    :key="subFieldConfig.model"
                    v-model.trim="fields[subFieldConfig.model]"
                    :type="subFieldConfig.type ||'text'"
                    v-bind="bindProps(subFieldConfig)"
                    v-on="bindEvents(subFieldConfig)"
                  />
                  <slot :name="`${subFieldConfig.model}_after`" />
                </template>
              </div>
            </template>
          </template>
          <!-- IF NOT AN ARRAY THEN ITS A FIELD, (CREATES ONE COLUMN PER ROW) ---------------------->
          <template v-else>
            <div
              v-if="fieldVisible(fieldConfig)"
              class="generated-form__body__row__col"
              :class="`col-${fieldConfig.model}`"
              v-bind="{class: classes.col}"
            >
              <template>
                <slot :name="`${fieldConfig.model}_before`" />
                <!-- FIELD-COMPONENT ---------------------------------------------->
                <component
                  :is="computedComponent(fieldConfig)"
                  v-if="hasCustomComponent(fieldConfig)"
                  :ref="fieldConfig.model"
                  :key="fieldConfig.model"
                  v-model.trim="fields[fieldConfig.model]"
                  :type="fieldConfig.type || 'text'"
                  v-bind="bindProps(fieldConfig)"
                  v-on="bindEvents(fieldConfig)"
                />
                <slot :name="`${fieldConfig.model}_after`" />
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
        [field.model]: "value" in field ? field.value : "",
      };
      errors = {
        ...errors,
        [field.model]: "",
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
      return "activeValidation" in this.formConfig ? true : false;
    },
    logs() {
      return "logs" in this.formConfig ? true : false;
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
    Object.keys(this.fields).forEach((fieldModel) => {
      this.$watch(
        `fields.${fieldModel}`,
        function (newVal, oldVal) {
          //  fields value type to number (for fields with type number)
          this.convertToNumber(fieldModel);
          // for helpers ---------------------------
          this.fieldHelpers(fieldModel, newVal);
          // to prevent any unnecessary function call when only type of field property is changed.
          if (newVal == oldVal && typeof newVal !== typeof oldVal) {
            return;
          }
          // validations ------------------------
          this.validateField(fieldModel);
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
    fieldIsHelper(fieldModel) {
      return fieldModel.includes(this.formHelper);
    },
    fieldHelpers(fieldModel, newVal) {
      const VAL = newVal;
      // helping field ------------------
      if (this.fieldIsHelper(fieldModel)) {
        const fieldBeingHelped = fieldModel.split(this.formHelper)[0];
        fieldBeingHelped in this.fields &&
          (this.fields[fieldBeingHelped] = VAL);
      }
      // field being helped
      else if (`${fieldModel}${this.formHelper}` in this.fields) {
        const helperField = `${fieldModel}${this.formHelper}`;
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue(fieldConfig) {
      // const FIELD_NAME = Object.keys(this.fields).find(
      //   name => name === fieldConfig.name
      // );
      // this.fields[fieldConfig.name] = fieldConfig.value || '';
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
      const componentData = this.customComponentsMap.find(
        ({ component }) => component.name === componentName
      );

      const {
        component: { errorProp },
      } = fieldConfig.errorProp
        ? {
            component: { errorProp: fieldConfig.errorProp },
          }
        : componentData || { component: { errorProp: "errorMessage" } };

      // componentData ||
      // (fieldConfig.errorProp
      //   ? {
      //       component: { errorProp: fieldConfig.errorProp }
      //     }
      //   : { component: { errorProp: 'errorMessage' } });

      return {
        ...fieldConfig.props,
        // ...ERROR_PROPS,
        // name: fieldConfig.name,
        // errorMsg: this.errors[fieldConfig.name],
        // error: this.errors[fieldConfig.name],
        // [component.errorProp] : this.errors[fieldConfig.name],
        [errorProp]: this.errors[fieldConfig.model],
        disabled: this.fieldDisabled(fieldConfig),
      };
    },
    findFieldConfig(fieldModel) {
      return this.fieldsConfig_FLAT.find((conf) => conf.model === fieldModel);
    },
    convertToNumber(fieldModel) {
      const FIELD_CONFIG = this.findFieldConfig(fieldModel);
      FIELD_CONFIG &&
        FIELD_CONFIG.type === "number" &&
        this.fields[fieldModel] &&
        (this.fields[fieldModel] = Number(this.fields[fieldModel]));
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
      return CUSTOM_COMPONENT
        ? CUSTOM_COMPONENT.component.name
        : DEFAULT_COMPONENT;
    },
    findDefaultComponent() {
      return "default component";
    },
    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const DISABLED_PROP =
        fieldConfig.props && "disabled" in fieldConfig.props
          ? typeof fieldConfig.props.disabled === "function"
            ? fieldConfig.props.disabled(this)
            : Boolean(fieldConfig.props.disabled)
          : false;
      return !this.formEditable || DISABLED_PROP ? DISABLED : !DISABLED;
    },
    fieldRequired(fieldModel) {
      const REQUIRED = true;
      const NOT_REQUIRED = false;
      const FIELD_CONFIG = this.findFieldConfig(fieldModel);
      const fieldRequired =
        typeof FIELD_CONFIG.required === "function"
          ? FIELD_CONFIG.required(this)
          : Boolean(FIELD_CONFIG.required);

      return FIELD_CONFIG &&
        !this.fieldDisabled(FIELD_CONFIG) &&
        this.fieldVisible(FIELD_CONFIG)
        ? !this.fieldIsHelper(fieldModel)
          ? "required" in FIELD_CONFIG
            ? fieldRequired
            : REQUIRED
          : "required" in FIELD_CONFIG
          ? fieldRequired
          : NOT_REQUIRED
        : NOT_REQUIRED;
    },

    validateField(fieldModel) {
      const REQUIRED = this.fieldRequired(fieldModel);
      // const HAS_CONFIG = Object.keys(this.validationConfig).length;
      const FIELD_CONFIG = this.findFieldConfig(fieldModel);
      const FIELD_IS_VALID = [true, ""];
      const fieldRules = FIELD_CONFIG.rules || {};

      // console.log('validate field', fieldName, REQUIRED);

      const [fieldValid, fieldErrorMsg] =
        // REQUIRED && HAS_CONFIG
        REQUIRED
          ? this.submit || this.activeValidation
            ? VALIDATION_ENGINE(
                fieldModel,
                this.fields[fieldModel],
                fieldRules,
                this.formRules,
                { ...this.fields }, //sending immutable copy of fields
                this.submit
              )
            : FIELD_IS_VALID
          : FIELD_IS_VALID;

      this.showErrors(fieldModel, fieldErrorMsg);
      this.logs &&
        console.log(
          `field: ${fieldModel}, value: ${this.fields[fieldModel]}, isValid: ${fieldValid}, errorMessage: ${fieldErrorMsg} `
        );
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
        this.logs && console.log("Form is not valid");
        this.resetForm();
        return;
      }

      this.logs && console.log("calling submit handler");
      await this.submitHandler(this.fields);

      this.resetForm();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
