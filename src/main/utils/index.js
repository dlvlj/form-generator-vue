const UTILS = {
  isUndef(val) {
    return typeof val === 'undefined';
  },
  isObjNotArr(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val);
    }
    return val.every((v) => UTILS.isObj(v) && !UTILS.isArr(v));
  },
  isObj(val) {
    if (!UTILS.isArr(val)) {
      return typeof val === 'object';
    }
    return val.every((v) => typeof v === 'object');
  },
  isArr(val) {
    return Array.isArray(val);
  },
  isFunc(val) {
    return typeof val === 'function';
  },
  isBool(val) {
    return typeof val === 'boolean';
  },
  isStr(val) {
    return typeof val === 'string';
  },
  throwError(msg) {
    throw new Error(msg);
  },
  hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }
    return children.every((child) => child in parent);
  },
  handleFunc(func, params) {
    if (UTILS.isFunc(func)) {
      return func(params);
    }
  },
  handleFuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);
    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }
    return res;
  },
  debounce(func) {
    let debounce_timeout;
    return (time, data) => {
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(() => {
        clearTimeout(debounce_timeout);
        func(data);
      }, time);
    };
  },
  logger(items, options = {}) {
    const { show, warn } = options;
    if (show) {
      if (warn) {
        console.warn(...items);
        return;
      }
      console.log(...items);
    }
  },
};
export default UTILS;
