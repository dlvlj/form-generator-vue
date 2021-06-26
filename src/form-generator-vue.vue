<template>
  <component
    :is="componentName(schema.form)"
    v-model="form"
    v-bind="componentProps(schema.form, {form: true})"
    :class="classes([CLASS.form])"
    v-on="componentEvents(schema.form, {form: true})"
  >
    <!-- header -->
    <slot :name="SLOT.header" />

    <!-- body -->
    <Body :class="classes([CLASS.body])">
      <template v-for="(conf, i) in schema.fields">
        <RowContainer
          v-if="showRow(conf)"
          :key="i"
          :class="classes([CLASS.rowContainer, `${CLASS.rowContainer}-${i + 1}`])"
        >
          <slot
            :name="SLOT.beforeRow"
            :models="slotProps(conf)"
          />
          <Row
            :class="classes([CLASS.row, `${CLASS.row}-${i + 1}`])"
          >
            <slot
              :name="SLOT.rowStart"
              :models="slotProps(conf)"
            />
            <!-- single column -->
            <template v-if="!UTILS.isArr(conf)">
              <ColumnContainer
                v-if="showCol(conf)"
                :key="conf.model"
                :class="classes([
                  CLASS.colContainer,
                  `${CLASS.colContainer}-${conf.model}`
                ])"
              >
                <slot
                  :name="SLOT.beforeCol"
                  :models="slotProps(conf)"
                />
                <Column
                  :class="classes([
                    CLASS.col,
                    `${CLASS.col}-${conf.model}`,
                    conf.model,
                  ])"
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
                </Column>
                <slot
                  :name="SLOT.afterCol"
                  :models="slotProps(conf)"
                />
              </ColumnContainer>
            </template>
            <!-- multiple columns -->
            <template
              v-for="(subConf) in conf"
              v-else
            >
              <ColumnContainer
                v-if="showCol(subConf)"
                :key="subConf.model"
                :class="classes([
                  CLASS.colContainer,
                  `${CLASS.colContainer}-${subConf.model}`
                ])"
              >
                <slot
                  :name="SLOT.beforeCol"
                  :models="slotProps(subConf)"
                />
                <Column
                  :class="classes([
                    CLASS.col,
                    `${CLASS.col}-${subConf.model}`,
                    subConf.model,
                  ])"
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
                </Column>
                <slot
                  :name="SLOT.afterCol"
                  :models="slotProps(subConf)"
                />
              </ColumnContainer>
            </template>
            <slot
              :name="SLOT.rowEnd"
              :models="slotProps(conf)"
            />
          </Row>
          <slot
            :name="SLOT.afterRow"
            :models="slotProps(conf)"
          />
        </RowContainer>
      </template>
    </Body>

    <!-- footer -->
    <slot :name="SLOT.footer" />
  </component>
</template>

<script>
import Div from './main/components/Div.vue';
import props from './main/mixins/props';
import UTILS from './main/utils';
import {
  SCHEMA, VMODEL, FIELD, SLOT, CLASS, canSetErr
} from './main/utils/constants';

