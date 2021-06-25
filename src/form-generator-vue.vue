<script>
import props from './main/mixins/props';
import UTILS from './main/utils';
import {
  SCHEMA, VMODEL, FIELD, SLOT, CLASS
} from './main/utils/constants';

export default {
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
    // fields watcher
    for (const model in this.fields) {
      const conf = this.getFieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(conf);
        // when only data type is changed.
        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        }
        this.validateField(conf);
      }, { deep: true });
    }
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
      this.$emit('input', {
        ...(formModel ? { [formModel]: this.form } : {}),
        valid,
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
    canSetErr: (v) => (v && !['boolean'].includes(typeof v)) || (!v && ['string', 'boolean'].includes(typeof v)),
    setError(model, err) {
      this.errors[model] = this.canSetErr(err) ? err : '';
    },
    typeCoercion(conf) {
      if (this.fields[conf.model] && conf?.props?.type === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }
        this.fields[conf.model] = Number(this.fields[conf.model]);
      }
    },
    componentEvents(conf, options = {}) {
      const { form } = options;
      const e = conf?.[FIELD.on] || {};
      if (form) {
        e.submit = conf?.on?.submit
        || ((ev) => { ev?.preventDefault(); UTILS.logger(['submit handler not present.\n'], { warn: true, show: this?.schema?.options?.logs }); });
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
          if (this.canSetErr(err)) {
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
        ? conf?.[FIELD.av] : this?.schema?.options?.activeValidation;

      const err = (formValidating || av)
       && this.runFieldRules(this.fields[conf.model], this?.schema?.rules?.[conf.model]);
      this.setError(conf.model, err);
    },
    validate() {
      for (const model in this.fields) {
        this.validateField(this.fieldsFlat?.[model], true);
      }
    },
  },
  render(createElement) {
    function createFields(arr) {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(
          ({ tag, data, children }) => createElement(tag, data, createFields(children))
        );
      }
      return [];
    }
    const fields = createFields(this?.schema?.fields);
    return createElement('form', {}, fields);
  },
};
</script>
