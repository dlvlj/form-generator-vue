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
      required: false
    },
    options: {
      type: Object,
      default: () => ({}),
      required: false
    },
    rules: {
      type: Object,
      default: () => ({}),
      required: false
    },
    classes: {
      type: Object,
      default: () => ({}),
      required: false
    }
  }
};
