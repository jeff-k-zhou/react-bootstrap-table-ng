# react-bootstrap-table-ng
Maintance fork of [`react-bootstrap-table2`] (https://github.com/react-bootstrap-table/react-bootstrap-table2) created by Allen Fang 

**[Live Demo](https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html)**

## Usage

### Installation

```sh
npm install react-bootstrap-table-ng --save
```

### Include CSS

> react-bootstrap-table-ng need you to add bootstrap css in your application firstly. About bootstrap css, we only compatible with bootstrap 3 but will start to compatible for bootstrap 4 on v0.2.0

```js
// es5
require('react-bootstrap-table-ng/dist/react-bootstrap-table-ng.min.css');

// es6
import 'react-bootstrap-table-ng/dist/react-bootstrap-table-ng.min.css';
```

### Your First Table

```js
import BootstrapTable from 'react-bootstrap-table-ng';

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