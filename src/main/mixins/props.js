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
        console.error("submit handler not present");
      },
    },
    validationRules: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    formComponents: {
      type: Array,
      required: false,
      default: () => [],
    },
    editable: {
      type: Boolean,
      required: false,
      default: true,
    },
    // validationConfig: {
    //   type: Object,
    //   required: false,
    //   default: () => ({}),
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
    onSubmitFail: {
      type: Function,
      required: false,
      default: () => {
        console.warn("Form submit fail");
      },
    },
  }
}