# Migration Guide

* Please see the [CHANGELOG](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/blog/2018/01/24/new-version-0.1.0) for `react-bootstrap-table-ng` first drop.
* Please see the [Road Map](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/blog/2018/01/24/release-plan)  for `react-bootstrap-table-ng` in 2018/Q1.
* Feel free to see the [official docs](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/about), we list all the basic usage here!!

## Preface

Currently, **I still can't implement all the mainly features in legacy `react-bootstrap-table`**, so please watch our github repo or [blog](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/blog/) to make sure the legacy features you wanted are already implemented on `react-bootstrap-table-ng`. Anyway, ask me by open issue is ok.   

-----

`react-bootstrap-table-ng` separate some functionalities from core modules to other modules like following:

* [`react-bootstrap-table-ng`](https://www.npmjs.com/package/react-bootstrap-table-ng)
  * Core table module, include sorting and row selection
* [`react-bootstrap-table-ng-filter`](https://www.npmjs.com/package/react-bootstrap-table-ng-filter)
  * Column filter Addons
* [`react-bootstrap-table-ng-editor`](https://www.npmjs.com/package/react-bootstrap-table-ng-editor)
  * Cell Editing Addons
* [`react-bootstrap-table-ng-paginator`](https://www.npmjs.com/package/react-bootstrap-table-ng-paginator)
  * Pagination Addons
* [`react-bootstrap-table-ng-overlay`](https://www.npmjs.com/package/react-bootstrap-table-ng-overlay)
  * Overlay/Loading Addons
* [`react-bootstrap-table-ng-toolkit`](https://www.npmjs.com/package/react-bootstrap-table-ng-toolkit)
  * Table Toolkits, like search, csv, column toggle etc.

This can help your application with less bundled size and also help `react-bootstrap-table-ng` have clean design to avoid handling to much logic in kernel module(SRP). Hence, which means you probably need to install above addons when you need specific features.

## Core Table Migration

There is a big change is that there's no `TableHeaderColumn` in the `react-bootstrap-table-ng`, instead you are supposed to be define the `columns` prop on `BootstrapTable`: 

```js
import BootstrapTable from 'react-bootstrap-table-ng';

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

`<BootstrapTable` keyField='id' data={ products } columns={ columns } />`
```

The `text` property is just same as the children for the `TableHeaderColumn`, if you want to custom the header, there's a new property is: [`headerFormatter`](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/column-props#columnheaderformatter-function).

* [`BootstrapTable` Definition](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/table-props)
* [Column Definition](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/column-props)

## Table Sort

Please see [Work with table sort](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-sort).   

- [x] Basic sorting
- [x] Custom sort function
- [x] Default Sort
- [x] Remote mode
- [x] Custom the sorting header
- [x] Sort event listener
- [ ] Custom the sort caret
- [ ] Sort management
- [ ] Multi sort

Due to no `TableHeaderColumn` so that no `dataSort` here, please add [`sort`](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/column-props#columnsort-bool) property on column definition.

## Row Selection

Please see [Work with selection](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-row-select).   
Please see [available selectRow configurations](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/row-select-props).   

No huge change for row selection.

## Column Filter

Please see [Work with column filter](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-filter).   
Please see [available filter configuration](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/filter-props).   

- [x] Text Filter
- [x] Custom Text Filter
- [x] Remote Filter
- [x] Custom Filter Component
- [ ] Regex Filter
- [x] Select Filter
- [x] Custom Select Filter
- [X] Number Filter
- [X] Date Filter
- [X] Array Filter
- [X] Programmatically Filter

Remember to install [`react-bootstrap-table-ng-filter`](https://www.npmjs.com/package/react-bootstrap-table-ng-filter) firstly.   

Due to no `TableHeaderColumn` so that no `filter` here, please add [`filter`](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/column-props#columnfilter-object) property on column definition and [`filter`](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/table-props#filter-object) prop on `BootstrapTable`.

## Cell Edit

Please see [Work with cell edit](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-celledit).   
Please see [available cell edit configurations](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/cell-edit-props).   

Remember to install [`react-bootstrap-table-ng-editor`](https://www.npmjs.com/package/react-bootstrap-table-ng-editor) firstly.   

No big changes for cell editing, [`validator`](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/column-props#columnvalidator-function) will not support the async call(Promise).

## Pagination

Please see [Work with pagination](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-pagination).   
Please see [available pagination configurations](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props).   

Remember to install [`react-bootstrap-table-ng-paginator`](https://www.npmjs.com/package/react-bootstrap-table-ng-paginator) firstly.   

## Table Search
Ｔhe usage of search functionality is a little bit different from legacy search. The mainly different thing is developer have to render the search input field, we do believe it will be very flexible for all the developers who want to custom the search position or search field itself.

- [x] Custom search component and position
- [x] Custom search value
- [x] Clear search
- [ ] Multiple search
- [ ] Strict search

## Row Expand
- [x] Expand Row Events
- [x] Expand Row Indicator
- [x] Expand Row Management
- [x] Custom Expand Row Indicators
- [ ] Compatiable with Row Selection
- [ ] Expand Column position
- [ ] Expand Column Style/Class

## Export CSV
Export CSV functionality is like search, which is one of functionality in the `react-bootstrap-table-ng-toolkit`. All of the legacy functions we already implemented.

## Remote

> It's totally different in `react-bootstrap-table-ng`. Please [see](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/basic-remote).


## Row insert/Delete
Not support yet

## Keyboard Navigation
Not support yet
