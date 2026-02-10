
# Row selection
`react-bootstrap-table-ng` supports the row selection feature. By passing prop `selectRow` to enable row selection. When you enable this feature, `react-bootstrap-table-ng` will prepend a new selection column.

## Required
* [mode (**required**)](#mode)

## Optional
* [selected](#selected)
* [style](#style)
* [classes)](#classes)
* [bgColor](#bgColor)
* [nonSelectable)](#nonSelectable)
* [nonSelectableStyle](#nonSelectableStyle)
* [nonSelectableClasses](#nonSelectableClasses)
* [clickToSelect)](#clickToSelect)
* [clickToExpand)](#clickToExpand)
* [clickToEdit](#clickToEdit)
* [onSelect](#onSelect)
* [onSelectAll](#onSelectAll)
* [selectColumnPosition](#selectColumnPosition)
* [hideSelectColumn](#hideSelectColumn)
* [hideSelectAll](#hideSelectAll)
* [selectionRenderer](#selectionRenderer)
* [selectionHeaderRenderer](#selectionHeaderRenderer)
* [headerColumnStyle](#headerColumnStyle)
* [selectColumnStyle](#selectColumnStyle)

### selectRow.mode - [String] {#mode}

Specifying the selection way for `single(radio)` or `multiple(checkbox)`. If `radio` was assigned, there will be a radio button in the selection column; otherwise, the `checkbox` instead.

#### values
* **radio**
* **checkbox**

#### examples

```js
const selectRow = {
  mode: 'radio' // single row selection
};

<BootstrapTable
  keyField='id'
  data={ products }
  columns={ columns }
  selectRow={ selectRowProp }
/>
```

```js
const selectRow = {
  mode: 'checkbox' // multiple row selection
};

<BootstrapTable
  keyField='id'
  data={ products }
  columns={ columns }
  selectRow={ selectRowProp }
/>
```

### selectRow.selected - [Array] {#selected}
`selectRow.selected` allow you have default selections on table.

```js
const selectRow = {
  mode: 'checkbox',
  selected: [1, 3] // should be a row keys array
};
```

### selectRow.style - [Object | Function] {#style}
`selectRow.style` allow you to have custom style on selected rows:

```js
const selectRow = {
  mode: 'checkbox',
  style: { background: 'red' }
};
```

If you wanna more flexible customization, `selectRow.style` also accept a function:

```js
const selectRow = {
  mode: 'checkbox',
  style: (row, rowIndex) => { return ...; }
};
```

### selectRow.classes - [String | Function] {#classes}
`selectRow.classes` allow you to add css class on selected rows:

```js
const selectRow = {
  mode: 'checkbox',
  classes: 'custom-class'
};
```

If you wanna more flexible customization, `selectRow.classes` also accept a function:

```js
const selectRow = {
  mode: 'checkbox',
  classes: (row, rowIndex) => { return ...; }
};
```

### selectRow.bgColor - [String | Function] {#bgColor}
The background color when row is selected

```js
const selectRow = {
  mode: 'checkbox',
  bgColor: 'red'
};
```

There's also a more good way to custom it:

```js
const selectRow = {
  mode: 'checkbox',
  bgColor: (row, rowIndex) => {
    return ....;  // return a color code
  }
};
```

### selectRow.nonSelectable - [Array] {#nonSelectable}
This prop allow you to restrict some rows which can not be selected by user. `selectRow.nonSelectable` accept an rowkeys array.

```js
const selectRow = {
  mode: 'checkbox',
  nonSelectable: [1, 3 ,5]
};
```

### selectRow.nonSelectableStyle - [Object | Function] {#nonSelectableStyle}
This prop allow you to customize the non selectable rows. `selectRow.nonSelectableStyle` accepts an style object
and a callback function for more flexible customization.

### Style Object

```js
const selectRow = {
  mode: 'checkbox',
  nonSelectable: [1, 3 ,5],
  nonSelectableStyle: { backgroundColor: 'gray' }
};
```

### Callback Function

```js
const selectRow = {
  mode: 'checkbox',
  nonSelectable: [1, 3 ,5],
  nonSelectableStyle: (row, rowIndex) => { return ...; }
};
```

### selectRow.nonSelectableClasses - [String | Function] {#nonSelectableClasses}
This prop allow you to set a custom class for the non selectable rows, or use a callback function for more
flexible customization

### String

```js
const selectRow = {
  mode: 'checkbox',
  nonSelectable: [1, 3 ,5],
  nonSelectableClasses: 'my-class'
};
```

### Callback Function

```js
const selectRow = {
  mode: 'checkbox',
  nonSelectable: [1, 3 ,5],
  nonSelectableClasses: (row, rowIndex) => { return ...; }
};
```

### selectRow.clickToSelect - [Bool] {#clickToSelect}
Allow user to select row by clicking on the row.

```js
const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
};
```

> Note: When you also enable [cellEdit](./cell-edit.md), the `selectRow.clickToSelect` will deactivate the functionality of cell editing
> If you want to click on row to select row and edit cell simultaneously, you are suppose to enable [`selectRow.clickToEdit`](#clickToEdit)

### selectRow.clickToExpand - [Bool] {#clickToExpand}
Default is false, enable it will let user able to expand and select row when user clicking on the row.

```js
const selectRow = {
  mode: 'checkbox',
  clickToExpand: true
};
```

### selectRow.clickToEdit - [Bool] {#clickToEdit}
Able to click to edit cell and select row

```js
const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
  clickToEdit: true
};
```

### selectRow.selectionRenderer - [Function] {#selectionRenderer}
Provide a callback function which allow you to custom the checkbox/radio box. This callback only have one argument which is an object and contain following properties:

```js
const selectRow = {
  mode: 'checkbox',
  selectionRenderer: ({ mode, checked, disabled, rowIndex }) => (
    // ....
  )
};
```

> By default, `react-bootstrap-table-ng` will help you to handle the click event, it's not necessary to handle again by developer.

### selectRow.selectionHeaderRenderer - [Function] {#selectionHeaderRenderer}
Provide a callback function which allow you to custom the checkbox/radio box in the selection header column. This callback only have one argument which is an object and contain following properties:

```js
const selectRow = {
  mode: 'checkbox',
  selectionHeaderRenderer: ({ mode, checked, indeterminate }) => (
    // ....
  )
};
```

> By default, `react-bootstrap-table-ng` will help you to handle the click event, it's not necessary to handle again by developer.


### selectRow.headerColumnStyle - [Object | Function] {#headerColumnStyle}
A way to custome the selection header cell. `headerColumnStyle` not only accept a simple style object but also a callback function for more flexible customization:

### Style Object

```js
const selectRow = {
  mode: 'checkbox',
  headerColumnStyle: { backgroundColor: 'blue' }
};
```

### Callback Function

```js
const selectRow = {
  mode: 'checkbox',
  headerColumnStyle:  (status) => (
    // status available value is checked, indeterminate and unchecked
    return { backgroundColor: 'blue' };
  )
};
```

### selectRow.selectColumnStyle - [Object | Function] {#selectColumnStyle}
A way to custome the selection cell. `selectColumnStyle` not only accept a simple style object but also a callback function for more flexible customization:

### Style Object

```js
const selectRow = {
  mode: 'checkbox',
  selectColumnStyle: { backgroundColor: 'blue' }
};
```

### Callback Function
If a callback function present, you can get below information to custom the selection cell:

* `checked`: Whether current row is seleccted or not
* `disabled`: Whether current row is disabled or not
* `rowIndex`: Current row index
* `rowKey`: Current row key


```js
const selectRow = {
  mode: 'checkbox',
  selectColumnStyle:  ({
    checked,
    disabled,
    rowIndex,
    rowKey
  }) => (
    // ....
    return { backgroundColor: 'blue' };
  )
};
```

### selectRow.onSelect - [Function] {#onSelect}
This callback function will be called when a row is select/unselect and pass following three arguments:
`row`, `isSelect`, `rowIndex` and `e`.

```js
const selectRow = {
  mode: 'checkbox',
  onSelect: (row, isSelect, rowIndex, e) => {
    // ...
  }
};
```

> If you want to reject current select action, just return `false`:

```js
const selectRow = {
  mode: 'checkbox',
  onSelect: (row, isSelect, rowIndex, e) => {
    if (SOME_CONDITION) {
      return false;
    }
  }
};
```

### selectRow.onSelectAll - [Function] {#onSelectAll}
This callback function will be called when select/unselect all and it only work when you configure [`selectRow.mode`](#mode) as `checkbox`.

```js
const selectRow = {
  mode: 'checkbox',
  onSelectAll: (isSelect, rows, e) => {
    // ...
  }
};
```

> If you want to control the final selection result, just return a row key array:

```js
const selectRow = {
  mode: 'checkbox',
  onSelectAll: (isSelect, rows, e) => {
    if (isSelect && SOME_CONDITION) {
      return [1, 3, 4];  // finally, key 1, 3, 4 will being selected
    }
  }
};
```

### selectRow.selectColumnPosition - [String] {#selectColumnPosition}
Default is `left`. You can give this as `right` for rendering selection column in the right side.

```js
const selectRow = {
  mode: 'checkbox',
  selectColumnPosition: 'right'
};
```

### selectRow.hideSelectColumn - [Bool] {#hideSelectColumn}
Default is `false`, if you don't want to have a selection column, give this prop as `true`

```js
const selectRow = {
  mode: 'radio',
  hideSelectColumn: true,
  clickToSelect: true,
  bgColor: 'red'
};
```

### selectRow.hideSelectAll - [Bool] {#hideSelectAll}
Default is `false`, if you don't want to render the select all checkbox on the header of selection column, give this prop as `true`!

```js
const selectRow = {
  mode: 'checkbox',
  hideSelectAll: true
};
```
