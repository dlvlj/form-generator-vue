<script>
import props from './main/mixins/props';
import UTILS from './main/utils';

const createModel = (schema) => {
  const models = {};
  (function init(s) {
    if (s?.model) {
      models[(UTILS.isArr(s.model) && s.model?.[0]) || s.model] = { value: '', error: '' };
      Object.defineProperty(models[(UTILS.isArr(s.model) && s.model?.[0]) || s.model], 'options', { value: s?.options || {}, enumerable: false });
    }
    if (s?.children) {
      s?.children.forEach((i) => init(i));
    }
  }(schema));
  return models;
};

export default {
  mixins: [props],
  emits: ['input'],
  data() {
    const models = createModel(this.schema);
    return {
      models
    };
  },
  watch: {
    value: {
      handler: 'watchValue',
      deep: true,
    },
    models: {
      handler: 'watchModels',
      deep: true,
      immediate: true,
    },
  },
  created() {
    Object.keys(this.models).forEach((m) => {
      this.$watch(`models.${m}.value`, () => {
        this.validateModel(m);
      }, { deep: true });
    });
  },
  mounted() {
    if (this?.schema?.options?.onLoadValidation) {
      this.validate();
    }
  },
  methods: {
    watchValue(v) {
      for (const m in v) {
        this.models[m].value = v?.[m].value;
        this.models[m].error = v?.[m].error;
      }
    },
    watchModels() {
      this.$emit('input', this.models);
    },
    resetValidation() {
      for (const m in this.models) {
        this.models[m].error = '';
      }
    },
    reset() {
      for (const m in this.models) {
        this.models[m].value = '';
        this.models[m].value = '';
      }
    },
    validErr: (v) => (v && !['boolean'].includes(typeof v)) || (!v && ['string', 'boolean'].includes(typeof v)),
    setError(m, e) {
      this.models[m].error = this.validErr(e) ? e : '';
    },
    runModelRules(val, rules) {
      let err;
      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          err = rule;
          if (UTILS.isFunc(rule)) {
            err = rule(val);
          }
          if (this.validErr(err)) {
            break;
          }
        }
      }
      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }
      return err;
    },
    validateModel(m, validate) {
      const validationOption = this.models[m].options?.activeValidation
        ? this.models[m].options?.activeValidation : this?.schema?.options?.activeValidation;

      const err = (validate || validationOption)
       && this.runModelRules(this.models[m].value, this?.schema?.rules?.[m]);
      this.setError(m, err);
    },
    validate() {
      for (const m in this.models) {
        this.validateModel(m, true);
      }
    },
  },
  render(createElement) {
    const { tag: rootTag, data: rootData, children: rootChildren } = this.schema;
    const nestDom = (arr) => {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(
          ({ tag, data, children }) => createElement(tag, data, nestDom(children))
        );
      }
      return [];
    };
    return createElement(rootTag, rootData, nestDom(rootChildren));
  },
};
</script>
