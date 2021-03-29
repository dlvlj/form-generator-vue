import UTILS from './utils';

const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';
const SUCCESS = [true, FIELD_IS_VALID];

// VALIDATION ENGINE
export default function (
  fieldName,
  fieldValue,
  fieldRule,
  validationRules,
  allFields,
  submit,
) {
  let error = checkEmpty(fieldValue);
  const emptyErr = 'emptyErr' in fieldRule ? fieldRule.emptyErr : 'Required';
  const filterData = validationRules.FILTER;
  const fieldValidator = fieldRule.validator || validationRules[fieldRule.type] || validationRules[fieldName];

  if (error !== FIELD_IS_EMPTY) {
    if (!UTILS.isFunc(filterData)) {
      !UTILS.isUndef(filterData) && console.error(`filter ${filterData} is not a function.`);
    } else {
      error = filterData(fieldValue, fieldRule, allFields);
      if (error !== FIELD_IS_VALID) {
        return result(error);
      }
    }
    if (!UTILS.isFunc(fieldValidator)) {
      !UTILS.isUndef(fieldValidator) && console.error(`validator ${fieldValidator} is not a function.`);
      return result(error);
    }
    error = fieldValidator(fieldValue, fieldRule, allFields);
    return result(error);
  }
  error = submit ? emptyErr : '';
  return result(error);
}
function checkEmpty(value) {
  return String(value).trim() === '' || (![false, 0].includes(value) && !value)
    ? FIELD_IS_EMPTY
    : FIELD_IS_VALID;
}
function result(error) {
  const fail = [false, error];
  return error !== FIELD_IS_VALID ? fail : SUCCESS;
}
