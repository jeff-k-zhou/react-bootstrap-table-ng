---
id: basic-row
title: Work on Row
sidebar_label: Work on Row
---

`react-bootstrap-table-ng` allow you to custom the row style/class/attributes and event on row(`tr`)

**[Live Demo For Rows](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=Work%20on%20Rows)**   

-----

## Row Style/Class

* [rowStyle](./table-props#rowstyle-object-function)
* [rowClasses](./table-props#rowclasses-string-function)

## Row Events

* [rowEvents](./table-props#rowevents-object)

Currently, `react-bootstrap-table-ng` only wrapped up the following events to allow its callback to receive `row` and `rowIndex`, for example:

* `onClick`
* `onDoubleClick`
* `onMouseEnter`
* `onMouseLeave`
* `onContextMenu`
* `onAuxClick`

```js
const rowEvents = {
  onClick: (e, row, rowIndex) => {
    ....
  }
};
`<BootstrapTable` data={ data } columns={ columns } rowEvents={ rowEvents } />`
```

Anyway, it's welcome to ask us to add more wrapped events. 

## Row Attributes

**Coming Soon!**