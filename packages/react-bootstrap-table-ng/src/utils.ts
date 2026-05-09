import get from "lodash-es/get";
import set from "lodash-es/set";
import isObject from "lodash-es/isObject";
import isEmpty from "lodash-es/isEmpty";
import debounce from "lodash-es/debounce";
import has from "lodash-es/has";
import isFunction from "lodash-es/isFunction";
import isString from "lodash-es/isString";
import isEqual from "lodash-es/isEqual";

function isDefined(value: any): boolean {
  return value != null;
}

function sleep(fn: () => void, ms: number) {
  return setTimeout(() => fn(), ms);
}

function pluck(data: any[], field: any) {
  return data.map((item) => get(item, field));
}

interface TableUtils {
  get: typeof get;
  set: typeof set;
  pluck: typeof pluck;
  isDefined: typeof isDefined;
  isEmptyObject: (obj: any) => boolean;
  isObject: typeof isObject;
  sleep: typeof sleep;
  debounce: typeof debounce;
  contains: (list: any[] | undefined, value: any) => boolean;
  includes: (list: any[] | undefined, value: any) => boolean;
  has: typeof has;
  filter: <T>(list: T[], predicate: (item: T) => boolean) => T[];
  isFunction: typeof isFunction;
  isString: typeof isString;
  isEqual: typeof isEqual;
}

const _: TableUtils = {
  get,
  set,
  pluck,
  isDefined,
  isEmptyObject: (obj: any) => isObject(obj) && isEmpty(obj),
  isObject,
  sleep,
  debounce,
  contains: (list: any[] | undefined, value: any) =>
    Array.isArray(list) && list.includes(value),
  includes: (list: any[] | undefined, value: any) =>
    Array.isArray(list) && list.includes(value),
  has,
  filter: <T>(list: T[], predicate: (item: T) => boolean) =>
    Array.isArray(list) ? list.filter(predicate) : [],
  isFunction,
  isString,
  isEqual,
};

export default _;
