export default {
  props: {
    value: {
      type: Object,
      default: null,
      required: false,
    },
    onSubmit: {
      type: Function,
      required: false,
      default: () => {
        // console.warn('submit handler prop not present');
      },
    },
    components: {
      type: Array,
      required: false,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    schema: {
      type: Object,
      default: () => ({}),
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    onSubmitFail: {
      type: Function,
      required: false,
      default: () => {
        // console.warn('Form submit failed');
      },
    },
    activeValidation: {
      type: Boolean,
      required: false,
      default: false
    },
    activeValidationDelay: {
      type: Number,
      required: false,
      default: 0
    },
    logs: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
