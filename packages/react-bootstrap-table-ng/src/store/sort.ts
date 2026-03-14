import { SORT_ASC, SORT_DESC } from "../const";
import _ from "../utils";

function comparator(a: any, b: any) {
  if (typeof b === "string") {
    return b.localeCompare(a);
  }
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export const sort = (
  data: any,
  sortOrder: any,
  { dataField, sortFunc, sortValue }: any
) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    let result;
    let valueA = _.get(a, dataField);
    let valueB = _.get(b, dataField);
    if (sortValue) {
      valueA = sortValue(valueA, a);
      valueB = sortValue(valueB, b);
    } else {
      valueA = _.isDefined(valueA) ? valueA : "";
      valueB = _.isDefined(valueB) ? valueB : "";
    }

    if (sortFunc) {
      result = sortFunc(valueA, valueB, sortOrder, dataField, a, b);
    } else {
      if (sortOrder === SORT_DESC) {
        result = comparator(valueA, valueB);
      } else {
        result = comparator(valueB, valueA);
      }
    }
    return result;
  });
  return sortedData;
};

export const nextOrder = (
  currentSortColumn: any,
  { sortOrder, sortColumn }: any,
  defaultOrder = SORT_DESC
) => {
  if (!sortColumn || currentSortColumn.dataField !== sortColumn.dataField) {
    return defaultOrder;
  }
  return sortOrder === SORT_DESC ? SORT_ASC : SORT_DESC;
};
