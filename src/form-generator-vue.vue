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
      <template v-for="(conf, i) in schema[SCHEMA.fields]">
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
import tempLiterals from './main/mixins/tempLiterals';
import UTILS from './main/utils';
import {
  SCHEMA, VMODEL, FIELD,
} from './main/utils/constants';

export default {
  components: {
    Row,
    Column
  },
  mixins: [props, tempLiterals],
  emits: ['input'],
  data() {
    const form = this.value?.form;
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
      } else { addFieldsAndErrors(fieldConf.model); }
    }

    return {
      form,
      fields,
      errors,
      submitClick: false,
    };
  },
  computed: {
    // SLOT: () => SLOT,
    // CLASS: () => CLASS,
    // UTILS: () => UTILS,
    // globalAv() {
    //   return this.activeValidation || false;
    // },
    // globalAvDelay() {
    //   return this.activeValidationDelay || 0;
    // },
    // allFieldsArray() {
    //   return UTILS.isArr(this.schema?.[SCHEMA.fields])
    //     ? this.schema[SCHEMA.fields]
    //     : [];
    // },

    fieldsFlat() {
      const flat = {};
      for (const conf of this.schema[SCHEMA.fields]) {
        if (UTILS.isArr(conf)) {
          for (const subConf of conf) {
            flat[subConf.model] = subConf;
          }
        } else { flat[conf.model] = conf; }
      }
      return flat;
    },
    // debounceValidateField() {
    //   return UTILS.debounce((model) => {
    //     this.validateField(model);
    //   });
    // },
  },
  watch: {
    // disabled: {
    //   handler() {
    //     this.removeAllErrors();
    //   },
    // },
    value: {
      handler() {
        for (const model in this.value?.[VMODEL.fields]) {
          this.fields[model] = this.value?.[VMODEL.fields]?.[model];
          this.errors[model] = this.value?.[VMODEL.errors]?.[model];
        }
      },
      deep: true,
    },
    form: {
      handler: 'emitData',
      deep: true,
      immediate: true,
    },
    fields: {
      handler: 'emitData',
      deep: true,
      immediate: true,
    },
    errors: {
      handler: 'emitData',
      deep: true,
      immediate: true,
    },
  },
  created() {
    // fields watcher
    for (const model in this.fields) {
      const conf = this.getFieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(conf);
        // when only data type is changed.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        // this.validate(fieldConf, true);
        this.validateField(conf);
      }, { deep: true });
    }
    // Object.keys(this.fields).forEach((model) => {
    //   const fieldConf = this.getFieldConf(model);
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
    emitData() {
      this.$emit('input', { form: this.form, [VMODEL.fields]: { ...this.fields }, [VMODEL.errors]: { ...this.errors } });
    },
    resetForm() {
      this.submitClick = false;
    },
    showRow(conf) {
      return UTILS.isArr(conf)
        ? conf.length && conf.some((c) => this.showCol(c))
        : this.showCol(conf);
    },
    showCol(conf) {
      return this.componentName(conf) && !this.fieldHidden(conf);
    },
    slotProps(conf) {
      if (UTILS.isArr(conf)) {
        return conf.map(({ model }) => model);
      }
      return [conf.model];
    },
    componentProps(conf, options = {}) {
      const { form, field } = options;
      // const cName = this.componentName(conf);
      const componentData = this.componentData(this.componentName(conf));
      // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;
      const p = {
        ...conf?.vBind,
        disabled: this.schema?.form?.vBind?.disabled || conf?.disabled
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
    // removeAllErrors() {
    //   for (const model in this.errors) {
    //     this.errors[model] = '';
    //   }
    // },
    setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }

      // prop is not rmoved from errors if set undefined
      this.errors[model] = !UTILS.isUndef(err) ? err : '';
    },
    componentData(name) {
      return this.components.find(
        (c) => c?.name === name,
      );
    },
    typeCoercion(conf) {
      if (this.fields[conf.model] && conf?.vBind?.type === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }
        this.fields[conf.model] = Number(this.fields[conf.model]);
      }
      // if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
      //   return;
      // }
      // if (fieldConf?.vBind?.type === FIELD.type.number && this.fields[fieldConf.model]) {
      //   this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      // }
    },
    componentEvents(conf, options = {}) {
      const { form } = options;
      const e = conf?.[FIELD.vOn] || {};
      if (form) {
        e.submit = conf?.vOn?.submit
        || (this.submit && this.handleSubmit)
        || ((ev) => { ev?.preventDefault(); UTILS.logger(['submit handler not present.\n'], { warn: true, show: this.logs }); });
      }
      return e;
    },
    componentName(conf) {
      if (conf?.vBind?.is) {
        return conf?.vBind?.is;
      }
      const cData = this.components
        .find(({ types }) => types.includes(conf?.vBind?.type));
      return cData?.name;
    },
    getFieldConf(model) {
      return this.fieldsFlat[model];
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
    fieldHidden(conf) {
      const HIDDEN = true;
      return conf?.vBind
       && FIELD.vBind.hidden in conf.vBind
        ? conf.vBind?.[FIELD.vBind.hidden]
        : !HIDDEN;
    },
    runFieldRules(val, rules) {
      let res;
      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          res = rule;
          if (UTILS.isFunc(rule)) {
            res = UTILS.handleFunc(rule, val);
          }
          if (![undefined, null, true].includes(res)) {
            break;
          }
        }
      }
      return res;
    },
    validateField(conf) {
      const NO_ERR = '';
      // const fieldRequired = this.fieldRequired(fieldConf);
      const err = conf?.[FIELD.av] || this.activeValidation || this.submitClick
        ? this.runFieldRules(this.fields[conf.model], conf?.[FIELD.rules])
        : NO_ERR;
      // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);
      this.setError(conf.model, err);
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
      // Object.values(this.fieldsFlat).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });
      for (const model in this.fieldsFlat) {
        const conf = this.fieldsFlat[model];
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
      e?.preventDefault();
      this.submitClick = true;
      const { fieldsStatus, submitFail } = this.validateForm();
      UTILS.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus], { show: this.logs });
      if (submitFail) {
        this.resetForm();
        if (this.submitFail) {
          await this.submitFail();
        }
        return;
      }
      await this.submit();
      this.resetForm();
    },
  },
};
</script>
