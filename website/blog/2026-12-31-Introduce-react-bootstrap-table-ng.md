---
title: Introduction to react-bootstrap-table-ng (2026-01-15)
authors: jeff-k-zhou
pinned: true
---

`react-bootstrap-table-ng` is a maintenance fork of [`react-bootstrap-table-nextgen`](https://github.com/TerrenceMiao/react-bootstrap-table-nextgen) / npm package [`react-bootstrap-table-nextgen`](https://www.npmjs.com/package/react-bootstrap-table-nextgen), which is a fork of [`react-bootstrap-table2`](https://github.com/react-bootstrap-table/react-bootstrap-table2) / npm package [`react-bootstrap-table-next`](https://www.npmjs.com/package/react-bootstrap-table-next) created by Allen Fang.

The goal of this fork is to provide stable version to support React 18+ and Bootstrap 4+ with modern React 18+ features such as hooks, context, etc.

## Planned changes

on top of [`react-bootstrap-table-next`] and [`react-bootstrap-table-nextgen`]

### Core Features/Enhancements

- Support React 18 and React 19
- Support Bootstrap 3.x up to 3.4.1, Bootstrap 4.x up to 4.6.2, and Bootstrap 5.x up to 5.3.8
- Convert all test cases from Enzyme to React Testing Library (RTL), remove Enzyme related dependencies
- Migrate PropTypes to typescript types due to PropTypes deprecation in React 19
- Add column resize functionality
- Add cell expand functionality
- Replace all class components with functional components
- Utilize modern React features such as hooks and context API
- Update most dependencies to their latest stable versions to fix vulnerabilities

### Development environment

- Upgrade Storybook to 10.x
- Upgrade Yarn to 4.x
- Upgrade Docusaurus to 3.x

---

## Release Notes

https://github.com/jeff-k-zhou/react-bootstrap-table-ng/releases

## React and Bootstrap compatibility

See the below table on which version of react-bootstrap-table-ng you should be using in your project.

<table>
  <thead>
    <tr>
      <th rowspan="2">react-bootstrap-table-ng</th>
      <th colspan="3">Compatible react/bootstrap/react-bootstrap versions</th>
    </tr>
    <tr>
      <th>react</th>
      <th>bootstrap</th>
      <th>react-bootstrap</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">5.19.x</td>
      <td rowspan="3">18.x - 19.x</td>
      <td>5.x</td>
      <td>2.x</td>
    </tr>
    <tr>
      <td>4.x</td>
      <td>1.x</td>
    </tr>
    <tr>
      <td>3.x</td>
      <td>0.33.x</td>
    </tr>
    <tr>
      <td rowspan="2">4.19.x</td>
      <td rowspan="2">18.x - 19.x</td>
      <td>4.x</td>
      <td>1.x</td>
    </tr>
    <tr>
      <td>3.x</td>
      <td>0.33.x</td>
    </tr>
    <tr>
      <td rowspan="2">4.18.x</td>
      <td rowspan="2">18.x</td>
      <td>4.x</td>
      <td>1.x</td>
    </tr>
    <tr>
      <td>3.x</td>
      <td>0.33.x</td>
    </tr>
  </tbody>
</table>
