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
    };
  },
  computed: {
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS,
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
    valid() {
      return !Object.keys(this.errors)
        .find((e) => this.errors[e] && !this.fieldHidden(this.fieldsFlat[e]));
    }
  },
  watch: {
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
    for (const model in this.fields) {
      const conf = this.getFieldConf(model);
      this.$watch(`fields.${model}`, () => {
        this.validateField(conf);
      }, { deep: true });
    }
  },
  mounted() {
    if (this?.options?.onLoadValidation) {
      this.validate();
    }
  },
  methods: {
    classes(classArr, subArr = false) {
      return classArr.reduce((acc, c) => {
        if (this?.schema?.class?.[c]) {
          acc.push(...this.schema.class[c]);
          const ar = this.schema.class[c]
            .filter((cl) => Object.keys(this?.classes).includes(cl));
          if (ar.length) {
            acc.push(...this.classes(ar, true));
          }
        }
        return acc;
      },
      !subArr ? [...classArr] : []);
    },
    emitData() {
      const formModel = this?.schema?.form?.model;
      this.$emit('input', {
        ...(formModel ? { [formModel]: this.form } : {}),
        [VMODEL.fields]: this.fields,
        [VMODEL.errors]: this.errors
      });
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
      const { form } = options;
      const p = {
        ...conf?.props,
      };
      if (form) {
        p.is = conf?.props?.is || 'form';
      }
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
      this.errors[model] = canSetErr(err) ? err : '';
    },
    componentEvents(conf, options = {}) {
      const { form } = options;
      const e = conf?.[FIELD.on] || {};
      if (form) {
        e.submit = conf?.on?.submit
        || ((ev) => { ev?.preventDefault(); UTILS.logger(['submit handler not present.\n'], { warn: true, show: this?.options?.logs }); });
      }
      return e;
    },
    componentName(conf) {
      return conf?.props?.is || conf?.tag;
    },
    getFieldConf(model) {
      return this.fieldsFlat[model];
    },
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
      const av = FIELD.av in conf
        ? conf?.[FIELD.av] : this?.options?.activeValidation;

      const err = (formValidating || av)
       && this.runFieldRules(this.fields[conf.model], this?.rules?.[conf.model]);
      this.setError(conf.model, err);
    },
    validate() {
      for (const model in this.fields) {
        this.validateField(this.fieldsFlat?.[model], true);
      }
    },
  },
};
</script>
