function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */

/* template */
var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, {}, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    // submit: {
    //   type: Function,
    //   required: false,
    //   default: undefined
    // },
    // components: {
    //   type: Array,
    //   required: false,
    //   default: () => [],
    // },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    schema: {
      type: Object,
      default: () => ({})
    } // classes: {
    //   type: Object,
    //   required: false,
    //   default: () => ({}),
    // },
    // submitFail: {
    //   type: Function,
    //   required: false,
    //   default: undefined
    // },
    // activeValidation: {
    //   type: Boolean,
    //   required: false,
    //   default: true
    // },
    // activeValidationDelay: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    // logs: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // }

  }
};

const UTILS = {
  isUndef(val) {
    return typeof val === 'undefined';
  },

  isObjNotArr(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val);
    }

    return val.every(v => UTILS.isObj(v) && !UTILS.isArr(v));
  },

  isObj(val) {
    if (!UTILS.isArr(val)) {
      return typeof val === 'object';
    }

    return val.every(v => typeof v === 'object');
  },

  isArr(val) {
    return Array.isArray(val);
  },

  isFunc(val) {
    return typeof val === 'function';
  },

  isBool(val) {
    return typeof val === 'boolean';
  },

  isStr(val) {
    return typeof val === 'string';
  },

  throwError(msg) {
    throw new Error(msg);
  },

  hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }

    return children.every(child => child in parent);
  },

  handleFunc(func, params) {
    if (UTILS.isFunc(func)) {
      return func(params);
    }
  },

  handleFuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  },

  debounce(func) {
    let debounce_timeout;
    return (time, data) => {
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(() => {
        clearTimeout(debounce_timeout);
        func(data);
      }, time);
    };
  },

  logger(items, options = {}) {
    const {
      show,
      warn
    } = options;

    if (show) {
      if (warn) {
        console.warn(...items);
        return;
      }

      console.log(...items);
    }
  }

};

const canSetErr = v => v && !['boolean'].includes(typeof v) || !v && ['string', 'boolean'].includes(typeof v);
const CLASS = {
  form: 'fgv-form',
  // header: 'fgv-header',
  body: 'fgv-body',
  // footer: 'fgv-footer',
  row: 'fgv-row',
  rowContainer: 'fgv-row-container',
  colContainer: 'fgv-col-container',
  col: 'fgv-col'
};
const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `before-${v}`,
  afterComponent: v => `after-${v}`,
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowEnd: 'row-end',
  afterRow: 'after-row',
  beforeCol: 'before-col',
  afterCol: 'after-col'
};
const SCHEMA = {
  fields: 'fields',
  av: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
};
const VMODEL = {
  fields: 'fields',
  errors: 'errors'
};
const FIELD = {
  av: SCHEMA.av,
  avDelay: SCHEMA.avDelay,
  on: 'on',
  component: 'component',
  type: {
    text: 'text',
    number: 'number'
  },
  props: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  rules: 'rules'
};

