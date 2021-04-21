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
          :models="slotProps(conf)"
        />
        <!-- ROW -->
        <div
          v-if="showRow(conf)"
          :key="i"
          :class="[CLASS.row, classes.row]"
        >
          <slot
            :name="SLOT.rowStart"
            :models="slotProps(conf)"
          />
          <div :class="[CLASS.colContainer]">
            <!-- COL -->
            <template v-if="!UTILS.isArr(conf)">
              <slot
                v-if="showCol(conf)"
                :name="SLOT.beforeCol"
                :models="slotProps(conf)"
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
                :models="slotProps(conf)"
              />
            </template>

            <!-- MULTIPLE COLS -->
            <template v-else>
              <template v-for="subConf in conf">
                <slot
                  v-if="showCol(subConf)"
                  :name="SLOT.beforeCol"
                  :models="slotProps(subConf)"
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
                  :models="slotProps(subConf)"
                />
              </template>
            </template>
          </div>
          <slot
            :name="SLOT.rowEnd"
            :models="slotProps(conf)"
          />
        </div>
        <slot
          v-if="showRow(conf)"
          :name="SLOT.afterRow"
          :models="slotProps(conf)"
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
        this.emitData();
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
    emitData() {
      this.$emit('input', { [VMODEL.fields]: { ...this.fields }, [VMODEL.errors]: { ...this.errors } });
    },
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
      if (UTILS.isArr(fieldConf)) {
        return fieldConf.map(({ model }) => model);
      }
      return [fieldConf.model];
    },
    componentProps(fieldConf) {
      const componentName = this.componentName(fieldConf);
      const componentData = this.componentData(componentName);
      // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      const errorPropName = componentData?.errorProp;
      return {
        ...(errorPropName ? { [errorPropName]: this.errors[fieldConf.model] } : {}),
        ...fieldConf.vBind,
        type: fieldConf?.vBind?.type || FIELD.type.text,
      };
    },
    removeAllErrors() {
      Object.keys(this.errors).forEach((model) => {
        this.errors[model] = '';
      });
    },
    setError(model, err, noErr) {
      if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
        this.errors[model] = noErr;
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
      if (fieldConf?.vBind?.type === FIELD.type.number && this.fields[fieldConf.model]) {
        this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      }
    },
    componentEvents(fieldConf) {
      return UTILS.isObj(fieldConf?.[FIELD.vOn])
        ? fieldConf?.[FIELD.vOn]
        : {};
    },
    componentName(fieldConf) {
      const fieldType = fieldConf?.vBind?.type || FIELD.type.text;
      const component = this.components.find(({ types }) => types.includes(fieldType));
      const componentName = fieldConf?.vBind?.is || component?.name;
      return componentName;
    },
    fieldConf(model) {
      return this.allFieldsFlatObj[model];
    },
    fieldDisabled(fieldConf) {
      const DISABLED = true;
      const fieldDisabled = fieldConf?.vBind
       && FIELD.vBind.disabled in fieldConf.vBind
        ? fieldConf.vBind?.[FIELD.vBind.disabled]
        : !DISABLED;
      return this.disabled || fieldDisabled;
    },
    fieldRequired(fieldConf) {
      const REQUIRED = true;
      if (fieldConf?.[FIELD.rules]) {
        return REQUIRED;
      }
      return fieldConf?.vBind && FIELD.vBind.required in fieldConf.vBind
        ? Boolean(fieldConf?.vBind?.[FIELD.vBind.required]) : !REQUIRED;
    },
    fieldHidden(fieldConf) {
      const HIDDEN = true;
      return fieldConf?.vBind
       && FIELD.vBind.hidden in fieldConf.vBind
        ? fieldConf.vBind?.[FIELD.vBind.hidden]
        : !HIDDEN;
    },
    runRules(rules, val) { // valid return values: string, bool
      let res;
      // eslint-disable-next-line no-restricted-syntax
      for (const rule in rules) {
        if (UTILS.isFunc(rule)) {
          res = UTILS.handleFunc(rules, val);
        } else { res = rule; }

        if (!res) {
          break;
        }
      }
      return res;
    },
    fieldValidation(fieldConf) {
      const NO_ERR = '';
      const fieldRequired = this.fieldRequired(fieldConf);
      const err = this.submit || fieldConf?.[FIELD.av] || this.globalAv
        ? this.runRules(fieldConf?.[FIELD.rules], this.fields[fieldConf.model], NO_ERR)
        : NO_ERR;

      if (!fieldRequired) {
        if (!this.submit) this.setError(fieldConf.model, err);
      } else this.setError(fieldConf.model, err);

      if (this.logs && this.submit) {
        console.log(fieldConf.model, {
          value: this.fields[fieldConf.model],
          valid: !err,
          required: fieldRequired,
          error: err,
        });
      }
      return err;
    },
    validate(fieldConf = undefined, isWatcher = false) {
      // for handling watcher on all fields
      if (fieldConf && isWatcher) {
        const fieldAv = fieldConf[FIELD.av] || this.globalAv;
        const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

        if (fieldAv && fieldAvDelay) {
          this.debounceValidateField(fieldAvDelay)(fieldConf);
        } else this.fieldValidation(fieldConf);

        return;
      }
      // for form submit
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
