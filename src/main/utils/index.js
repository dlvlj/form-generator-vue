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
    if(!UTILS.isArr(val)) {
      return typeof val === 'object';
    }
    return val.every( v => typeof v === 'object');
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
  handleFunc(func, params = undefined) {
    if(UTILS.isFunc(func)) {
      return func(params);
    }
  },
  handleFuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);
    if(UTILS.isFunc(val)) {
     res = val(funcParams);
    }
    return res;
  },
  debounce(func, wait) {
    let timeOut;
    return function executedFunction(param) {
      clearTimeout(timeOut);
      timeOut=setTimeout(function(){
        clearTimeout(timeOut);
        func(param);
      },wait);
    }
  },
};
export default UTILS;