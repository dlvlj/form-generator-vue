export const HELPER_COMPONENT = "_helper";
export const CLASS = {
  form: 'fgv-form',
  header: `fgv-form__header`,
  body: `fgv-form__body`,
  footer: `fgv-form__footer`,
  row: `fgv-form__body__row`,
  col: `fgv-form__body__row__col`,
}

export const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `${v}_before`,
  afterComponent:  v => `${v}_after`,
  beforeRow: 'before-row',
  afterRow: 'after-row'
}

export const SCHEMA = {
  fields: 'fields',
  activeValidation: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
}

export const VMODEL = {
  values: 'values',
  errors: 'errors'
}

export const FIELD = {
  activeValidation: SCHEMA.activeValidation,
  events: 'events',
  component:'component',
  hide: 'hide',
  type: {
    text: 'text',
    number: 'number'
  },
  props:{
    required: 'required',
    disabled: 'disabled'
  }
}

