<template>
  <form :class="[CLASS.form]" @submit.prevent="handleSubmit">
    <!-- header section -->
    <div :class="[CLASS.header]">
      <slot :name="SLOT.header" />
    </div>
    <!-- body -->
    <div :class="[CLASS.body]">
      <template v-for="(fieldConfig, i) in fieldsConfig">
        <!-- ROW -->
        <div
          v-if="
            UTILS.isArr(fieldConfig) && fieldConfig.length ||
            (fieldIsVisible(fieldConfig) && componentToRender(fieldConfig))
          "
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
        
          <!-- IF ARRAY THEN CREATE MULTIPLE COLUMNS IN A ROW -->
          <template v-if="UTILS.isArr(fieldConfig)">
            <template v-for="subFieldConfig in fieldConfig">
              <div
                :key="subFieldConfig.model"
                v-show="
                  fieldIsVisible(subFieldConfig) &&
                  componentToRender(subFieldConfig)
                "
                :class="[
                  CLASS.col,
                  subFieldConfig.model,
                  classes.col,
                ]"
              >
                <template>
                  <slot :name="SLOT.beforeComponent(subFieldConfig.model)" />
                  <!-- COMPONENT -->
                  <component
                    :is="componentToRender(subFieldConfig)"
                    v-model="fields[subFieldConfig.model]"
                    v-bind="componentProps(subFieldConfig)"
                    v-on="componentEvents(subFieldConfig)"
                  >
                    <slot :name="subFieldConfig.model" />
                  </component>
                  <slot :name="SLOT.afterComponent(subFieldConfig.model)" />
                </template>
              </div>
            </template>
          </template>

          <!-- IF NOT AN ARRAY THEN CREATES A COLUMN -->
          <template v-else>
            <div
              :key="fieldConfig.model"
              v-show="
                fieldIsVisible(fieldConfig) &&
                componentToRender(fieldConfig)
              "
              :class="[
                CLASS.col,
                fieldConfig.model,
                classes.col,
              ]"
            >
              <template>
                <slot :name="SLOT.beforeComponent(fieldConfig.model)" />
                <!-- COMPONENT -->
                <component
                  :is="componentToRender(fieldConfig)"
                  v-model="fields[fieldConfig.model]"
                  v-bind="componentProps(fieldConfig)"
                  v-on="componentEvents(fieldConfig)"
                >
                  <slot :name="fieldConfig.model" />
                </component>
                <slot :name="SLOT.afterComponent(fieldConfig.model)" />
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- footer section -->
    <div :class="CLASS.footer">
      <slot :name="SLOT.footer" />
    </div>
  </form>
</template>

