---
id: cell-edit-props
title: Cell Editing Props
---
Following we list all props for `cellEditFactory` from [`react-bootstrap-table-ng-editor`](https://www.npmjs.com/package/react-bootstrap-table-ng-editor).

```js
import cellEditFactory from 'react-bootstrap-table-ng-editor';

const cellEdit = cellEditFactory({
  mode: 'click',
  ...
});

`<BootstrapTable` cellEdit={ cellEdit } ... />`
```


## Required
* [mode (**required**)](#celleditmode-string)

## Optional
* [blurToSave](#celleditblurtosave-bool)
* [nonEditableRows](#celleditnoneditablerows-function)
* [timeToCloseMessage](#celledittimetoclosemessage-function)
* [autoSelectText](#celleditautoselecttext-bool)
* [beforeSaveCell](#celleditbeforesavecell-function)
* [afterSaveCell](#celleditaftersavecell-function)
* [onStartEdit](#celleditonstartedit-function)
* [errorMessage](#cellediterrormessage-string)
* [onErrorMessageDisappear](#celleditonerrormessagedisappear-function)

-----

## cellEdit.mode - [String] {#celleditmode-string}
`cellEdit.mode` possible value is `click` and `dbclick`. **It's required value** that tell `react-bootstrap-table-ng` how to trigger the cell editing.

## cellEdit.blurToSave - [Bool] {#celleditblurtosave-bool}
Default is `false`, enable it will be able to save the cell automatically when blur from the cell editor.

## cellEdit.nonEditableRows - [Function] {#celleditnoneditablerows-function}
`cellEdit.nonEditableRows` accept a callback function and expect return an array which used to restrict all the columns of some rows as non-editable. So the each item in return array should be rowkey(`keyField`)

## cellEdit.timeToCloseMessage - [Function] {#celledittimetoclosemessage-function}
If a [`column.validator`](./column-props#columnvalidator-function) defined and the new value is invalid, `react-bootstrap-table-ng` will popup a alert at the bottom of editor. `cellEdit.timeToCloseMessage` is a chance to let you decide how long the alert should be stay. Default is 3000 millisecond.

## cellEdit.autoSelectText - [Bool] {#celleditautoselecttext-bool}
Default is false, when enable it, `react-bootstrap-table-ng` will help you to select the text in the text input automatically when editing.

 > NOTE: This props only work for `text` and `textarea`.

## cellEdit.beforeSaveCell - [Function] {#celleditbeforesavecell-function}
This callback function will be called before triggering cell update.

```js
const cellEdit = {
  // omit...
  beforeSaveCell: (oldValue, newValue, row, column) => { ... }
}
```

If you want to perform a async `beforeSaveCell`, you can do it like that:

```js
const cellEdit: {
  // omit...
  beforeSaveCell(oldValue, newValue, row, column, done) {
    setTimeout(() => {
      if (confirm('Do you want to accep this change?')) {
        done(); // contine to save the changes
      } else {
        done(false); // reject the changes
      }
    }, 0);
    return { async: true };
  }
};
```

## cellEdit.afterSaveCell - [Function] {#celleditaftersavecell-function}
This callback function will be called after updating cell.

```js
const cellEdit = {
  // omit...
  afterSaveCell: (oldValue, newValue, row, column) => { ... }
};
```

## cellEdit.onStartEdit - [Function] {#celleditonstartedit-function}
This callback function will be called after editor component mounted

```js
const cellEdit = {
  // omit...
  onStartEdit: (row, column, rowIndex, columnIndex) => { ... }
};
```

## cellEdit.errorMessage - [String] {#cellediterrormessage-string}
This prop is not often used. Only used when you want to keep the error message in your application state and also handle the cell editing on [`remote`](./table-props#remote-bool-object) mode.

## cellEdit.onErrorMessageDisappear - [Function] {#celleditonerrormessagedisappear-function}
This callback function will be called when error message discard so that you can sync the newest error message to your state if you have.