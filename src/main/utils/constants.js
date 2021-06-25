export const HELPER_COMPONENT = '_helper';
export const canSetErr = (v) => (v && !['boolean'].includes(typeof v)) || (!v && ['string', 'boolean'].includes(typeof v));
export const CLASS = {
  form: 'fgv-form',
  // header: 'fgv-header',
  body: 'fgv-body',
  // footer: 'fgv-footer',
  row: 'fgv-row',
  rowContainer: 'fgv-row-container',
  colContainer: 'fgv-col-container',
  col: 'fgv-col',
};

export const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: (v) => `before-${v}`,
  afterComponent: (v) => `after-${v}`,
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowEnd: 'row-end',
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
  on: 'on',
  component: 'component',
  type: {
    text: 'text',
    number: 'number',
  },
  props: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  rules: 'rules'
};
