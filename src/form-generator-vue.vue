<template>
  <form :class="[CLASS.form]" @submit.prevent="handleSubmit">
    <!-- header -->
    <div :class="[CLASS.header]">
      <slot :name="SLOT.header" />
    </div>
    <!-- body -->
    <div :class="[CLASS.body]">
      <template v-for="(schema, i) in fieldsSchema">
        <!-- ROW -->
        <div
          v-if="hasFields(schema) || isfield(schema)"
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
        
          <!-- IF HAS FIELDS -->
          <template v-if="UTILS.isArr(schema)">
            <template v-for="s in schema">
              <div
                :key="s.model"
                v-show="isfield(s)"
                :class="[
                  CLASS.col,
                  s.model,
                  classes.col,
                ]"
              >
                <template>
                  <slot :name="SLOT.beforeComponent(s.model)" />
                  <!-- COMPONENT -->
                  <component
                    :is="componentToRender(s)"
                    v-model="fields[s.model]"
                    v-bind="componentProps(s)"
                    v-on="componentEvents(s)"
                  >
                    <slot :name="s.model" />
                  </component>
                  <slot :name="SLOT.afterComponent(s.model)" />
                </template>
              </div>
            </template>
          </template>

          <!-- IF IS FIELD -->
          <template v-else>
            <div
              :key="schema.model"
              v-show="isfield(schema)"
              :class="[
                CLASS.col,
                schema.model,
                classes.col,
              ]"
            >
              <template>
                <slot :name="SLOT.beforeComponent(schema.model)" />
                <!-- COMPONENT -->
                <component
                  :is="componentToRender(schema)"
                  v-model="fields[schema.model]"
                  v-bind="componentProps(schema)"
                  v-on="componentEvents(schema)"
                >
                  <slot :name="schema.model" />
                </component>
                <slot :name="SLOT.afterComponent(schema.model)" />
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- footer -->
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
        fields[model] = this.vModelValid(INIT) && VMODEL.values in this.value && this.value[VMODEL.values][model] || '';
        errors[model] = this.vModelValid(INIT) && VMODEL.errors in this.value && this.value[VMODEL.errors][model] || '';
    }
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
    fieldsSchema() {
      return SCHEMA.fields in this.schema && UTILS.isArr(this.schema[SCHEMA.fields])
        ? this.schema[SCHEMA.fields]
        : [];
    },
    fieldsSchemaFlat() {
      let flatSchema = [];
      for (const schema of this.fieldsSchema) {
        if (UTILS.isArr(schema)) {
          for(const s of schema) {
            flatSchema.push(s);
          }
        } else {
          flatSchema.push(schema);
        }
      }
      return flatSchema;
    },
    deValidateField() {
      return UTILS.debounce((model) => {
        this.validateField(model)
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
          for (const model in this.value[VMODEL.values]) {
            this.fields[model] = this.value[VMODEL.values][model];
            this.errors[model] = this.value[VMODEL.errors][model];
          }
        }
      },
      deep: true,
    },
    fields: {
      handler: function() {
        this.rmUnwantedModels();
        this.$emit("input", { values: this.fields, errors: this.errors });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    for (const model in this.fields) {
      this.$watch(`fields.${model}`, function (newVal, oldVal) {
        // for number type field.
        this.typeCoercion(model);
        // this.updateHelpers(model, newVal);

        // to prevent below calls when only type is changed and not value.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        this.activeValidationDelay ? this.deValidateField(model) : this.validateField(model);
      }, {deep:true});
    }
  },
  methods: {
    hasFields(schema) {
      return UTILS.isArr(schema) && schema.length
    },
    isfield(schema) {
     return !this.fieldHidden(schema) && this.componentToRender(schema)
    },
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
      for (const model in this.errors) {
        this.errors[model] = "";
      }
    },
    setError(model, e) {
      const oldErr = this.errors[model];
      if(oldErr === e || (UTILS.isObj(e,oldErr) && JSON.stringify(e) === JSON.stringify(oldErr))) {
        return;
      }
      this.errors[model] = e;
    },
    findComponentData(name) {
      return this.formComponents.find(
        c => c.compData && c.compData.name === name
      );
    },
    componentProps(schema) {
      const componentName = this.componentToRender(schema);
      const component = this.findComponentData(componentName);
      const errorPropName = schema.errorProp  || component && component.compData.errorProp ||  'error';
      return {
        ...schema.props,
        [errorPropName]: this.errors[schema.model],
        ref: schema.model,
        type: schema.type || FIELD.type.text,
        disabled: this.fieldDisabled(schema),
        required: this.fieldRequired(null,schema)
      };
    },
    typeCoercion(model) {
      if(!isNaN(this.fields[model])) {
        return;
      }
      const schema = this.findSchema(model);
      schema &&
        schema.type === FIELD.type.number &&
        this.fields[model] &&
        (this.fields[model] = Number(this.fields[model]));
    },
    componentEvents(schema) {
      return FIELD.events in schema && UTILS.isFunc(schema[FIELD.events])
        ? schema[FIELD.events](this)
        : {};
    },
    componentToRender(schema) {
      const fieldType = schema.type || FIELD.type.text;
      if (FIELD.component in schema && schema[FIELD.component] && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }
      const component = this.formComponents.find(({ type }) => type.includes(fieldType));
      const componentName = component && component.compData? component.compData.name : '';
      !componentName &&
        console.error(
          `Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`
        );
      return componentName;
    },
    findSchema(m) {
      return this.fieldsSchemaFlat.find(({model}) => m === model);
    },
    fieldDisabled(schema) {
      const DISABLED = true;
      const hasDisabledProp = schema && schema.props && FIELD.props.disabled in schema.props;
      const fieldDisabled =
        hasDisabledProp
          ? UTILS.handlefuncOrBool(schema.props[FIELD.props.disabled])
          : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldRequired(m, s = null) {
      const REQUIRED = true;
      const model = m || s.model;
      const schema = s || this.findSchema(model);
      const hasRequiredProp = schema && schema.props && FIELD.props.required in schema.props;
      const fieldRequired =
        hasRequiredProp
          ? UTILS.handlefuncOrBool(schema.props[FIELD.props.required]) : REQUIRED;
          // : !this.isHelperComponent(model);
      return schema && !this.fieldDisabled(schema) && !this.fieldHidden(schema)
        ? fieldRequired
        : !REQUIRED;
    },
    rmUnwantedModels() {
      const uf = Object.keys(this.fields).filter(m => !this.fieldsSchemaFlat.find(({model}) => m === model));
      uf.forEach(model => {
        delete this.fields[model];
        delete this.errors[model];
      })
    },
    fieldHidden(schema) {
      const HIDDEN = true;
      const fieldHidden =
        FIELD.hide in schema
          ? UTILS.handlefuncOrBool(schema[FIELD.hide])
          : !HIDDEN;
      // !fieldVisible && this.setDefaultFieldValue(schema);
      return fieldHidden;
    },
    validateField(model) {
      const SUCCESS = [true, ""];
      const schema = this.findSchema(model);
      const fieldRequired = this.fieldRequired(null, schema);
      const fieldRule = schema.rules || {};
      const fieldActiveValidation = FIELD.activeValidation in schema ? Boolean(schema[FIELD.activeValidation]) : this.activeValidation;

      const [valid, error] =
        this.submit || fieldActiveValidation
          ? VALIDATION_ENGINE(
              model,
              this.fields[model],
              fieldRule,
              this.validationRules,
              { ...this.fields },
              this.submit
            )
          : SUCCESS;

      !fieldRequired
        ? !this.submit && this.setError(model, error)
        : this.setError(model, error);
      this.logs &&
        console.log({
          model,
          value: this.fields[model],
          type:typeof this.fields[model],
          valid,
          required:fieldRequired,
          error
        });
      return valid;
    },
    async handleSubmit() {
      this.submit = true;
      const formValidationStatus = {};
      this.rmUnwantedModels();
      
      Object.keys(this.fields).forEach((model) => {
        formValidationStatus[model] = this.validateField(model) || !this.fieldRequired(model);
      });

      const submitFail = Object.keys(formValidationStatus).find(model => !formValidationStatus[model]);
      
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
