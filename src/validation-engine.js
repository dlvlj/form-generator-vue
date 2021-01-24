const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';

// VALIDATION ENGINE 
export default function (
  fieldName,
  fieldValue,
  fieldRules,
  validationRules,
  allFields,
  submit
) {
  let msg = fieldIsEmpty(fieldValue);
  const filters = validationRules.FILTERS;
  const hasFilters = typeof filters === 'object' && !Array.isArray(filters) && Object.keys(filters).length;
  const validator =
    validationRules[fieldName] || validationRules[fieldRules.type];

  if (msg !== FIELD_IS_EMPTY) {
    if (hasFilters) {
      for (const filter in filters) {
        if(!isFunc(filters[filter])){
          console.error(`${filter} is not a function.`);
          break;
        }
        msg = filters[filter](fieldValue, fieldRules, allFields);
        if(isUndef(msg)) {
          msg = FIELD_IS_VALID;
          console.error(`function ${filter} returning undefined.`);
        }
        if(msg !== FIELD_IS_VALID) {
          break;
        }
      }
    }
    if (!isFunc(validator)) {
      fieldName in validationRules && console.error(`${validator} is not a function.`);
      return result(msg);
    }
    msg = validator(fieldValue, fieldRules, allFields);
    return result(msg);
  } else {
    msg = submit ? 'Required' : '';
    return result(msg);
  }
};
function result(msg) {
  const PASS = [true, ''];
  const FAIL = [false, msg];
  return msg !== FIELD_IS_VALID ? FAIL : PASS;
}
function fieldIsEmpty(value) {
  return String(value).trim() === '' || (![false, 0].includes(value) && !value)
    ? FIELD_IS_EMPTY
    : FIELD_IS_VALID;
}
function throwError(msg) {
  throw new Error(msg);
}
function isFunc(func) {
  return typeof func === 'function'
}
function isUndef(val) {
  return typeof val === 'undefined'
}
