<template>
  <form
    :class="[CLASS.form]"
    @submit.prevent="handleSubmit"
  >
    <!-- header -->
    <div :class="[CLASS.header]">
      <slot :name="SLOT.header" />
    </div>
    <!-- body -->
    <div :class="[CLASS.body]">
      <template v-for="(schema, i) in fieldsSchema">
        <slot
          v-if="showRow(schema)"
          :name="SLOT.beforeRow"
          :model="slotProps(schema)"
        />
        <!-- ROW -->
        <div
          v-if="showRow(schema)"
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
          <!-- COL -->
          <template v-if="!UTILS.isArr(schema)">
            <slot
              v-if="showCol(schema)"
              :name="SLOT.beforeCol"
              :model="slotProps(schema)"
            />
            <div
              v-if="showCol(schema)"
              :key="schema.model"
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
            <slot
              v-if="showCol(schema)"
              :name="SLOT.afterCol"
              :model="slotProps(schema)"
            />
          </template>

          <!-- MULTIPLE COLS -->
          <template v-else>
            <template v-for="s in schema">
              <slot
                v-if="showCol(s)"
                :name="SLOT.beforeCol"
                :model="slotProps(s)"
              />
              <div
                v-if="showCol(s)"
                :key="s.model"
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
              <slot
                v-if="showCol(s)"
                :name="SLOT.afterCol"
                :model="slotProps(s)"
              />
            </template>
          </template>
        </div>
        <slot
          v-if="showRow(schema)"
          :name="SLOT.afterRow"
          :model="slotProps(schema)"
        />
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
import UTILS from './main/utils';
import {
  SLOT, CLASS, SCHEMA, VMODEL, FIELD,
} from './main/utils/constants';

