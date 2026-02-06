---
id: basic-sort
title: Table Sort
sidebar_label: Table Sort
---

`react-bootstrap-table-ng` allow you to configure columns to be sortable. Currently, we don't support the multi-column sort, but it will be implemented in the future.

**[Live Demo For Table Sort](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=Sort%20Table)**

-----

## Enable Sort on Column
Firstly, you need to know what column you allow user to sort and give the [`sort`](./column-props#columnsort-bool) as `true` in the column definition.

```js
const columns = [{
  dataField: 'id',
  text: 'Product ID',
  sort: true
}, {
  dataField: 'name',
  text: 'Product Name',
  sort: true
}, {
  dataField: 'price',
  text: 'Product Price'
}];

```js
<BootstrapTable keyField='id' data={ products } columns={ columns } />
```
```

After table rendered, you can see the Product ID and Product Name will have a caret icon beside the column name:
![sort caret](/img/docs/basic-sort-caret.png)

## Control Sorting
### Default Sort
`react-bootstrap-table-ng` will only apply the default sort at first time rendering, you can achieve the default sorting on table easily via [`defaultSorted`](./table-props#defaultsorted-array).

### Sort Event Listener
Defined [`onSort`](./column-props#columnonsort-function) on target column:

```js
{
  dataField: 'id',
  text: 'Product ID',
  sort: true,
  onSort: (field, order) => {
    // ...
  }
}
```

### Manage Sorting Externally
You can configure `sort` props and give `dataField` and `order` on `BootstrapTable` component to set the sorting state:
Please refer [this](./table-props#sort-object) docs.

Usually you will need it when you want to control the sorting state externally, like clicking on a button outside the table to force to sort a specified column.

## Custom the Sorting Algorithm

It's simple!! configure [`sortFunc`](./column-props#columnsortfunc-function) on column definition.

```js
{
  dataField: 'id',
  text: 'Product ID',
  sort: true
  // Perform a reverse sorting here
  sortFunc: (a, b, order, dataField, rowA, rowB) => {
    if (order === 'asc') {
      return b - a;
    }
    return a - b; // desc
  }
}
```

## Custom the Sorting Style
There're two way you can change or prettify the header when sorting: [`headerSortingClasses`](./column-props#headersortingclasses-string-function) and [`headerSortingStyle`](./column-props#headersortingstyle-object-function) 

## Custom the Sort Caret

See [`column.sortCaret`](./column-props#columnsortcaret-function).