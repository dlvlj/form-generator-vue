<template>
  <component
    :is="componentName(schema.form)"
    v-model="form"
    v-bind="componentProps(schema.form, {form: schema.form})"
    :class="[CLASS.form]"
    v-on="componentEvents(schema.form, {form: schema.form})"
  >
    <!-- header -->
    <div :class="[CLASS.header]">
      <slot :name="SLOT.header" />
    </div>
    <!-- body -->
    <div :class="[CLASS.body]">
      <template v-for="(conf, i) in allFieldsArray">
        <Row
          v-if="showRow(conf)"
          :key="i"
          :models="slotProps(conf)"
          :classes="classes"
        >
          <!-- single column -->
          <template v-if="!UTILS.isArr(conf)">
            <Column
              v-if="showCol(conf)"
              :key="conf.model"
              :models="slotProps(conf)"
              :classes="classes"
            >
              <component
                :is="componentName(conf)"
                v-model="fields[conf.model]"
                v-bind="componentProps(conf, {field: true})"
                v-on="componentEvents(conf)"
              >
                <slot :name="conf.model" />
              </component>
            </Column>
          </template>
          <!-- multiple columns -->
          <template
            v-for="(subConf) in conf"
            v-else
          >
            <Column
              v-if="showCol(subConf)"
              :key="subConf.model"
              :models="slotProps(conf)"
              :classes="classes"
            >
              <component
                :is="componentName(subConf)"
                v-model="fields[subConf.model]"
                v-bind="componentProps(subConf, {field: true})"
                v-on="componentEvents(subConf)"
              >
                <slot :name="subConf.model" />
              </component>
            </Column>
          </template>
        </Row>
      </template>
    </div>
    <!-- footer -->
    <div :class="CLASS.footer">
      <slot :name="SLOT.footer" />
    </div>
  </component>
</template>

<script>
import Row from './main/components/Row.vue';
import Column from './main/components/Column.vue';
import props from './main/mixins/props';
import constants from './main/mixins/constants';
import UTILS from './main/utils';
import {
  SCHEMA, VMODEL, FIELD,
} from './main/utils/constants';

export default {
  components: {
    Row,
    Column
  },
  mixins: [props, constants],
  emits: ['input'],
  data() {
    const fields = {};
    const errors = {};

    const addFieldsAndErrors = (model) => {
      fields[model] = this.value?.[VMODEL.fields]?.[model] || '';
      errors[model] = this.value?.[VMODEL.errors]?.[model] || '';
    };

    for (const fieldConf of this.schema[SCHEMA.fields]) {
      if (UTILS.isArr(fieldConf)) {
        for (const subFieldConf of fieldConf) {
          addFieldsAndErrors(subFieldConf.model);
        }
        // break;
      } else { addFieldsAndErrors(fieldConf.model); }
    }

    return {
      form: this.value?.form,
      fields,
      errors,
      submit: false,
    };
  },
  computed: {
    // SLOT: () => SLOT,
    // CLASS: () => CLASS,
    // UTILS: () => UTILS,
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

    allFieldsFlatObj() {
      const obj = {};
      for (const fieldConf of this.allFieldsArray) {
        if (UTILS.isArr(fieldConf)) {
          for (const subFieldConf of fieldConf) {
            obj[subFieldConf.model] = subFieldConf;
          }
          // break;
        } else { obj[fieldConf.model] = fieldConf; }
      }
      return obj;
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
        for (const model in this.value?.[VMODEL.fields]) {
          this.fields[model] = this.value?.[VMODEL.fields]?.[model];
          this.errors[model] = this.value?.[VMODEL.errors]?.[model];
        }
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
    for (const model in this.fields) {
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
    }
    // Object.keys(this.fields).forEach((model) => {
    //   const fieldConf = this.fieldConf(model);
    //   this.$watch(`fields.${model}`, (newVal, oldVal) => {
    //     this.typeCoercion(fieldConf);
    //     // when only data type is changed.
    //     if (newVal == oldVal && typeof newVal !== typeof oldVal) {
    //       return;
    //     }
    //     // this.validate(fieldConf, true);
    //     this.validateField(fieldConf);
    //   }, { deep: true });
    // });
  },
  methods: {
    logger(items) {
      if (this.logs) { console.log(...items); }
    },
    emitData() {
      this.$emit('input', { form: this.form, [VMODEL.fields]: { ...this.fields }, [VMODEL.errors]: { ...this.errors } });
    },
    resetForm() {
      this.submit = false;
    },
    showRow(fieldConf) {
      return UTILS.isArr(fieldConf)
        ? fieldConf.length && fieldConf.some((conf) => this.showCol(conf))
        : this.showCol(fieldConf);
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
      for (const model in this.errors) {
        this.errors[model] = '';
      }
    },
    setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }
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
    componentEvents(conf, options = {}) {
      const { form } = options;
      const e = conf?.[FIELD.vOn] || {};
      if (form) {
        e.submit = conf?.vOn?.submit || this.handleSubmit;
      }
      return e;
    },
    componentName(fieldConf) {
      if (fieldConf?.vBind?.is) {
        return fieldConf?.vBind?.is;
      }
      const componentData = this.components
        .find(({ types }) => types.includes(fieldConf?.vBind?.type));
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
    runFieldRules(rules, val) {
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
      return res;
    },
    validateField(fieldConf) {
      const NO_ERR = '';
      // const fieldRequired = this.fieldRequired(fieldConf);
      const err = this.submit || fieldConf?.[FIELD.av] || this.globalAv
        ? this.runFieldRules(fieldConf?.[FIELD.rules], this.fields[fieldConf.model])
        : NO_ERR;
      // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);
      this.setError(fieldConf.model, err);
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
      // Object.values(this.allFieldsFlatObj).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });
      for (const model in this.allFieldsFlatObj) {
        const conf = this.allFieldsFlatObj[model];
        const err = this.validateField(conf);
        fieldsStatus[conf.model] = {
          // validationSuccess: !err ? true : !this.fieldRequired(conf),
          validationSuccess: !err,
          schema: conf
        };
      }
      const submitFail = Object.keys(fieldsStatus).find(
        (model) => !fieldsStatus[model].validationSuccess
      );
      return { fieldsStatus, submitFail };
    },
    async handleSubmit(e) {
      e.preventDefault();
      this.submit = true;
      const { fieldsStatus, submitFail } = this.validateForm();
      this.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus]);
      if (submitFail) {
        this.resetForm();
        if (UTILS.isFunc(this.onSubmitFail)) {
          await this.onSubmitFail();
        }
        return;
      }
      if (UTILS.isFunc(this.onSubmit)) {
        await this.onSubmit();
        this.resetForm();
      }
    },
  },
};
</script>