export default {
  mixins: [props],
  emits: ['input'],
  data() {
    const init = true;
    const fields = {};
    const errors = {};
    const vModelValid = this.vModelValid(init);
    const schemaValid = UTILS.isArr(this.schema?.[SCHEMA.fields])
     && this.schema[SCHEMA.fields].length;

    const addFieldsAndErrors = (model) => {
      fields[model] = (vModelValid && this.value[VMODEL.values]?.[model]) || '';
      errors[model] = (vModelValid && this.value[VMODEL.errors]?.[model]) || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach((fieldsSchema) => {
        if (UTILS.isArr(fieldsSchema)) {
          fieldsSchema.forEach((schema) => {
            addFieldsAndErrors(schema.model);
          });
        } else {
          addFieldsAndErrors(fieldsSchema.model);
        }
      });
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
    avGlobal() {
      return this.activeValidation || false;
    },
    avDelayGlobal() {
      return this.activeValidationDelay || 0;
    },
    fieldsSchema() {
      return UTILS.isArr(this.schema?.[SCHEMA.fields])
        ? this.schema[SCHEMA.fields]
        : [];
    },
    fieldsSchemaFlat() {
      const flatSchema = [];
      this.fieldsSchema.forEach((schema) => {
        if (UTILS.isArr(schema)) {
          schema.forEach((s) => {
            flatSchema.push(s);
          });
        } else {
          flatSchema.push(schema);
        }
      });
      return flatSchema;
    },
    fieldsSchemaMap() {
      const schemaMap = this.fieldsSchemaFlat.map((s) => [s.model, s]);
      return Object.fromEntries(schemaMap);
    },
    debValidateField() {
      return UTILS.debounce((model) => {
        this.validateField(model);
      });
    },
  },
  watch: {
    disabled: {
      handler(newVal) {
        if (newVal) this.removeAllErrors();
      },
    },
    value: {
      handler() {
        if (this.vModelValid()) {
          Object.keys(this.value[VMODEL.values]).forEach((model) => {
            this.fields[model] = this.value[VMODEL.values][model];
            this.errors[model] = this.value[VMODEL.errors][model];
          });
        }
      },
      deep: true,
    },
    fields: {
      handler() {
        this.rmUnwantedModels();
        this.$emit('input', { values: this.fields, errors: this.errors });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    Object.keys(this.fields).forEach((model) => {
      const schema = this.findSchema(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(schema);
        // when only data type is changed.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        // validation ---------------------------
        this.validate(schema, true);
      }, { deep: true });
    });
  },
  methods: {
    slotProps(schema) {
      if (UTILS.isArr()) {
        return schema.map(({ model }) => model);
      }
      return schema.model;
    },
    validate(schema = undefined, watcher = false) {
      // for watcher
      if (schema && watcher) {
        const avField = schema[FIELD.av] || this.avGlobal;
        const avDelayField = schema[FIELD.avDelay] || this.avDelayGlobal;

        if (avField && avDelayField) {
          this.debValidateField(avDelayField)(schema);
        } else this.validateField(schema);
        return;
      }
      // for submit
      const valStatus = {};
      Object.values(this.fieldsSchemaMap).forEach((s) => {
        const err = this.validateField(s);
        valStatus[s.model] = !err ? true : !this.fieldRequired(s);
      });
      const submitFail = Object.keys(valStatus).find((k) => !valStatus[k]);
      return { valStatus, submitFail };
    },
    showRow(schema) {
      return this.hasFieldsToRender(schema) || this.showCol(schema);
    },
    hasFieldsToRender(schema) {
      return UTILS.isArr(schema) && schema.length && schema.some((s) => !this.fieldHidden(s));
    },
    showCol(schema) {
      return this.componentToRender(schema) && !this.fieldHidden(schema);
    },
    vModelValid(init = false) {
      const parentValid = this.value && UTILS.isObjNotArr(this.value);
      const valValid = UTILS.isObjNotArr(this.value?.[VMODEL.values]);
      const errValid = UTILS.isObjNotArr(this.value?.[VMODEL.errors]);
      if (init) {
        return parentValid && valValid;
      }
      return parentValid && valValid && errValid;
    },
    resetForm() {
      this.submit = false;
    },
    removeAllErrors() {
      Object.keys(this.errors).forEach((model) => {
        this.errors[model] = '';
      });
    },
    setError(model, err) {
      const oldErr = this.errors[model];
      if (oldErr === err
        || (UTILS.isObj([oldErr, err]) && JSON.stringify(oldErr) === JSON.stringify(err))
      ) {
        return;
      }
      this.errors[model] = err;
    },
    findComponentData(name) {
      return this.components.find(
        (c) => c && c.name === name,
      );
    },
    componentProps(schema) {
      const componentName = this.componentToRender(schema);
      const component = this.findComponentData(componentName);
      const errorPropName = schema?.errorProp || component?.errorProp || 'errorMessages';
      return {
        ...schema.props,
        [errorPropName]: this.errors[schema.model],
        ref: schema.model,
        type: schema.type || FIELD.type.text,
        disabled: this.fieldDisabled(schema),
        required: this.fieldRequired(schema),
      };
    },
    typeCoercion(schema) {
      if (!Number.isNaN(Number(this.fields[schema.model]))) {
        return;
      }
      if (schema?.type === FIELD.type.number && this.fields[schema.model]) {
        this.fields[schema.model] = Number(this.fields[schema.model]);
      }
    },
    componentEvents(schema) {
      return UTILS.isObj(schema?.[FIELD.events])
        ? schema[FIELD.events]
        : {};
    },
    componentToRender(schema) {
      const fieldType = schema.type || FIELD.type.text;
      if (schema?.[FIELD.component] && UTILS.isStr(schema[FIELD.component])) {
        return schema.component;
      }
      const component = this.components.find(({ type }) => type.includes(fieldType));
      const componentName = component?.name;
      if (!componentName) {
        console.error(
          `Component cannot be rendered. Component for type "${fieldType}" is not found in form-components.`,
        );
      }
      return componentName;
    },
    findSchema(m) {
      return this.fieldsSchemaMap[m];
    },
    fieldDisabled(schema) {
      const DISABLED = true;
      const hasDisabledProp = UTILS.isObj(schema?.props) && FIELD.props.disabled in schema.props;
      const fieldDisabled = hasDisabledProp
        ? UTILS.handleFuncOrBool(schema.props[FIELD.props.disabled])
        : !DISABLED;
      return this.disabled || fieldDisabled ? DISABLED : !DISABLED;
    },
    fieldRequired(schema) {
      const REQUIRED = true;
      const hasRequiredProp = schema && schema.props && FIELD.props.required in schema.props;
      const fieldRequired = hasRequiredProp
        ? UTILS.handleFuncOrBool(schema.props[FIELD.props.required]) : !REQUIRED;
      return schema && !this.fieldDisabled(schema) && !this.fieldHidden(schema)
        ? fieldRequired
        : !REQUIRED;
    },
    rmUnwantedModels() {
      const um = Object.keys(this.fields)
        .filter((m) => !this.fieldsSchemaFlat.find(({ model }) => m === model));

      um.forEach((model) => {
        delete this.fields[model];
        delete this.errors[model];
      });
    },
    fieldHidden(schema) {
      const HIDDEN = true;
      const fieldHidden = FIELD.hide in schema
        ? UTILS.handleFuncOrBool(schema[FIELD.hide])
        : !HIDDEN;
      return fieldHidden;
    },
    validateField(schema) {
      const NO_ERROR = '';
      const fieldRequired = this.fieldRequired(schema);
      const validator = schema?.validator;
      const avField = schema?.[FIELD.av] || this.avGlobal;
      const error = this.submit || avField
        ? UTILS.handleFunc(validator)
        : NO_ERROR;
      const valid = !error ? !NO_ERROR : Boolean(error);

      if (!fieldRequired) {
        if (!this.submit) this.setError(schema.model, error);
      } else this.setError(schema.model, error);
      // !fieldRequired
      //   ? !this.submit && this.setError(schema.model, error)
      //   : this.setError(schema.model, error);

      if (this.logs) {
        console.log({
          model: schema.model,
          value: this.fields[schema.model],
          type: typeof this.fields[schema.model],
          valid,
          required: fieldRequired,
          error,
        });
      }
      return valid;
    },
    async handleSubmit() {
      this.submit = true;
      this.rmUnwantedModels();
      const { valStatus, submitFail } = this.validate();
      if (this.logs) {
        console.log('form validations:', valStatus);
      }
      if (submitFail) {
        this.resetForm();
        await this.onSubmitFail();
        return;
      }
      await this.onSubmit();
      this.resetForm();
    },
  },
};
</script>
