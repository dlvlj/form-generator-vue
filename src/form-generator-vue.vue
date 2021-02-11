<template>
  <form :class="[CLASS.form]" @submit.prevent="handleSubmit">
    <!-- header -->
    <div :class="[CLASS.header]">
      <slot :name="SLOT.header" />
    </div>
    <!-- body -->
    <div :class="[CLASS.body]">
      <template v-for="(schema, i) in fieldsSchema">
        <slot v-if="showRow(schema)" :name="SLOT.beforeRow" :model="getModelFromSchema(schema)"/>
        <!-- ROW -->
        <div
          v-if="showRow(schema)"
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
          <!-- COL -->
          <template v-if="!UTILS.isArr(schema)">
            <slot v-if="showCol(schema)" :name="SLOT.beforeCol" :model="getModelFromSchema(schema)"/>
              <div
                :key="schema.model"
                v-if="showCol(schema)"
                :class="[
                  CLASS.col,
                  schema.model,
                  classes.col,
                ]"
              >
                <slot :name="SLOT.beforeComponent(schema.model)" />
                <component
                  :is="componentToRender(schema)"
                  v-model="fields[schema.model]"
                  v-bind="componentProps(schema)"
                  v-on="componentEvents(schema)"
                >
                  <slot :name="schema.model" />
                </component>
                <slot :name="SLOT.afterComponent(schema.model)" />
              </div>
            <slot v-if="showCol(schema)" :name="SLOT.afterCol" :model="getModelFromSchema(schema)"/>
          </template>

          <!-- MULTIPLE COLS -->
          <template v-else>
            <template v-for="s in schema">
              <slot v-if="showCol(s)" :name="SLOT.beforeCol" :model="getModelFromSchema(s)"/>
              <div
                :key="s.model"
                v-if="showCol(s)"
                :class="[
                  CLASS.col,
                  s.model,
                  classes.col,
                ]"
              >
                <slot :name="SLOT.beforeComponent(s.model)" />
                <component
                  :is="componentToRender(s)"
                  v-model="fields[s.model]"
                  v-bind="componentProps(s)"
                  v-on="componentEvents(s)"
                >
                  <slot :name="s.model" />
                </component>
                <slot :name="SLOT.afterComponent(s.model)" />
              </div>
              <slot v-if="showCol(s)" :name="SLOT.afterCol" :model="getModelFromSchema(s)"/>
            </template>
          </template>
        </div>
        <slot v-if="showRow(schema)" :name="SLOT.afterRow" :model="getModelFromSchema(schema)"/>
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
import slotProps from './main/mixins/slot-props';
import UTILS from './main/utils';
import {SLOT, CLASS, SCHEMA, VMODEL, FIELD} from './main/utils/constants';
export default {
  mixins: [props, slotProps],
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
      const hasActiveValidationDelay = SCHEMA.avDelay in this.schema && this.schema[SCHEMA.avDelay] && !isNaN(this.schema[SCHEMA.avDelay]);
      return this.activeValidation && hasActiveValidationDelay? this.schema[SCHEMA.avDelay] : false;
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
    showRow(schema) {
      return this.hasFieldsToRender(schema) || this.showCol(schema);
    },
    hasFieldsToRender(schema) {
      return UTILS.isArr(schema) && schema.length && schema.some(s => !this.fieldHidden(s));
    },
    showCol(schema) {
     return this.componentToRender(schema) && !this.fieldHidden(schema);
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
        c => c && c.name === name
      );
    },
    componentProps(schema) {
      const componentName = this.componentToRender(schema);
      const component = this.findComponentData(componentName);
      const errorPropName = schema && schema.rules && schema.rules.errorProp  || component && component.errorProp ||  'error';
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
        ? UTILS.handleFunc(schema[FIELD.events])
        : {};
    },
    componentToRender(schema) {
      const fieldType = schema.type || FIELD.type.text;
      if (FIELD.component in schema && schema[FIELD.component] && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }
      const component = this.formComponents.find(({ type }) => type.includes(fieldType));
      const componentName = component && component.name;
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
          ? UTILS.handleFuncOrBool(schema.props[FIELD.props.disabled])
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
          ? UTILS.handleFuncOrBool(schema.props[FIELD.props.required]) : REQUIRED;
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
          ? UTILS.handleFuncOrBool(schema[FIELD.hide])
          : !HIDDEN;
      // !fieldVisible && this.setDefaultFieldValue(schema);
      return fieldHidden;
    },
    validateField(model) {
      const VALID = true;
      const schema = this.findSchema(model);
      const fieldRequired = this.fieldRequired(null, schema);
      const validator = schema.rules && schema.rules.validator;
      const fieldActiveValidation = FIELD.activeValidation in schema ? Boolean(schema[FIELD.activeValidation]) : this.activeValidation;

      const error =
        this.submit || fieldActiveValidation
          ? UTILS.handleFunc(validator) || ''
          : VALID;
      
      const valid = !error ? VALID : Boolean(error);

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

      const submitFail = Object.keys(formValidationStatus).find(model => !formValidationStatus[model]) || Object.values(this.errors).find(e => e);
      
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
