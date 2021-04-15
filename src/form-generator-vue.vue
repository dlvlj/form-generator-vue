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
      <template v-for="(conf, i) in allFieldsArray">
        <slot
          v-if="showRow(conf)"
          :name="SLOT.beforeRow"
          :model="slotProps(conf)"
        />
        <!-- ROW -->
        <div
          v-if="showRow(conf)"
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
          <!-- COL -->
          <template v-if="!UTILS.isArr(conf)">
            <slot
              v-if="showCol(conf)"
              :name="SLOT.beforeCol"
              :model="slotProps(conf)"
            />
            <div
              v-if="showCol(conf)"
              :key="conf.model"
              :class="[
                CLASS.col,
                conf.model,
                classes.col,
              ]"
            >
              <slot :name="SLOT.beforeComponent(conf.model)" />
              <component
                :is="componentName(conf)"
                v-model="fields[conf.model]"
                v-bind="componentProps(conf)"
                v-on="componentEvents(conf)"
              >
                <slot :name="conf.model" />
              </component>
              <slot :name="SLOT.afterComponent(conf.model)" />
            </div>
            <slot
              v-if="showCol(conf)"
              :name="SLOT.afterCol"
              :model="slotProps(conf)"
            />
          </template>

          <!-- MULTIPLE COLS -->
          <template v-else>
            <template v-for="subConf in conf">
              <slot
                v-if="showCol(subConf)"
                :name="SLOT.beforeCol"
                :model="slotProps(subConf)"
              />
              <div
                v-if="showCol(subConf)"
                :key="subConf.model"
                :class="[
                  CLASS.col,
                  subConf.model,
                  classes.col,
                ]"
              >
                <slot :name="SLOT.beforeComponent(subConf.model)" />
                <component
                  :is="componentName(subConf)"
                  v-model="fields[subConf.model]"
                  v-bind="componentProps(subConf)"
                  v-on="componentEvents(subConf)"
                >
                  <slot :name="subConf.model" />
                </component>
                <slot :name="SLOT.afterComponent(subConf.model)" />
              </div>
              <slot
                v-if="showCol(subConf)"
                :name="SLOT.afterCol"
                :model="slotProps(subConf)"
              />
            </template>
          </template>
        </div>
        <slot
          v-if="showRow(conf)"
          :name="SLOT.afterRow"
          :model="slotProps(conf)"
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
    const fields = {};
    const errors = {};
    const schemaValid = this.schemaValid();
    const addFieldsAndErrors = (model) => {
      fields[model] = this.value?.[VMODEL.fields]?.[model] || '';
      errors[model] = this.value?.[VMODEL.errors]?.[model] || '';
    };

    if (schemaValid) {
      this.schema[SCHEMA.fields].forEach((fieldConf) => {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach((subFieldConf) => {
            addFieldsAndErrors(subFieldConf.model);
          });
        } else {
          addFieldsAndErrors(fieldConf.model);
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
    globalAv() {
      return this.activeValidation || false;
    },
    globalAvDelay() {
      return this.activeValidationDelay || 0;
    },
    allFieldsArray() {
      return UTILS.isArr(this.schema?.[SCHEMA.fields])
        ? this.schema[SCHEMA.fields]
        : [];
    },
    allFieldsFlatArray() {
      const arr = [];
      this.allFieldsArray.forEach((fieldConf) => {
        if (UTILS.isArr(fieldConf)) {
          fieldConf.forEach((subFieldConf) => {
            arr.push(subFieldConf);
          });
        } else {
          arr.push(fieldConf);
        }
      });
      return arr;
    },
    allFieldsFlatObj() {
      const obj = this.allFieldsFlatArray.map((fieldConf) => [fieldConf.model, fieldConf]);
      return Object.fromEntries(obj);
    },
    debounceValidateField() {
      return UTILS.debounce((model) => {
        this.fieldValidation(model);
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
        Object.keys(this.value?.[VMODEL.fields] || {}).forEach((model) => {
          this.fields[model] = this.value?.[VMODEL.fields]?.[model];
          this.errors[model] = this.value?.[VMODEL.errors]?.[model];
        });
      },
      deep: true,
    },
    fields: {
      handler() {
        this.$emit('input', { [VMODEL.fields]: this.fields, [VMODEL.errors]: this.errors });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    Object.keys(this.fields).forEach((model) => {
      const fieldConf = this.fieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(fieldConf);
        // when only data type is changed.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        this.validate(fieldConf, true);
      }, { deep: true });
    });
  },
  methods: {
    resetForm() {
      this.submit = false;
    },
    schemaValid() {
      return UTILS.isArr(this.schema?.[SCHEMA.fields]) && this.schema?.[SCHEMA.fields]?.length;
    },
    showRow(fieldConf) {
      return UTILS.isArr(fieldConf) ? this.showCols(fieldConf) : this.showCol(fieldConf);
    },
    showCols(fieldConf) {
      return fieldConf.length && fieldConf.some((conf) => this.showCol(conf));
    },
    showCol(fieldConf) {
      return this.componentName(fieldConf) && !this.fieldHidden(fieldConf);
    },
    slotProps(fieldConf) {
      if (UTILS.isArr()) {
        return fieldConf.map(({ model }) => model);
      }
      return fieldConf.model;
    },
    componentProps(fieldConf) {
      const componentName = this.componentName(fieldConf);
      const component = this.componentData(componentName);
      const errorPropName = fieldConf?.errorProp || component?.errorProp || 'errorMessages';
      return {
        ...fieldConf.props,
        type: fieldConf.type || FIELD.type.text,
        [errorPropName]: this.errors[fieldConf.model]
      };
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
    componentData(name) {
      return this.components.find(
        (component) => component?.name === name,
      );
    },
    typeCoercion(fieldConf) {
      if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
        return;
      }
      if (fieldConf?.type === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },
    componentEvents(fieldConf) {
      return UTILS.isObj(fieldConf?.[FIELD.events])
        ? fieldConf?.[FIELD.events]
        : {};
    },
    componentName(fieldConf) {
      const fieldType = fieldConf?.type || FIELD.type.text;
      if (UTILS.isStr(fieldConf?.[FIELD.component])) {
        return fieldConf?.[FIELD.component];
      }
      const component = this.components.find(({ types }) => types.includes(fieldType));
      const componentName = component?.name;
      if (!componentName) {
        console.error(
          `Component cannot be rendered. Component for type "${fieldType}" is not found in components prop.`,
        );
      }
      return componentName;
    },
    fieldConf(model) {
      return this.allFieldsFlatObj[model];
    },
    fieldDisabled(fieldConf) {
      const DISABLED = true;
      const hasDisabledProp = UTILS.isObj(fieldConf?.props)
       && FIELD.props.disabled in fieldConf.props;
      const fieldDisabled = hasDisabledProp
        ? UTILS.handleFuncOrBool(fieldConf.props[FIELD.props.disabled])
        : !DISABLED;
      return this.disabled || fieldDisabled;
    },
    fieldRequired(fieldConf) {
      const REQUIRED = true;
      const hasRequiredProp = fieldConf?.props && FIELD.props.required in fieldConf.props;
      const fieldRequired = hasRequiredProp
        ? UTILS.handleFuncOrBool(fieldConf.props[FIELD.props.required]) : !REQUIRED;
      // return fieldConf && !this.fieldDisabled(fieldConf) && !this.fieldHidden(fieldConf)
      //   ? fieldRequired
      //   : !REQUIRED;
      return fieldRequired;
    },
    fieldHidden(fieldConf) {
      const HIDDEN = true;
      const hasHiddenProp = UTILS.isObj(fieldConf?.props)
       && FIELD.props.hidden in fieldConf.props;
      const fieldHidden = hasHiddenProp
        ? UTILS.handleFuncOrBool(fieldConf.props[FIELD.props.hidden])
        : !HIDDEN;
      return fieldHidden;
    },
    fieldValidation(fieldConf) {
      const NO_ERROR = '';
      const fieldRequired = this.fieldRequired(fieldConf);
      const validator = fieldConf?.validator;
      const avField = fieldConf?.[FIELD.av] || this.globalAv;
      const error = this.submit || avField
        ? UTILS.handleFunc(validator) || NO_ERROR
        : NO_ERROR;

      if (!fieldRequired) {
        if (!this.submit) this.setError(fieldConf.model, error);
      } else this.setError(fieldConf.model, error);

      if (this.logs) {
        console.log(fieldConf.model, {
          value: this.fields[fieldConf.model],
          valid: !error,
          required: fieldRequired,
          error,
        });
      }
      return error;
    },
    validate(fieldConf = undefined, isWatcher = false) {
      // for watcher
      if (fieldConf && isWatcher) {
        const fieldAv = fieldConf[FIELD.av] || this.globalAv;
        const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

        if (fieldAv && fieldAvDelay) {
          this.debounceValidateField(fieldAvDelay)(fieldConf);
        } else this.fieldValidation(fieldConf);

        return;
      }
      // for submit
      const validationsStatus = {};
      Object.values(this.allFieldsFlatObj).forEach((conf) => {
        const err = this.fieldValidation(conf);
        validationsStatus[conf.model] = !err ? true : !this.fieldRequired(conf);
      });
      const submitFail = Object.keys(validationsStatus).find((model) => !validationsStatus[model]);
      return { validationsStatus, submitFail };
    },
    async handleSubmit() {
      this.submit = true;
      const { validationsStatus, submitFail } = this.validate();
      if (this.logs) {
        console.log('form validations:', validationsStatus);
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
