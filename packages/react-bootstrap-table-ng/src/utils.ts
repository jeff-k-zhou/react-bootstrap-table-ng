/* eslint no-empty: 0 */
/* eslint no-param-reassign: 0 */
/* eslint prefer-rest-params: 0 */

function splitNested(str: any) {
  return [str].join(".").replace(/\[/g, ".").replace(/\]/g, "").split(".");
}

function contains(list: any[] | undefined, value: any): boolean {
  return Array.isArray(list) && list.indexOf(value) > -1;
}

function get(target: any, field: any) {
  if (!field) return target;
  const directGet = target?.[field];
  if (directGet != null) {
    return directGet;
  }

  const pathArray = splitNested(field);
  let result;
  try {
    result = pathArray.reduce((curr, path) => curr[path], target);
  } catch (e) {}
  return result;
}

function set(target: any, field: any, value: any, safe = false) {
  const pathArray = splitNested(field);
  let level = 0;
  pathArray.reduce((a, b) => {
    level += 1;
    if (typeof a[b] === "undefined") {
      if (!safe) throw new Error(`${a}.${b} is undefined`);
      a[b] = {};
      return a[b];
    }

    if (level === pathArray.length) {
      a[b] = value;
      return value;
    }
    return a[b];
  }, target);
}

function isObject(obj: any): obj is object {
  const type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
}

function isEmptyObject(obj: any) {
  if (!isObject(obj)) return false;
  return Object.keys(obj).length === 0;
}

function isDefined(value: any): boolean {
  return value != null;
}

function sleep(fn: () => void, ms: number) {
  return setTimeout(() => fn(), ms);
}

function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: any;

  return function (this: any, ...args: any[]) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 0);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

function has(obj: any, key: string) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

function isFunction(fn: any): fn is Function {
  return typeof fn === "function";
}

function isString(str: any): str is string {
  return typeof str === "string";
}

function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a)) {
      return (
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((v, i) => isEqual(v, b[i]))
      );
    }
    if (Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return (
      keysA.length === keysB.length &&
      keysA.every((key) => isEqual(a[key], b[key]))
    );
  }
  return false;
}

function filter<T>(list: T[], predicate: (item: T) => boolean): T[] {
  return Array.isArray(list) ? list.filter(predicate) : [];
}

function pluck(data: any[], field: any) {
  return data.map((item) => get(item, field));
}

const _ = {
  get,
  set,
  pluck,
  isDefined,
  isEmptyObject,
  isObject,
  sleep,
  debounce,
  contains,
  includes: contains,
  has,
  filter,
  isFunction,
  isString,
  isEqual,
};

export default _;
