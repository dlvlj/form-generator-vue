export default {
  props: {
    value: {
      type: Object,
      default: null,
      required: false,
    },
    schema: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    }
  }
};
