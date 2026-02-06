# Cell Editing
Before start to use cell edit, please remember to install `react-bootstrap-table-ng-editor`

```sh
$ npm install react-bootstrap-table-ng-editor --save
```

# Properties on cellEdit prop
* [mode (**required**)](#mode)
* [blurToSave](#blurToSave)
* [nonEditableRows](#nonEditableRows)
* [timeToCloseMessage](#timeToCloseMessage)
* [autoSelectText](#autoSelectText)
* [beforeSaveCell](#beforeSaveCell)
* [afterSaveCell](#afterSaveCell)
* [errorMessage](#errorMessage)
* [onErrorMessageDisappear](#onErrorMessageDisappear)

## cellEdit - [Object] {#cellEdit}
Assign a valid `cellEdit` object can enable the cell editing on the cell. The default usage is click/dbclick to trigger cell editing and press `ENTER` to save cell or press `ESC` to cancel editing.

> Note: The `keyField` column can't be edited

Following is the shape of `cellEdit` object:
```js
{
  mode: 'click',
  blurToSave: true,
  timeToCloseMessage: 2500,
  errorMessage: '',
  beforeSaveCell: (oldValue, newValue, row, column) => { ... },
  afterSaveCell: (oldValue, newValue, row, column) => { ... },
  onErrorMessageDisappear: () => { ... },
  nonEditableRows: () => { ... }
}
```

### cellEdit.mode - [String] {#mode}
`cellEdit.mode` possible value is `click` and `dbclick`. **It's required value** that tell `react-bootstrap-table-ng` how to trigger the cell editing.

### cellEdit.blurToSave - [Bool] {#blurToSave}
Default is `false`, enable it will be able to save the cell automatically when blur from the cell editor.

### cellEdit.nonEditableRows - [Function] {#nonEditableRows}
`cellEdit.nonEditableRows` accept a callback function and expect return an array which used to restrict all the columns of some rows as non-editable. So the each item in return array should be rowkey(`keyField`)

### cellEdit.autoSelectText - [Bool] {#autoSelectText}
Default is false, when enable it, `react-bootstrap-table-ng` will help you to select the text in the text input automatically when editing.

> NOTE: This props only work for `text` and `textarea`.

### cellEdit.timeToCloseMessage - [Function] {#timeToCloseMessage}
If a [`column.validator`](./columns.md#validator) defined and the new value is invalid, `react-bootstrap-table-ng` will popup a alert at the bottom of editor. `cellEdit.timeToCloseMessage` is a chance to let you decide how long the alert should be stay. Default is 3000 millisecond.

### cellEdit.beforeSaveCell - [Function] {#beforeSaveCell}
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
      if (confirm('Do you want to accept this change?')) {
        done(); // contine to save the changes
      } else {
        done(false); // reject the changes
      }
    }, 0);
    return { async: true };
  }
};
```

### cellEdit.afterSaveCell - [Function] {#afterSaveCell}
This callback function will be called after updating cell.

```js
const cellEdit = {
  // omit...
  afterSaveCell: (oldValue, newValue, row, column) => { ... }
};
```

### cellEdit.errorMessage - [String] {#errorMessage}
This prop is not often used. Only used when you want to keep the error message in your application state and also handle the cell editing on remote mode.

### cellEdit.onErrorMessageDisappear - [Function] {#onErrorMessageDisappear}
This callback function will be called when error message discard so that you can sync the newest error message to your state if you have.

