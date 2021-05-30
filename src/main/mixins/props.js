export default {
  props: {
    value: {
      type: Object,
      default: null,
      required: false,
    },
    submit: {
      type: Function,
      required: false,
      default: undefined
    },
    components: {
      type: Array,
      required: false,
      default: () => [],
    },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    schema: {
      type: Object,
      default: () => ({}),
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    submitFail: {
      type: Function,
      required: false,
      default: undefined
    },
    activeValidation: {
      type: Boolean,
      required: false,
      default: true
    },
    // activeValidationDelay: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    logs: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
