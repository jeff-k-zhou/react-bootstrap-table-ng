// The inferred type of 'default' cannot be named without a reference to 'react-bootstrap-table-ng/node_modules/@types/prop-types'.
// This is likely not portable. A type annotation is necessary.ts(2742)

import { CSSProperties, SyntheticEvent } from "react";
import {
  ColumnDescription,
  TableColumnFilterProps,
} from "react-bootstrap-table-ng";

import DateFilter from "./src/components/date";
import MultiSelectFilter from "./src/components/multiselect";
import NumberFilter from "./src/components/number";
import SelectFilter from "./src/components/select";
import TextFilter from "./src/components/text";
import createContext from "./src/context";

import {
  FILTER_DELAY,
  FILTER_TYPES,
  LIKE,
  EQ,
  NE,
  GT,
  GE,
  LT,
  LE,
  Comparator,
  TextFilterProps,
  SelectFilterProps,
  MultiSelectFilterProps,
  NumberFilterProps,
  DateFilterProps,
} from "./src/const";

export {
  FILTER_DELAY,
  FILTER_TYPES,
  LIKE,
  EQ,
  NE,
  GT,
  GE,
  LT,
  LE,
  Comparator,
  TextFilterProps,
  SelectFilterProps,
  MultiSelectFilterProps,
  NumberFilterProps,
  DateFilterProps,
};

export const ComparatorNumber = 7;

export const textFilter = (props: Partial<TextFilterProps> = {}) => ({
  Filter: TextFilter,
  props,
});

export const selectFilter = (props: Partial<SelectFilterProps> = {}) => ({
  Filter: SelectFilter,
  props,
});

export const multiSelectFilter = (
  props: Partial<MultiSelectFilterProps> = {}
) => ({
  Filter: MultiSelectFilter,
  props,
});

export const numberFilter = (props: Partial<NumberFilterProps> = {}) => ({
  Filter: NumberFilter,
  props,
});

export const dateFilter = (props: Partial<DateFilterProps> = {}) => ({
  Filter: DateFilter,
  props,
});

export type CustomFilterProps = {
  type?: string | FILTER_TYPES | undefined;
  comparator?: Comparator | undefined;
  caseSensitive?: boolean | undefined;
};

export const customFilter = (props: Partial<CustomFilterProps> = {}) => ({
  Filter: () => {},
  props,
});

/**
 * declaration for table filter sub module
 */
export type FilterFactoryProps<T extends object = any> = {
  // TODO newFilters is not tested not its type is validated since the author of this commit has no experience with this field
  afterFilter?: ((newResult: T[], newFilters?: unknown[]) => void) | undefined;
};

// declare function filterFactory(props?: FilterFactoryProps): unknown;
// export default filterFactory;

export default (options = {}) => ({
  createContext,
  options,
});
