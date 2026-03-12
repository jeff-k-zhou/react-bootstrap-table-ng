import { CSSProperties, SyntheticEvent } from "react";
import {
  ColumnDescription,
  TableColumnFilterProps,
} from "react-bootstrap-table-ng";

export enum FILTER_TYPES {
  TEXT = "TEXT",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  NUMBER = "NUMBER",
  DATE = "DATE",
}

export const FILTER_DELAY = 500;

export const LIKE = "LIKE";
export const EQ = "=";
export const NE = "!=";
export const GT = ">";
export const GE = ">=";
export const LT = "<";
export const LE = "<=";

export type Comparator = string;

export type TextFilterProps<T extends object = any> = TableColumnFilterProps<
  string,
  T
> &
  Partial<{
    // default is false, and true will only work when comparator is LIKE
    caseSensitive: boolean;
    comparator: Comparator;
    // on filter element click event
    onClick: ((e: SyntheticEvent) => void) | undefined;
    filterState?: any;
    column: any;
  }>;

export type SelectFilterOptions =
  | { [index: string]: string }
  | Array<{ value: number; label: string }>;

export type SelectFilterProps<T extends object = any> = TableColumnFilterProps<
  string,
  T
> & {
  options:
    | SelectFilterOptions
    | ((column: ColumnDescription<T>) => SelectFilterOptions);
  comparator?: Comparator | undefined;
  // When the default unset selection is hidden from dropdown
  withoutEmptyOption?: boolean | undefined;
  filterState?: any;
  column: any;
  caseSensitive?: boolean;
};

export type MultiSelectFilterOptions = {
  [index: string]: string;
};

export type MultiSelectFilterProps<T extends object = any> =
  TableColumnFilterProps<string[], T> & {
    options: MultiSelectFilterOptions | (() => MultiSelectFilterOptions);
    comparator?: Comparator | undefined;
    // When set the default selection is hidden from dropdown
    withoutEmptyOption?: boolean | undefined;
    filterState?: any;
    column: any;
    caseSensitive?: boolean;
  };

export type NumberFilterProps<T extends object = any> = TableColumnFilterProps<
  { number: number | ""; comparator: Comparator },
  T
> & {
  options?: number[] | undefined;
  comparators?: Comparator[] | undefined;
  // When set to true comparator dropdown does not show a "no selection" option
  withoutEmptyComparatorOption?: boolean | undefined;
  withoutEmptyNumberOption?: boolean | undefined;
  comparatorClassName?: string | undefined;
  numberClassName?: string | undefined;
  comparatorStyle?: CSSProperties | undefined;
  numberStyle?: CSSProperties | undefined;
  defaultValue?: { number?: number | ""; comparator?: Comparator } | undefined;
  filterState?: any;
  column: any;
};

export type DateFilterProps<T extends object = any> = TableColumnFilterProps<
  Date,
  T
> & {
  withoutEmptyComparatorOption?: boolean | undefined;
  defaultValue?:
    | {
        date?: Date;
        comparator?: Comparator;
      }
    | undefined;
  comparators?: Comparator[] | undefined;
  comparatorClassName?: string | undefined;
  dateClassName?: string | undefined;
  comparatorStyle?: CSSProperties | undefined;
  dateStyle?: CSSProperties | undefined;
  filterState?: any;
  column: any;
};
