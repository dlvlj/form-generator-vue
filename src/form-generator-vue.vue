<template>
  <form class="generated-form" @submit.prevent="handleSubmit">
    <!-- header section -->
    <div class="generated-form__header">
      <slot name="header" />
    </div>
    <!-- body -->
    <div v-if="editable" class="generated-form__body">
      <slot name="body-start"/>
      <template v-for="(fieldConfig, i) in fieldsConfig">
        <!-- for section label -->
        <slot
          name="sectionLabel"
          :fieldConfig="fieldConfig"
          :fieldsConfigFlat="fieldsConfigFlat"
        />
        <!-- ROW -->
        <div
          v-if="
            UTILS.isArr(fieldConfig) ||
            (fieldIsVisible(fieldConfig) && componentToRender(fieldConfig))
          "
          :key="i"
          :class="['generated-form__body__row', classes.row]"
        >
          <!-- IF ARRAY THEN CREATE MULTIPLE COLUMNS IN A ROW -->
          <template v-if="UTILS.isArr(fieldConfig)">
            <template v-for="subFieldConfig in fieldConfig">
              <div
                v-show="
                  fieldIsVisible(subFieldConfig) &&
                  componentToRender(subFieldConfig)
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
                    :is="componentToRender(subFieldConfig)"
                    v-model="fields[subFieldConfig.model]"
                    v-bind="componentProps(subFieldConfig)"
                    v-on="componentEvents(subFieldConfig)"
                  >
                    <slot :name="`${subFieldConfig.model}`" />
                  </component>
                  <slot :name="`${subFieldConfig.model}_after`" />
                </template>
              </div>
            </template>
          </template>
          <!-- IF NOT AN ARRAY THEN ITS A COLUMN (CREATES ONE COLUMN PER ROW) -->
          <template v-else>
            <div
              :class="[
                'generated-form__body__row__col',
                `col-${fieldConfig.model}`,
                classes.col,
              ]"
              :key="fieldConfig.model"
            >
              <template>
                <slot :name="`${fieldConfig.model}_before`" />
                <!-- COMPONENT -->
                <component
                  :is="componentToRender(fieldConfig)"
                  v-model="fields[fieldConfig.model]"
                  v-bind="componentProps(fieldConfig)"
                  v-on="componentEvents(fieldConfig)"
                >
                  <slot :name="`${fieldConfig.model}`" />
                </component>
                <slot :name="`${fieldConfig.model}_after`" />
              </template>
            </div>
          </template>
        </div>
      </template>
      <slot name="body-end"/>
    </div>
    <!-- to show uneditable form state -->
    <slot
      v-if="!editable"
      name="uneditable"
      :fieldsConfigFlat="fieldsConfigFlat"
    />
    <!-- footer section -->
    <div class="generated-form__footer">
      <slot name="footer" />
    </div>
  </form>
</template>

