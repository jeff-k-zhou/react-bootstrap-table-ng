# react-bootstrap-table-ng
Maintance fork of [`react-bootstrap-table2`] (https://github.com/react-bootstrap-table/react-bootstrap-table2) / npm package [`react-bootstrap-table-next`] (https://www.npmjs.com/package/react-bootstrap-table-next) created by Allen Fang. 
The goal of this fork is to provide stable version with react 18 and above, bootstrap 4 and above.

## Changes on top of [`react-bootstrap-table-next`]
- Support React 18 and React 19
- Support Bootstrap 3x up to 3.4.1 and Bootstrap 4x up to 4.6.2
- Upgraded Storybook to 10.2.7
- Upgraded Yarn to 4.12.0
- Converted all test cases from Enzyme to React Testing Library (RTL), Removed Enzyme related dependencies
- Updated most dependencies to their latest stable versions to fix vulnerabilities

## Release Notes
https://github.com/jeff-k-zhou/react-bootstrap-table-ng/releases

## React and Bootstrap compatibility
See the below table on which version of react-bootstrap-table-ng you should be using in your project.

<table>
  <thead>
    <tr>
      <th rowspan="2">react-bootstrap-table-ng</th>
      <th colspan="3">Dependencies</th>
    </tr>
    <tr>
      <th>react</th>
      <th>bootstrap</th>
      <th>react-bootstrap</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">4.19.x</td>
      <td rowspan="2">18.x - 19.x</td>
      <td>3.x</td>
      <td>0.33.x</td>
    </tr>
    <tr>
      <td>4.x</td>
      <td>1.x</td>
    </tr>
    <tr>
      <td rowspan="2">4.18.x</td>
      <td rowspan="2">18.x</td>
      <td>3.x</td>
      <td>0.33.x</td>
    </tr>
    <tr>
      <td>4.x</td>
      <td>1.x</td>
    </tr>
  </tbody>
</table>

**[Live Demo](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/index.html)**

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