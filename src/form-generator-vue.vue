<template>
  <component
    :is="componentName(schema.form)"
    v-bind="componentProps(schema.form, {form: schema.form})"
    :class="[CLASS.form]"
    v-on="componentEvents(schema.form)"
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
                  v-bind="componentProps(conf, {field: true})"
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
                    v-bind="componentProps(subConf, {field: true})"
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
  </component>
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
          return;
        }
        addFieldsAndErrors(fieldConf.model);
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
    // globalAvDelay() {
    //   return this.activeValidationDelay || 0;
    // },
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
          return;
        }
        arr.push(fieldConf);
      });
      return arr;
    },
    allFieldsFlatObj() {
      return Object.fromEntries(
        this.allFieldsFlatArray.map((fieldConf) => [fieldConf.model, fieldConf])
      );
    },
    // debounceValidateField() {
    //   return UTILS.debounce((model) => {
    //     this.validateField(model);
    //   });
    // },
  },
  watch: {
    disabled: {
      handler() {
        this.removeAllErrors();
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
        // this.validate(fieldConf, true);
        this.validateField(fieldConf);
      }, { deep: true });
    });
  },
  methods: {
    logger(items) {
      if (this.logs) { console.log(...items); }
    },
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
    componentProps(conf, options = {}) {
      const { form, field } = options;
      const componentName = this.componentName(conf, options);
      const componentData = this.componentData(componentName);
      // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;
      const p = {
        ...conf?.vBind,
        disabled: Boolean(this.disabled || conf?.disabled)
      };
      if (form) {
        p.is = conf?.vBind?.is || 'form';
      }
      if (field) {
        if (componentData?.errorProp) { p[componentData.errorProp] = this.errors[conf.model]; }
        p.type = conf?.vBind?.type || FIELD.type.text;
      }
      return p;
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
      if (fieldConf?.vBind?.is) {
        return fieldConf?.vBind?.is;
      }
      const componentType = fieldConf?.vBind?.type;
      const componentData = this.components.find(({ types }) => types.includes(componentType));
      return componentData?.name;
    },
    fieldConf(model) {
      return this.allFieldsFlatObj[model];
    },
    // fieldDisabled(fieldConf) {
    //   const DISABLED = true;
    //   const fieldDisabled = fieldConf?.vBind
    //    && FIELD.vBind.disabled in fieldConf.vBind
    //     ? fieldConf.vBind?.[FIELD.vBind.disabled]
    //     : !DISABLED;
    //   return this.disabled || fieldDisabled;
    // },
    // fieldRequired(fieldConf) {
    //   const REQUIRED = true;
    //   return fieldConf?.vBind && FIELD.vBind.required in fieldConf.vBind
    //     ? Boolean(fieldConf?.vBind?.[FIELD.vBind.required]) : !REQUIRED;
    // },
    fieldHidden(fieldConf) {
      const HIDDEN = true;
      return fieldConf?.vBind
       && FIELD.vBind.hidden in fieldConf.vBind
        ? fieldConf.vBind?.[FIELD.vBind.hidden]
        : !HIDDEN;
    },
    runFieldRules(noErr, rules, val) {
      let res;
      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          res = rule;
          if (UTILS.isFunc(rule)) {
            res = UTILS.handleFunc(rule, val);
          }
          if (UTILS.isStr(res)) {
            break;
          }
        }
      }
      return UTILS.isStr(res) ? res : noErr;
    },
    validateField(fieldConf) {
      const NO_ERR = '';
      // const fieldRequired = this.fieldRequired(fieldConf);
      const err = this.submit || fieldConf?.[FIELD.av] || this.globalAv
        ? this.runFieldRules(NO_ERR, fieldConf?.[FIELD.rules], this.fields[fieldConf.model])
        : NO_ERR;
      // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);
      this.setError(fieldConf.model, err, NO_ERR);
      return err;
    },
    validateForm() {
      // watcher handler
      // if (fieldConf && isWatcher) {
      // const fieldAv = fieldConf[FIELD.av] || this.globalAv;
      // const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;

      // if (fieldAv && fieldAvDelay) {
      //   this.debounceValidateField(fieldAvDelay)(fieldConf);
      // } else this.validateField(fieldConf);

      // this.validateField(fieldConf);

      // return;
      // }
      // watcher handler end

      // On form submit
      const fieldsStatus = {};
      Object.values(this.allFieldsFlatObj).forEach((conf) => {
        const err = this.validateField(conf);
        fieldsStatus[conf.model] = {
          // validationSuccess: !err ? true : !this.fieldRequired(conf),
          validationSuccess: !err,
          schema: conf
        };
      });
      const submitFail = Object.keys(fieldsStatus).find(
        (model) => !fieldsStatus[model].validationSuccess
      );
      return { fieldsStatus, submitFail };
    },
    async handleSubmit() {
      this.submit = true;
      const { fieldsStatus, submitFail } = this.validateForm();
      this.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus]);
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
