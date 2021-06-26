<script>
import props from './main/mixins/props';
import UTILS from './main/utils';
import {
  FIELD
} from './main/utils/constants';

const createModel = (schema) => {
  const models = {};
  (function init(s) {
    if (s?.model) {
      models[(UTILS.isArr(s) && s.model?.[0]) || s.model] = { value: '', error: '' };
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
      this.$watch(`models.${m}`, () => {
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
        this.models[m].value = v?.[m];
        this.models[m].error = v?.[m];
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
    canSetErr: (v) => (v && !['boolean'].includes(typeof v)) || (!v && ['string', 'boolean'].includes(typeof v)),
    setError(m, e) {
      this.models[m].error = this.canSetErr(e) ? e : '';
    },
    runModelRules(val, rules) {
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
    validateModel(m, validate) {
      const av = FIELD.av in conf
        ? conf?.[FIELD.av] : this?.schema?.options?.activeValidation;

      const err = (validate || av)
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