<script>
import props from './main/mixins/props';
import VALIDATION_ENGINE from "./main/validation-engine";
import UTILS from './main/utils';
const HELPER_COMPONENT = "_helper";
export default {
  mixins: [props],
  data() {
    const INIT = true;
    let fields = {};
    let errors = {};
    const addFieldsAndErrors = model => {
        fields[model] = this.vModelValid(INIT) && 'values' in this.value ? this.value.values[model]: '';
        errors[model] = this.vModelValid(INIT) && 'errors' in this.value ? this.value.errors[model]: '';
    }
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
      submit: false,
    };
  },
  computed: {
    UTILS: () => UTILS,
    activeValidation() {
      return "activeValidation" in this.schema
        ? this.schema.activeValidation
        : false;
    },
    activeValidationDelay() {
      const hasActiveValidationDelay = "activeValidationDelay" in this.schema && this.schema.activeValidationDelay && !isNaN(this.schema.activeValidationDelay);
      return this.activeValidation && hasActiveValidationDelay? this.schema.activeValidationDelay : false;
    },
    logs() {
      return "logs" in this.schema ? this.schema.logs : false;
    },
    fieldsConfig() {
      return "fields" in this.schema && this.schema.fields.length
        ? this.schema.fields
        : [];
    },
    fieldsConfigFlat() {
      let flatConfig = [];
      for (const config of this.fieldsConfig) {
        if (UTILS.isArr(config)) {
          for(const subConfig of config) {
            flatConfig.push(subConfig);
          }
        } else {
          flatConfig.push(config);
        }
      }
      return flatConfig;
    },
    debounceValidateField() {
      return this.debounce((fieldName) => {
        this.validateField(fieldName)
      }, this.activeValidationDelay);
    },
  },
  watch: {
    editable: {
      handler: function(newVal) {
        !newVal && this.removeAllErrors();
      },
    },
    value: {
      handler: function() {
        if (this.vModelValid()) {
          for (const fieldName in this.value["values"]) {
            this.fields[fieldName] = this.value["values"][fieldName];
            this.errors[fieldName] = this.value["errors"][fieldName];
          }
        }
      },
      deep: true,
    },
    fields: {
      handler: function() {
        this.removeUnwantedFields();
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
    vModelValid(init = false) {
      const parentValid =  this.value && UTILS.isObjNotArr(this.value); 
      if(init) {
        return parentValid && 'values' in this.value;
      }
      const hasChildren = parentValid && UTILS.hasProperty(['values', 'errors'], this.value);
      return hasChildren && UTILS.isObjNotArr([this.value.values, this.value.errors]);
    },
    removeUnwantedFields() {
      const uf = Object.keys(this.fields).filter(fieldName => !this.fieldsConfigFlat.find(({model}) => model === fieldName));
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
      const VAL = newVal;
      // for helper field
      if (this.isHelperComponent(fieldName)) {
        const [fieldBeingHelped] = fieldName.split(HELPER_COMPONENT);
        fieldBeingHelped in this.fields &&
          (this.fields[fieldBeingHelped] = VAL);
        return;
      }
      // for field being helped
      if (`${fieldName}${HELPER_COMPONENT}` in this.fields) {
        const helperField = `${fieldName}${HELPER_COMPONENT}`;
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] =
        fieldConfig.model in this.value.values ? this.value.values[fieldConfig.model] : '';
    },
    fieldIsVisible(fieldConfig) {
      const VISIBLE = true
      const fieldVisible =
        "show" in fieldConfig
          ? UTILS.handlefuncOrBool(fieldConfig.show, this)
          : VISIBLE;
      !fieldVisible && this.setDefaultFieldValue(fieldConfig);
      return fieldVisible;
    },
    componentProps(fieldConfig) {
      const componentName = this.componentToRender(fieldConfig);
      const component = this.formComponents.find(
        c => c.compData && c.compData.name === componentName
      );
      const errorPropName = fieldConfig.errorProp  || component.compData.errorProp ||  'error';
      return {
        ...fieldConfig.props,
        [errorPropName]: this.errors[fieldConfig.model],
        ref: fieldConfig.model,
        key: fieldConfig.model,
        type: fieldConfig.type || 'text',
        disabled: this.fieldIsDisabled(fieldConfig),
        required: this.fieldIsRequired(null,fieldConfig)
      };
    },
    findFieldConfig(fieldName) {
      return this.fieldsConfigFlat.find((conf) => conf.model === fieldName);
    },
    convertToNumber(fieldName) {
      const fieldConfig = this.findFieldConfig(fieldName);
      fieldConfig &&
        fieldConfig.type === "number" &&
        this.fields[fieldName] &&
        (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    componentEvents(fieldConfig) {
      return 'triggers' in fieldConfig && UTILS.isFunc(fieldConfig.triggers)
        ? fieldConfig.triggers(this)
        : {};
    },
    componentToRender(fieldConfig) {
      const fieldType = fieldConfig.type || 'text';
      if ('component' in fieldConfig && fieldConfig.component && UTILS.isStr(fieldConfig.component)) {
        return fieldConfig.component;
      }
      const component = this.formComponents.find(({ type }) => type.includes(fieldType));
      const componentName = component && component.compData? component.compData.name : '';
      !componentName &&
        console.error(
          `Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`
        );
      return componentName;
    },
    fieldIsDisabled(fieldConfig) {
      const DISABLED = true;
      const hasDisabledProp = fieldConfig && fieldConfig.props && "disabled" in fieldConfig.props;
      const fieldDisabled =
        hasDisabledProp
          ? UTILS.handlefuncOrBool(fieldConfig.props.disabled, this)
          : !DISABLED;
      return !this.editable || fieldDisabled? DISABLED : !DISABLED;
    },
    fieldIsRequired(name, config) {
      const REQUIRED = true;
      const fieldName = name || config.model;
      const fieldConfig = config || this.findFieldConfig(fieldName);
      const hasRequiredProp = fieldConfig && fieldConfig.props && 'required' in fieldConfig.props;
      const fieldRequired =
        hasRequiredProp
          ? UTILS.handlefuncOrBool(fieldConfig.props.required, this)
          : !this.isHelperComponent(fieldName);
      return fieldConfig && !this.fieldIsDisabled(fieldConfig) && this.fieldIsVisible(fieldConfig)
        ? fieldRequired
        : !REQUIRED;
    },
    validateField(fieldName) {
      const SUCCESS = [true, ""];
      const fieldConfig = this.findFieldConfig(fieldName);
      const fieldRequired = this.fieldIsRequired(null, fieldConfig);
      const fieldRule = fieldConfig.rules || {};
      const fieldActiveValidation = 'activeValidation' in fieldConfig ? Boolean(fieldConfig.activeValidation) : this.activeValidation;

      const [valid, error] =
        this.submit || fieldActiveValidation
          ? VALIDATION_ENGINE(
              fieldName,
              this.fields[fieldName],
              fieldRule,
              this.validationRules,
              { ...this.fields },
              this.submit
            )
          : SUCCESS;

      !fieldRequired
        ? !this.submit && this.setError(fieldName, error)
        : this.setError(fieldName, error);
      this.logs &&
        console.log(
          `model:${fieldName}\n`,
          `value:${this.fields[fieldName]}\n`,
          `type:${typeof this.fields[fieldName]}\n`,
          `valid:${valid}\n`,
          `required:${fieldRequired}\n`,
          `error:${error}`
        );
      return valid;
    },
    async handleSubmit() {
      this.submit = true;
      const formValidationStatus = {};
      this.removeUnwantedFields();
      
      Object.keys(this.fields).forEach((fieldName) => {
        formValidationStatus[fieldName] = this.validateField(fieldName) || !this.fieldIsRequired(fieldName);
      });

      const submitFail = Object.keys(formValidationStatus).find(fieldName => !formValidationStatus[fieldName]);
      
      if(this.logs) {
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
</script>
