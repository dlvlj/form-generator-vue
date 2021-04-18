export const HELPER_COMPONENT = '_helper';
export const CLASS = {
  form: 'fgv-form',
  header: 'fgv-form__header',
  body: 'fgv-form__body',
  footer: 'fgv-form__footer',
  row: 'fgv-form__body__row',
  colContainer: 'fgv-form__body__row__col-container',
  col: 'fgv-form__body__row__col-container__col',
};

export const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: (v) => `before-${v}`,
  afterComponent: (v) => `after-${v}`,
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowend: 'row-end',
  afterRow: 'after-row',
  beforeCol: 'before-col',
  afterCol: 'after-col',
};

export const SCHEMA = {
  fields: 'fields',
  av: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs',
};

export const VMODEL = {
  fields: 'fields',
  errors: 'errors',
};

export const FIELD = {
  av: SCHEMA.av,
  avDelay: SCHEMA.avDelay,
  vOn: 'vOn',
  component: 'component',
  type: {
    text: 'text',
    number: 'number',
  },
  vBind: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  validation: 'validation'
};
