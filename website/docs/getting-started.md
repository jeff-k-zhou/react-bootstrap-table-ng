---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## Installation

> Due to `react-bootstrap-table-ng` already taken on npm our module is called **`react-bootstrap-table-next`**. We still use `react-bootstrap-table-ng` in any our git repository, official website and documentation - only the npm name is different!

```sh
$ npm install react-bootstrap-table-next --save
```

## Add CSS

> You first need to add bootstrap css in your application. After **v1.0.0**, we start to suport `bootstrap@4`.

Finish above step, then add the `react-bootstrap-table-ng` styles: 

```js
// es5 
require('react-bootstrap-table-next/dist/react-bootstrap-table-ng.min.css');

// es6
import 'react-bootstrap-table-next/dist/react-bootstrap-table-ng.min.css';
```

## Your First Table

```js
import BootstrapTable from 'react-bootstrap-table-next';

const products = [ ... ];
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

export default () =>
  <BootstrapTable keyField='id' data={ products } columns={ columns } />
```
<hr />

## UMD

### Namespace

* The namespace of `react-bootstrap-table-ng` is `ReactBootstrapTable2`
* The namespace of `react-bootstrap-table-ng-editor` is `ReactBootstrapTable2Editor`
* The namespace of `react-bootstrap-table-ng-filter` is `ReactBootstrapTable2Filter`
* The namespace of `react-bootstrap-table-ng-paginator` is `ReactBootstrapTable2Paginator`
* The namespace of `react-bootstrap-table-ng-overlay` is `ReactBootstrapTable2Overlay`
* The namespace of `react-bootstrap-table-ng-toolkit` is `ReactBootstrapTable2Toolkit`

### npm

After install from npm, your can get UMD module from the `dist`.

### unpkg

* Download`react-bootstrap-table-next` from [here](https://unpkg.com/react-bootstrap-table-next/dist/react-bootstrap-table-next.min.js)
* Download `react-bootstrap-table-ng-editor` from [here](https://unpkg.com/react-bootstrap-table-ng-editor/dist/react-bootstrap-table-ng-editor.min.js)
* Download `react-bootstrap-table-ng-filter` from [here](https://unpkg.com/react-bootstrap-table-ng-filter/dist/react-bootstrap-table-ng-filter.min.js)
* Download `react-bootstrap-table-ng-paginator` from [here](https://unpkg.com/react-bootstrap-table-ng-paginator/dist/react-bootstrap-table-ng-paginator.min.js)
* Download `react-bootstrap-table-ng-overlay` from [here](https://unpkg.com/react-bootstrap-table-ng-overlay/dist/react-bootstrap-table-ng-overlay.min.js)
* Download `react-bootstrap-table-ng-toolkit` from [here](https://unpkg.com/react-bootstrap-table-ng-toolkit/dist/react-bootstrap-table-ng-toolkit.min.js)
