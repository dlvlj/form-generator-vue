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
  const COMMON_VALIDATORS = validationRules.COMMON_VALIDATORS;
  const HAS_COMMON_RULES =
    !COMMON_VALIDATORS || !Object.keys(COMMON_VALIDATORS).length ? false : true;
  const VALIDATION_FUNCTION =
    validationRules[fieldName] || validationRules[fieldRules.type] || undefined;

  if (msg !== FIELD_IS_EMPTY) {
    if (HAS_COMMON_RULES) {
      for (const validator in COMMON_VALIDATORS) {
        !isFunc(COMMON_VALIDATORS[validator]) &&
          console.error(`${validator} is not a function.`);
        msg = COMMON_VALIDATORS[validator](fieldValue, fieldRules, allFields);
        isUndef(msg) &&
          console.error(
            `${validator} return error string if field is invalid, return empty string when success`
          );
      }
    }
    if (!isFunc(VALIDATION_FUNCTION)) {
      fieldName in validationRules && console.error(`${VALIDATION_FUNCTION} is not a function.`);
      return validationResult(msg);
    }
    msg = VALIDATION_FUNCTION(fieldValue, fieldRules, allFields);
    return validationResult(msg);
  } else {
    msg = submit ? 'Required' : '';
    return validationResult(msg);
  }
};
function validationResult(msg) {
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
