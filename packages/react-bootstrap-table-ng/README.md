# react-bootstrap-table-ng
Maintance fork of [`react-bootstrap-table2`] (https://github.com/react-bootstrap-table/react-bootstrap-table2) created by Allen Fang 

Changelog:
- Support React 18 and React 19
- Support Bootstrap 3.4.1 and Bootstrap 4.6.2
- Upgraded Storybook to 10.2.1
- Upgraded Yarn to 4.12.0
- Converted all test cases from Enzyme to React Testing Library (RTL), Removed Enzyme related dependencies
- Updated most dependencies


**[Live Demo](https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html)**

## Usage

### Installation

```sh
npm install react-bootstrap-table-ng --save
```

### Include CSS

> react-bootstrap-table-ng needs you to add bootstrap css in your application firstly.

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