export default {
  methods: {
    isHelperComponent(fieldName) {
      return fieldName.includes(HELPER_COMPONENT);
    },
    updateHelpers(fieldName, newVal) {
      const VAL = newVal;
      // for helper field
      if (this.isHelperComponent(fieldName)) {
        const [fieldBeingHelped] = fieldName.split(HELPER_COMPONENT);
        fieldBeingHelped in this.fields &&
          (this.fields[fieldBeingHelped] = VAL);
        return;
      }
      // for field being helped
      if (`${fieldName}${HELPER_COMPONENT}` in this.fields) {
        const helperField = `${fieldName}${HELPER_COMPONENT}`;
        this.fields[helperField] = VAL;
      }
    },
    setDefaultFieldValue(fieldConfig) {
      this.fields[fieldConfig.model] =
        fieldConfig.model in this.value.values ? this.value.values[fieldConfig.model] : '';
    },
  }
}