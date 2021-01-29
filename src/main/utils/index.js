const UTILS = {
  isUndef(val) {
    return typeof val === "undefined";
  },
  isObjNotArr(val) {
    if(!UTILS.isArr(val)) {
      return UTILS.isObj(val) && !UTILS.isArr(val);
    }
    return val.every( v => UTILS.isObj(v) && !UTILS.isArr(v));
  },
  isObj(val) {
    return typeof val === 'object'
  },
  isArr(val) {
    return Array.isArray(val);
  },
  isFunc(val) {
    return typeof val === "function";
  },
  isBool(val) {
    return typeof val === "boolean";
  },
  isStr(val) {
    return typeof val === 'string';
  },
  throwError(msg) {
    throw new Error(msg);
  },
  warn(msg) {
    console.warn(msg);
  },
  hasProperty(children, parent) {
    if(!UTILS.isArr(children)) {
      return children in parent;
    }
    return children.every(child => child in parent);
  },
  handlefuncOrBool(val, funcParams) {
    let res = Boolean(val);
    if(UTILS.isFunc(val)) {
     res = val(funcParams);
    }
    return res;
  }
};
export default UTILS;