<script>
import props from './main/mixins/props';
import VALIDATION_ENGINE from "./main/validation-engine";
import UTILS from './main/utils';
import {SLOT, CLASS, SCHEMA, VMODEL, FIELD} from './main/utils/constants';
export default {
  mixins: [props],
  data() {
    const INIT = true; 
    let fields = {};
    let errors = {};
    const addFieldsAndErrors = model => {
        // on init if v-model has values then validate and apply those values.
        fields[model] = this.vModelValid(INIT) && VMODEL.values in this.value ? this.value.values[model]: '';
        errors[model] = this.vModelValid(INIT) && VMODEL.errors in this.value ? this.value.errors[model]: '';
    }
    if (SCHEMA.fields in this.schema && UTILS.isArr(this.schema.fields) && this.schema.fields.length) {
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
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS,
    activeValidation() {
      return SCHEMA.activeValidation in this.schema
        ? this.schema[SCHEMA.activeValidation]
        : false;
    },
    activeValidationDelay() {
      const hasActiveValidationDelay = SCHEMA.activeValidationDelay in this.schema && this.schema[SCHEMA.activeValidationDelay] && !isNaN(this.schema[SCHEMA.activeValidationDelay]);
      return this.activeValidation && hasActiveValidationDelay? this.schema[SCHEMA.activeValidationDelay] : false;
    },
    logs() {
      return SCHEMA.logs in this.schema ? this.schema[SCHEMA.logs] : false;
    },
    fieldsConfig() {
      return SCHEMA.fields in this.schema && UTILS.isArr(this.schema[SCHEMA.fields])
        ? this.schema[SCHEMA.fields]
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
    deValidateField() {
      return UTILS.debounce((fieldName) => {
        this.validateField(fieldName)
      }, this.activeValidationDelay);
    },
  },
  watch: {
    disabled: {
      handler: function(newVal) {
        newVal && this.removeAllErrors();
      },
    },
    value: {
      handler: function() {
        if (this.vModelValid()) {
          for (const fieldName in this.value[VMODEL.values]) {
            this.fields[fieldName] = this.value[VMODEL.values][fieldName];
            this.errors[fieldName] = this.value[VMODEL.errors][fieldName];
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
    for (const fieldName in this.fields) {
      this.$watch(`fields.${fieldName}`, function (newVal, oldVal) {
        // for number type field.
        this.toNum(fieldName);
        // this.updateHelpers(fieldName, newVal);

        // to prevent below calls when only type is changed and not value.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        this.activeValidationDelay ? this.deValidateField(fieldName) : this.validateField(fieldName);
      }, {deep:true});
    }
  },
  methods: {
    vModelValid(init = false) {
      const parentValid =  this.value && UTILS.isObjNotArr(this.value);
      const valValid = VMODEL.values in this.value && UTILS.isObjNotArr(this.value[VMODEL.values]);
      const errValid = VMODEL.errors in this.value && UTILS.isObjNotArr(this.value[VMODEL.errors]); 
      if(init) {
        return parentValid && valValid;
      }
      return parentValid && valValid && errValid;
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
    findComponentData(name) {
      return this.formComponents.find(
        c => c.compData && c.compData.name === name
      );
    },
    componentProps(fieldConfig) {
      const componentName = this.componentToRender(fieldConfig);
      const component = this.findComponentData(componentName);
      const errorPropName = fieldConfig.errorProp  || component && component.compData.errorProp ||  'error';
      return {
        ...fieldConfig.props,
        [errorPropName]: this.errors[fieldConfig.model],
        ref: fieldConfig.model,
        type: fieldConfig.type || FIELD.type.text,
        disabled: this.fieldDisabled(fieldConfig),
        required: this.fieldRequired(null,fieldConfig)
      };
    },
    toNum(fieldName) {
      if(!isNaN(this.fields[fieldName])) {
        return;
      }
      const fieldConfig = this.findFieldConfig(fieldName);
      fieldConfig &&
        fieldConfig.type === FIELD.type.number &&
        this.fields[fieldName] &&
        (this.fields[fieldName] = Number(this.fields[fieldName]));
    },
    componentEvents(fieldConfig) {
      return FIELD.events in fieldConfig && UTILS.isFunc(fieldConfig[FIELD.events])
        ? fieldConfig[FIELD.events](this)
        : {};
    },
    componentToRender(fieldConfig) {
      const fieldType = fieldConfig.type || FIELD.type.text;
      if (FIELD.component in fieldConfig && fieldConfig[FIELD.component] && UTILS.isStr(fieldConfig[FIELD.component])) {
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
    findFieldConfig(fieldName) {
      return this.fieldsConfigFlat.find((conf) => conf.model === fieldName);
    },
    fieldDisabled(fieldConfig) {
      const DISABLED = true;
      const hasDisabledProp = fieldConfig && fieldConfig.props && FIELD.props.disabled in fieldConfig.props;
      const fieldDisabled =
        hasDisabledProp
          ? UTILS.handlefuncOrBool(fieldConfig.props[FIELD.props.disabled])
          : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldRequired(name, config = null) {
      const REQUIRED = true;
      const fieldName = name || config.model;
      const fieldConfig = config || this.findFieldConfig(fieldName);
      const hasRequiredProp = fieldConfig && fieldConfig.props && FIELD.props.required in fieldConfig.props;
      const fieldRequired =
        hasRequiredProp
          ? UTILS.handlefuncOrBool(fieldConfig.props[FIELD.props.required]) : REQUIRED;
          // : !this.isHelperComponent(fieldName);
      return fieldConfig && !this.fieldDisabled(fieldConfig) && this.fieldIsVisible(fieldConfig)
        ? fieldRequired
        : !REQUIRED;
    },
    removeUnwantedFields() {
      const uf = Object.keys(this.fields).filter(fieldName => !this.fieldsConfigFlat.find(({model}) => model === fieldName));
      uf.forEach(fieldName => {
        delete this.fields[fieldName];
        delete this.errors[fieldName];
      })
    },
    fieldIsVisible(fieldConfig) {
      const VISIBLE = true
      const fieldVisible =
        FIELD.show in fieldConfig
          ? UTILS.handlefuncOrBool(fieldConfig[FIELD.show])
          : VISIBLE;
      // !fieldVisible && this.setDefaultFieldValue(fieldConfig);
      return fieldVisible;
    },
    validateField(fieldName) {
      const SUCCESS = [true, ""];
      const fieldConfig = this.findFieldConfig(fieldName);
      const fieldRequired = this.fieldRequired(null, fieldConfig);
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
        formValidationStatus[fieldName] = this.validateField(fieldName) || !this.fieldRequired(fieldName);
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
