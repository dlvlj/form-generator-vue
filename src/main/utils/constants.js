export const HELPER_COMPONENT = "_helper";
export const CLASS = {
  form: 'fgv-form',
  header: `${CLASS.form}__header`,
  body: `${CLASS.form}__body`,
  footer: `${CLASS.form}__footer`,
  row: `${CLASS.body}__row`,
  col: `${CLASS.row}__col`,
}

export const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `${v}_before`,
  afterComponent:  v => `${v}_after`,
}

export const SCHEMA = {
  fields: 'fields',
  activeValidation: 'activevalidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
}

export const VMODEL = {
  values: 'values',
  errors: 'errors'
}

export const FIELD = {
  events: 'events',
  component:'component',
  show: 'show',
  type: {
    text: 'text',
    number: 'number'
  },
  props:{
    required: 'required',
    disabled: 'disabled'
  }
}