//
var script = {
  components: {
    Body: __vue_component__,
    RowContainer: __vue_component__,
    Row: __vue_component__,
    ColumnContainer: __vue_component__,
    Column: __vue_component__
  },
  mixins: [props],
  emits: ['input'],

  data() {
    var _this$value;

    const form = (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.form;
    const fields = {};
    const errors = {};

    const addFieldsAndErrors = model => {
      var _this$value2, _this$value2$VMODEL$f, _this$value3, _this$value3$VMODEL$e;

      fields[model] = ((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$f = _this$value2[VMODEL.fields]) === null || _this$value2$VMODEL$f === void 0 ? void 0 : _this$value2$VMODEL$f[model]) || '';
      errors[model] = ((_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : (_this$value3$VMODEL$e = _this$value3[VMODEL.errors]) === null || _this$value3$VMODEL$e === void 0 ? void 0 : _this$value3$VMODEL$e[model]) || '';
    };

    for (const fieldConf of this.schema[SCHEMA.fields]) {
      if (UTILS.isArr(fieldConf)) {
        for (const subFieldConf of fieldConf) {
          addFieldsAndErrors(subFieldConf.model);
        }
      } else {
        addFieldsAndErrors(fieldConf.model);
      }
    }

    return {
      form,
      fields,
      errors
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
        } else {
          flat[conf.model] = conf;
        }
      }

      return flat;
    }

  },
  watch: {
    value: {
      handler() {
        for (const model in (_this$value4 = this.value) === null || _this$value4 === void 0 ? void 0 : _this$value4[VMODEL.fields]) {
          var _this$value4, _this$value5, _this$value5$VMODEL$f, _this$value6, _this$value6$VMODEL$e;

          this.fields[model] = (_this$value5 = this.value) === null || _this$value5 === void 0 ? void 0 : (_this$value5$VMODEL$f = _this$value5[VMODEL.fields]) === null || _this$value5$VMODEL$f === void 0 ? void 0 : _this$value5$VMODEL$f[model];
          this.errors[model] = (_this$value6 = this.value) === null || _this$value6 === void 0 ? void 0 : (_this$value6$VMODEL$e = _this$value6[VMODEL.errors]) === null || _this$value6$VMODEL$e === void 0 ? void 0 : _this$value6$VMODEL$e[model];
        }
      },

      deep: true
    },
    form: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
    fields: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
    errors: {
      handler: 'emitData',
      deep: true,
      immediate: true
    }
  },

  created() {
    for (const model in this.fields) {
      const conf = this.getFieldConf(model);
      this.$watch(`fields.${model}`, () => {
        this.validateField(conf);
      }, {
        deep: true
      });
    }
  },

  mounted() {
    var _this$schema, _this$schema$options;

    if (this === null || this === void 0 ? void 0 : (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$options = _this$schema.options) === null || _this$schema$options === void 0 ? void 0 : _this$schema$options.onLoadValidation) {
      this.validate();
    }
  },

  methods: {
    classes(classArr, subArr = false) {
      return classArr.reduce((acc, c) => {
        var _this$schema2, _this$schema2$class;

        if (this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$class = _this$schema2.class) === null || _this$schema2$class === void 0 ? void 0 : _this$schema2$class[c]) {
          acc.push(...this.schema.class[c]);
          const ar = this.schema.class[c].filter(cl => {
            var _this$schema3;

            return Object.keys(this === null || this === void 0 ? void 0 : (_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : _this$schema3.class).includes(cl);
          });

          if (ar.length) {
            acc.push(...this.classes(ar, true));
          }
        }

        return acc;
      }, !subArr ? [...classArr] : []);
    },

    emitData() {
      var _this$schema4, _this$schema4$form, _this$schema5, _this$schema5$form;

      const formModel = UTILS.isStr(this === null || this === void 0 ? void 0 : (_this$schema4 = this.schema) === null || _this$schema4 === void 0 ? void 0 : (_this$schema4$form = _this$schema4.form) === null || _this$schema4$form === void 0 ? void 0 : _this$schema4$form.model) ? this === null || this === void 0 ? void 0 : (_this$schema5 = this.schema) === null || _this$schema5 === void 0 ? void 0 : (_this$schema5$form = _this$schema5.form) === null || _this$schema5$form === void 0 ? void 0 : _this$schema5$form.model : undefined;
      const valid = !Object.keys(this.errors).find(e => this.errors[e] && !this.fieldHidden(this.fieldsFlat[e]));
      this.$emit('input', { ...(formModel ? {
          [formModel]: this.form
        } : {}),
        valid,
        [VMODEL.fields]: this.fields,
        [VMODEL.errors]: this.errors
      });
    },

    showRow(conf) {
      return UTILS.isArr(conf) ? conf.length && conf.some(c => this.showCol(c)) : this.showCol(conf);
    },

    showCol(conf) {
      return this.componentName(conf) && !this.fieldHidden(conf);
    },

    slotProps(conf) {
      if (UTILS.isArr(conf)) {
        return conf.map(({
          model
        }) => model);
      }

      return [conf.model];
    },

    componentProps(conf, options = {}) {
      const {
        form
      } = options;
      const p = { ...(conf === null || conf === void 0 ? void 0 : conf.props)
      };

      if (form) {
        var _conf$props;

        p.is = (conf === null || conf === void 0 ? void 0 : (_conf$props = conf.props) === null || _conf$props === void 0 ? void 0 : _conf$props.is) || 'form';
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
      const {
        form
      } = options;
      const e = (conf === null || conf === void 0 ? void 0 : conf[FIELD.on]) || {};

      if (form) {
        var _conf$on;

        e.submit = (conf === null || conf === void 0 ? void 0 : (_conf$on = conf.on) === null || _conf$on === void 0 ? void 0 : _conf$on.submit) || (ev => {
          var _this$schema6, _this$schema6$options;

          ev === null || ev === void 0 ? void 0 : ev.preventDefault();
          UTILS.logger(['submit handler not present.\n'], {
            warn: true,
            show: this === null || this === void 0 ? void 0 : (_this$schema6 = this.schema) === null || _this$schema6 === void 0 ? void 0 : (_this$schema6$options = _this$schema6.options) === null || _this$schema6$options === void 0 ? void 0 : _this$schema6$options.logs
          });
        });
      }

      return e;
    },

    componentName(conf) {
      var _conf$props2;

      return (conf === null || conf === void 0 ? void 0 : (_conf$props2 = conf.props) === null || _conf$props2 === void 0 ? void 0 : _conf$props2.is) || (conf === null || conf === void 0 ? void 0 : conf.tag);
    },

    getFieldConf(model) {
      return this.fieldsFlat[model];
    },

    fieldHidden(conf) {
      var _conf$props3;

      const HIDDEN = true;
      return (conf === null || conf === void 0 ? void 0 : conf.props) && FIELD.props.hidden in conf.props ? Boolean((_conf$props3 = conf.props) === null || _conf$props3 === void 0 ? void 0 : _conf$props3[FIELD.props.hidden]) : !HIDDEN;
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
      var _this$schema7, _this$schema7$options, _this$schema8, _this$schema8$rules;

      const av = FIELD.av in conf ? conf === null || conf === void 0 ? void 0 : conf[FIELD.av] : this === null || this === void 0 ? void 0 : (_this$schema7 = this.schema) === null || _this$schema7 === void 0 ? void 0 : (_this$schema7$options = _this$schema7.options) === null || _this$schema7$options === void 0 ? void 0 : _this$schema7$options.activeValidation;
      const err = (formValidating || av) && this.runFieldRules(this.fields[conf.model], this === null || this === void 0 ? void 0 : (_this$schema8 = this.schema) === null || _this$schema8 === void 0 ? void 0 : (_this$schema8$rules = _this$schema8.rules) === null || _this$schema8$rules === void 0 ? void 0 : _this$schema8$rules[conf.model]);
      this.setError(conf.model, err);
    },

    validate() {
      for (const model in this.fields) {
        var _this$fieldsFlat;

        this.validateField((_this$fieldsFlat = this.fieldsFlat) === null || _this$fieldsFlat === void 0 ? void 0 : _this$fieldsFlat[model], true);
      }
    }

  }
};

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.componentName(_vm.schema.form), _vm._g(_vm._b({
    tag: "component",
    class: _vm.classes([_vm.CLASS.form]),
    model: {
      value: _vm.form,
      callback: function ($$v) {
        _vm.form = $$v;
      },
      expression: "form"
    }
  }, 'component', _vm.componentProps(_vm.schema.form, {
    form: true
  }), false), _vm.componentEvents(_vm.schema.form, {
    form: true
  })), [_vm._t(_vm.SLOT.header), _vm._v(" "), _c('Body', {
    class: _vm.classes([_vm.CLASS.body])
  }, [_vm._l(_vm.schema.fields, function (conf, i) {
    return [_vm.showRow(conf) ? _c('RowContainer', {
      key: i,
      class: _vm.classes([_vm.CLASS.rowContainer, _vm.CLASS.rowContainer + "-" + (i + 1)])
    }, [_vm._t(_vm.SLOT.beforeRow, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Row', {
      class: _vm.classes([_vm.CLASS.row, _vm.CLASS.row + "-" + (i + 1)])
    }, [_vm._t(_vm.SLOT.rowStart, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), !_vm.UTILS.isArr(conf) ? [_vm.showCol(conf) ? _c('ColumnContainer', {
      key: conf.model,
      class: _vm.classes([_vm.CLASS.colContainer, _vm.CLASS.colContainer + "-" + conf.model])
    }, [_vm._t(_vm.SLOT.beforeCol, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Column', {
      class: _vm.classes([_vm.CLASS.col, _vm.CLASS.col + "-" + conf.model, conf.model])
    }, [_vm._t(_vm.SLOT.beforeComponent(conf.model)), _vm._v(" "), _c(_vm.componentName(conf), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[conf.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, conf.model, $$v);
        },
        expression: "fields[conf.model]"
      }
    }, 'component', _vm.componentProps(conf, {
      field: true
    }), false), _vm.componentEvents(conf)), [_vm._t(conf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(conf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()] : _vm._l(conf, function (subConf) {
      return [_vm.showCol(subConf) ? _c('ColumnContainer', {
        key: subConf.model,
        class: _vm.classes([_vm.CLASS.colContainer, _vm.CLASS.colContainer + "-" + subConf.model])
      }, [_vm._t(_vm.SLOT.beforeCol, null, {
        "models": _vm.slotProps(subConf)
      }), _vm._v(" "), _c('Column', {
        class: _vm.classes([_vm.CLASS.col, _vm.CLASS.col + "-" + subConf.model, subConf.model])
      }, [_vm._t(_vm.SLOT.beforeComponent(subConf.model)), _vm._v(" "), _c(_vm.componentName(subConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subConf.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subConf.model, $$v);
          },
          expression: "fields[subConf.model]"
        }
      }, 'component', _vm.componentProps(subConf, {
        field: true
      }), false), _vm.componentEvents(subConf)), [_vm._t(subConf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(subConf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
        "models": _vm.slotProps(subConf)
      })], 2) : _vm._e()];
    }), _vm._v(" "), _vm._t(_vm.SLOT.rowEnd, null, {
      "models": _vm.slotProps(conf)
    })], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterRow, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()];
  })], 2), _vm._v(" "), _vm._t(_vm.SLOT.footer)], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

// Import vue component

const install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__$1);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__$1.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__$1;