export default {
  components: {
    Body: Div,
    RowContainer: Div,
    Row: Div,
    ColumnContainer: Div,
    Column: Div
  },
  mixins: [props],
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
      // submitClick: false,
    };
  },
  computed: {
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS,
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
      this.$watch(`fields.${model}`, () => {
        // this.typeCoercion(conf);
        // when only data type is changed.
        // if (newVal == oldVal && typeof newVal !== typeof oldVal) {
        //   return;
        // }
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
  mounted() {
    if (this?.schema?.options?.onLoadValidation) {
      this.validate();
    }
  },
  methods: {
    classes(classArr, subArr = false) {
      return classArr.reduce((acc, c) => {
        if (this?.schema?.class?.[c]) {
          acc.push(...this.schema.class[c]);
          const ar = this.schema.class[c]
            .filter((cl) => Object.keys(this?.schema?.class).includes(cl));
          if (ar.length) {
            acc.push(...this.classes(ar, true));
          }
        }
        return acc;
      },
      !subArr ? [...classArr] : []);
    },
    emitData() {
      const formModel = UTILS.isStr(this?.schema?.form?.model)
        ? this?.schema?.form?.model : undefined;
      const valid = !Object.keys(this.errors)
        .find((e) => this.errors[e] && !this.fieldHidden(this.fieldsFlat[e]));
      // console.log(valid, errorField);
      // && this.fieldHidden(this.fieldsFlat[errorField]);
      this.$emit('input', {
        ...(formModel ? { [formModel]: this.form } : {}),
        valid,
        [VMODEL.fields]: this.fields,
        [VMODEL.errors]: this.errors
      });
    },
    // resetForm() {
    //   this.submitClick = false;
    // },
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
      const { form } = options;
      // const cName = this.componentName(conf);
      // const componentData = this.componentData(this.componentName(conf));
      // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;
      const p = {
        ...conf?.props,
        // disabled: this.schema?.form?.props?.disabled || conf?.disabled
      };
      if (form) {
        p.is = conf?.props?.is || 'form';
      }
      // if (field) {
      //   if (componentData?.errorProp) { p[componentData.errorProp] = this.errors[conf.model]; }
      //   p.type = conf?.props?.type || FIELD.type.text;
      // }
      return p;
    },
    resetValidation() {
      for (const model in this.errors) {
        this.errors[model] = '';
      }
    },
    reset() {
      for (const model in this.fields) {
        this.fields[model] = '';
        this.errors[model] = '';
      }
    },
    setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }

      // prop is not rmoved from errors if set undefined
      this.errors[model] = canSetErr(err) ? err : '';
    },
    // componentData(name) {
    //   return this.components.find(
    //     (c) => c?.name === name,
    //   );
    // },
    // typeCoercion(conf) {
    //   if (this.fields[conf.model] && conf?.props?.type === FIELD.type.number) {
    //     if (!Number.isNaN(this.fields[conf.model])) {
    //       return;
    //     }
    //     this.fields[conf.model] = Number(this.fields[conf.model]);
    //   }
    //   // if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
    //   //   return;
    //   // }
    //   // if (fieldConf?.vBind?.type === FIELD.type.number && this.fields[fieldConf.model]) {
    //   //   this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
    //   // }
    // },
    componentEvents(conf, options = {}) {
      const { form } = options;
      const e = conf?.[FIELD.on] || {};
      if (form) {
        e.submit = conf?.on?.submit
        // || (this.submit && this.handleSubmit)
        || ((ev) => { ev?.preventDefault(); UTILS.logger(['submit handler not present.\n'], { warn: true, show: this?.schema?.options?.logs }); });
      }
      return e;
    },
    componentName(conf) {
      // if (conf?.props?.is || conf?.tag) {
      return conf?.props?.is || conf?.tag;
      // }
      // const cData = this.components
      //   .find(({ types }) => types.includes(conf?.props?.type));
      // return cData?.name;
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
      return conf?.props
       && FIELD.props.hidden in conf.props
        ? Boolean(conf.props?.[FIELD.props.hidden])
        : !HIDDEN;
    },
    runFieldRules(val, rules) {
      let err;
      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          err = rule;
          if (UTILS.isFunc(rule)) {
            err = rule(val);
          }
          if (canSetErr(err)) {
            break;
          }
        }
      }
      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }
      return err;
    },
    validateField(conf, formValidating) {
      // const fieldRequired = this.fieldRequired(fieldConf);
      const av = FIELD.av in conf
        ? conf?.[FIELD.av] : this?.schema?.options?.activeValidation;

      const err = (formValidating || av)
       && this.runFieldRules(this.fields[conf.model], this?.schema?.rules?.[conf.model]);
      // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);
      this.setError(conf.model, err);
      // return err;
    },
    validate() {
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
      // const fieldsStatus = {};
      // Object.values(this.fieldsFlat).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });
      // const fieldsStatus = {};
      for (const model in this.fields) {
        // const conf = this.fieldsFlat[model];
        this.validateField(this.fieldsFlat?.[model], true);
        // fieldsStatus[conf.model] = {
        //   valid: !this.errors[model],
        //   hidden: this.fieldHidden(conf),
        //   schema: conf
        // };
      }
      // const valid = !Object.keys(fieldsStatus).find(
      //   (model) => !fieldsStatus[model].valid && !fieldsStatus[model].hidden
      // );
      // return { valid, fieldsStatus };
    },
    // async handleSubmit(e) {
    //   e?.preventDefault();
    //   // this.submitClick = true;
    //   const { fieldsStatus, submitFail } = this.validateForm();
    //   UTILS.
    // logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`,
    //  fieldsStatus], { show: this?.schema?.options?.logs });
    //   if (submitFail) {
    //     if (this.submitFail) {
    //       await this.submitFail();
    //     }
    //     // this.resetForm();
    //     return;
    //   }
    //   await this.submit();
    //   // this.resetForm();
    // },
  },
};
</script>
