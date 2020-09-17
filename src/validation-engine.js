// helpers -------------------------------------------
const FIELD_IS_EMPTY = 'FIELD_IS_EMPTY';
const FIELD_IS_VALID = '';

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
//  -------------------------------------------
// VALIDATION ENGINE ------------------------------------------------------------
const VALIDATION_ENGINE = (
  fieldName,
  value,
  fieldRules,
  MASTER_RULES,
  fields,
  formSubmit
) => {
  let msg = fieldIsEmpty(value);
  const COMMON_VALIDATORS = MASTER_RULES.COMMON_VALIDATORS;
  const HAS_COMMON_RULES =
    !COMMON_VALIDATORS || !Object.keys(COMMON_VALIDATORS).length ? false : true;
  const VALIDATION_FUNCTION =
    MASTER_RULES[fieldName] || MASTER_RULES[fieldRules.type] || undefined;

  if (msg !== FIELD_IS_EMPTY) {
    //RUN COMMON VALIDATIONS ---------------------------------------------
    if (HAS_COMMON_RULES) {
      for (const validator in COMMON_VALIDATORS) {
        !isFunc(COMMON_VALIDATORS[validator]) &&
          console.error(`${validator} is not a function.`);
        msg = COMMON_VALIDATORS[validator](value, fieldRules, fields);
        isUndef(msg) &&
          console.error(
            `${validator} return error string if field is invalid, return empty string when success`
          );
      }
    }
    // ---------------------------------------------------------------
    if (!isFunc(VALIDATION_FUNCTION)) {
      fieldName in MASTER_RULES && console.error(`${VALIDATION_FUNCTION} is not a function.`);
      return validationResult(msg);
    }
    msg = VALIDATION_FUNCTION(value, fieldRules, fields);
    return validationResult(msg);
  } else {
    msg = formSubmit ? 'Required' : '';
    return validationResult(msg);
  }
};

function validationResult(msg) {
  const PASS = [true, ''];
  const FAIL = [false, msg];
  return msg !== FIELD_IS_VALID ? FAIL : PASS;
}

export default VALIDATION_ENGINE;
