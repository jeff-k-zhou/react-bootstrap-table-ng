import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

// import bootstrap style by given version
import cellEditFactory, { Type } from '../../../react-bootstrap-table-ng-editor';
import { columns, jobsGenerator, productsGenerator, productsQualityGenerator, stockGenerator, todosGenerator } from '../utils/common';
import BootstrapTable from './CellEditing';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Cell Editing',
  component: BootstrapTable as any,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'text', description: 'mode' },
    data: { control: 'object', description: 'table data' },
    columns: { control: 'object', description: 'table columns' },
    sourceCode: { control: 'text', description: 'source code of the table' },
    sort: { control: 'text', description: 'sort' },
    cellEdit: { control: 'object', description: 'cell edit object' },
    selectRow: { control: 'object', description: 'row list' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ClickToEdit: Story = {
  name: "Click to edit",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const DoubleClickToEdit: Story = {
  name: "Double click to edit",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'dbclick' }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Double-click the 'Product Name' cell in the first data row
    const cells = canvas.getAllByRole('cell');
    await userEvent.dblClick(cells[1]);

    // An inline text input should appear
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();

    // Press Escape to cancel editing
    await userEvent.keyboard('{Escape}');
  }
};

export const BlurToSaveCell: Story = {
  name: "Blur to save cell",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click a 'Product Name' cell to edit it
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[1]);

    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();

    // Clear and type a new value, then blur to save
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Name');
    await userEvent.tab(); // blur triggers save

    // The cell should now display the new value
    expect(await canvas.findByText('Updated Name')).toBeInTheDocument();
  }
};

export const RowLevelEditable: Story = {
  name: "Row level editable",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true,
        nonEditableRows: () => [0, 3]
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true, nonEditableRows: () => [0, 3] }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const rows = canvas.getAllByRole('row');

    // Row index 0 = header, Row index 1 = first data row (id=0, non-editable)
    const nonEditableRow = rows[1];
    const nonEditableCells = within(nonEditableRow).getAllByRole('cell');
    await userEvent.click(nonEditableCells[1]); // click name cell in non-editable row
    // No editor should appear for a non-editable row
    expect(canvas.queryByRole('textbox')).toBeNull();

    // Row index 2 = second data row (id=1, editable)
    const editableRow = rows[2];
    const editableCells = within(editableRow).getAllByRole('cell');
    await userEvent.click(editableCells[1]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const ColumnLevelEditable: Story = {
  name: "Column level editable",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editable: false
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
      // Product Name column can't be edit anymore
      editable: false
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const cells = canvas.getAllByRole('cell');

    // Click the non-editable 'Product Name' cell (editable: false)
    await userEvent.click(cells[1]);
    // No editor should appear
    expect(canvas.queryByRole('textbox')).toBeNull();

    // Click 'Product Price' cell (editable, cells[2])
    await userEvent.click(cells[2]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const CellLevelEditable: Story = {
  name: "Cell level editable",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editable: (content: any, row: any, rowIndex: number, columnIndex: number) => content > 2101
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editable: (content, row, rowIndex, columnIndex) => content > 2101
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    // productsGenerator price: row 0=2100 (NOT editable >2101), row 2=2102 (IS editable)
    const cells = canvas.getAllByRole('cell');

    // First row price (2100) should NOT be editable
    await userEvent.click(cells[2]);
    expect(canvas.queryByRole('textbox')).toBeNull();

    // Third row price (2102) IS editable (index=2, price=2102 > 2101)
    await userEvent.click(cells[8]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const RichHookFunctions: Story = {
  name: "Rich hook functions",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
        beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
        afterSaveCell: (oldValue, newValue, row, column) => { console.log('After Saving Cell!!'); }
      }) }
    />
    `,
    cellEdit: cellEditFactory({
      mode: 'click',
      onStartEdit: (row: any, column: any, rowIndex: any, columnIndex: any) => { console.log('Start to edit!!!'); },
      beforeSaveCell: (oldValue: any, newValue: any, row: any, column: any) => { console.log('Before Saving Cell!!'); },
      afterSaveCell: (oldValue: any, newValue: any, row: any, column: any) => { console.log('After Saving Cell!!'); }
    }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click a cell to start editing (fires onStartEdit)
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[1]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

function beforeSaveCell(oldValue: any, newValue: any, row: any, column: any, done: any) {
  setTimeout(() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Do you want to accep this change?')) {
      done(true);
    } else {
      done(false);
    }
  }, 0);
  return { async: true };
}

export const AsyncHookFunctions: Story = {
  name: "Async hook functions",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    function beforeSaveCell(oldValue, newValue, row, column, done) {
      setTimeout(() => {
        if (confirm('Do you want to accep this change?')) {
          done(true);
        } else {
          done(false);
        }
      }, 0);
      return { async: true };
    }

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        beforeSaveCell
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', beforeSaveCell }),
  },
  play: async ({ canvasElement }: any) => {
    // AsyncHookFunctions uses confirm() which can't be reliably tested in headless mode.
    // Smoke test: verify table renders.
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

export const Validation: Story = {
  name: "Validation ",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      validator: (newValue: any, row: any, column: any) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: 'Price should be numeric'
          };
        }
        if (newValue < 2000) {
          return {
            valid: false,
            message: 'Price should bigger than 2000'
          };
        }
        return true;
      }
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      validator: (newValue, row, column) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: 'Price should be numeric'
          };
        }
        if (newValue < 2000) {
          return {
            valid: false,
            message: 'Price should bigger than 2000'
          };
        }
        return true;
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Product Price should bigger than $2000</h3>,
  }
};

export const AsyncValidation: Story = {
  name: "Async validation",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      validator: (newValue: any, row: any, column: any, done: any) => {
        setTimeout(() => {
          if (isNaN(newValue)) {
            return done({
              valid: false,
              message: 'Price should be numeric'
            });
          }
          if (newValue < 2000) {
            return done({
              valid: false,
              message: 'Price should bigger than 2000'
            });
          }
          return done();
        }, 2000);
        return {
          async: true
        };
      }
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      validator: (newValue, row, column, done) => {
        setTimeout(() => {
          if (isNaN(newValue)) {
            return done({
              valid: false,
              message: 'Price should be numeric'
            });
          }
          if (newValue < 2000) {
            return done({
              valid: false,
              message: 'Price should bigger than 2000'
            });
          }
          return done();
        }, 2000);
        return {
          async: true
        };
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Product Price should bigger than $2000</h3>,
  }
};

export const AutoSelectTextInput: Story = {
  name: "Auto select text input",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.TEXTAREA
      }
    }],
    data: jobsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.TEXTAREA
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ jobs }
      columns={ columns }
      cellEdit={
        cellEditFactory({
          mode: 'click',
          autoSelectText: true
        })
      }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', autoSelectText: true }),
    header: <h3>Auto Select Text Input Field When Editing</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click 'Job Name' cell - plain text input with autoSelectText
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[1]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const CustomCellStyle: Story = {
  name: "Custom cell style",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editCellStyle: {
        backgroundColor: '#20B2AA'
      }
    }, {
      dataField: 'price',
      text: 'Product Price',
      editCellStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editCellStyle: {
        backgroundColor: '#20B2AA'
      }
    }, {
      dataField: 'price',
      text: 'Product Price',
      editCellStyle: (cell, row, rowIndex, colIndex) => {
        const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const CustomCellClasses: Story = {
  name: "Custom cell classes",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editCellClasses: 'editing-name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editCellClasses: (cell: any, row: any, rowIndex: any, colIndex: any) =>
        (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editCellClasses: 'editing-name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editCellClasses: (cell, row, rowIndex, colIndex) =>
        (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const CustomEditorClasses: Story = {
  name: "Custom editor classes",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editorClasses: 'editing-name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editorClasses: (cell: any, row: any, rowIndex: any, colIndex: any) =>
        (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editorClasses: 'editing-name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      editorClasses: (cell, row, rowIndex, colIndex) =>
        (cell > 2101 ? 'editing-price-bigger-than-2101' : 'editing-price-small-than-2101')
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const CustomEditorStyle: Story = {
  name: "Custom editor style",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editorStyle: {
        backgroundColor: '#20B2AA'
      }
    }, {
      dataField: 'price',
      text: 'Product Price',
      editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      editorStyle: {
        backgroundColor: '#20B2AA'
      }
    }, {
      dataField: 'price',
      text: 'Product Price',
      editorStyle: (cell, row, rowIndex, colIndex) => {
        const backgroundColor = cell > 2101 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const DoubleClickToEditWithSelection: Story = {
  name: "Double click to edit with selection",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToEdit: true
    };

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
      cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'dbclick' }),
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      clickToEdit: true
    },
    header: <h3>Double click to edit cell</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Double-click a data cell to start editing
    const cells = canvas.getAllByRole('cell');
    // cells[0] is checkbox, cells[1] is id, cells[2] is name
    await userEvent.dblClick(cells[2]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const DropdownEditor: Story = {
  name: "Dropdown editor",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.SELECT,
        options: [{
          value: 'A',
          label: 'A'
        }, {
          value: 'B',
          label: 'B'
        }, {
          value: 'C',
          label: 'C'
        }, {
          value: 'D',
          label: 'D'
        }, {
          value: 'E',
          label: 'E'
        }]
      }
    }],
    data: jobsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.SELECT,
        options: [{
          value: 'A',
          label: 'A'
        }, {
          value: 'B',
          label: 'B'
        }, {
          value: 'C',
          label: 'C'
        }, {
          value: 'D',
          label: 'D'
        }, {
          value: 'E',
          label: 'E'
        }]
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ jobs }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Dropdown Editor</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click 'Job Type' cell (dropdown editor, cells[3] in first row)
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[3]);

    // A <select> element should appear
    const select = await canvas.findByRole('combobox');
    expect(select).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const DropdownEditorWithDynamicOptions: Story = {
  name: "Dropdown editor with dynamic options",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type1',
      editor: {
        type: Type.SELECT,
        getOptions: (setOptions: any, { row, column }: any) => {
          console.log(`current editing row id: ${row.id}`);
          console.log(`current editing column: ${column.dataField}`);
          return [{
            value: 'A',
            label: 'A'
          }, {
            value: 'B',
            label: 'B'
          }, {
            value: 'C',
            label: 'C'
          }, {
            value: 'D',
            label: 'D'
          }, {
            value: 'E',
            label: 'E'
          }];
        }
      }
    }, {
      dataField: 'type2',
      text: 'Job Type2',
      editor: {
        type: Type.SELECT,
        getOptions: (setOptions: any) => {
          setTimeout(() => {
            setOptions([{
              value: 'A',
              label: 'A'
            }, {
              value: 'B',
              label: 'B'
            }, {
              value: 'C',
              label: 'C'
            }, {
              value: 'D',
              label: 'D'
            }, {
              value: 'E',
              label: 'E'
            }]);
          }, 2000);
        }
      }
    }],
    data: jobsGenerator().map(j => ({ ...j, type2: j.type })),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type1',
      editor: {
        type: Type.SELECT,
        getOptions: (setOptions, { row, column }) => {
          console.log(\`current editing row id: $\{row.id}\`);
          console.log(\`current editing column: $\{column.dataField}\`);
          return [{
            value: 'A',
            label: 'A'
          }, {
            value: 'B',
            label: 'B'
          }, {
            value: 'C',
            label: 'C'
          }, {
            value: 'D',
            label: 'D'
          }, {
            value: 'E',
            label: 'E'
          }];
        }
      }
    }, {
      dataField: 'type2',
      text: 'Job Type2',
      editor: {
        type: Type.SELECT,
        getOptions: (setOptions) => {
          setTimeout(() => {
            setOptions([{
              value: 'A',
              label: 'A'
            }, {
              value: 'B',
              label: 'B'
            }, {
              value: 'C',
              label: 'C'
            }, {
              value: 'D',
              label: 'D'
            }, {
              value: 'E',
              label: 'E'
            }]);
          }, 2000);
        }
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ jobs }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Dropdown Editor with Dynamic Options</h3>,
  },
  play: async ({ canvasElement }: any) => {
    // Dynamic options loaded asynchronously; smoke test only.
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

export const TextareaEditor: Story = {
  name: "Textarea editor",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.TEXTAREA
      }
    }],
    data: jobsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name'
    }, {
      dataField: 'owner',
      text: 'Job Owner'
    }, {
      dataField: 'type',
      text: 'Job Type',
      editor: {
        type: Type.TEXTAREA
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ jobs }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
  }
};

export const CheckboxEditor: Story = {
  name: "Checkbox editor",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Todo ID'
    }, {
      dataField: 'todo',
      text: 'Todo Name'
    }, {
      dataField: 'done',
      text: 'Done',
      editor: {
        type: Type.CHECKBOX,
        value: 'Y:N'
      }
    }],
    data: todosGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Todo ID'
    }, {
      dataField: 'todo',
      text: 'Todo Name'
    }, {
      dataField: 'done',
      text: 'Done',
      editor: {
        type: Type.CHECKBOX,
        value: 'Y:N'
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ todos }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Checkbox Editor</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click 'Done' cell (checkbox editor, cells[2] in first row)
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[2]);

    // A checkbox should appear
    const checkbox = await canvas.findByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

export const DateEditor: Story = {
  name: "Date editor",
  args: {
    columns: [{
      dataField: 'id',
      text: 'ID'
    }, {
      dataField: 'name',
      text: 'Name'
    }, {
      dataField: 'inStockDate',
      text: 'Stock Date',
      formatter: (cell: any) => {
        let dateObj = cell;
        if (typeof cell !== 'object') {
          dateObj = new Date(cell);
        }
        return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`;
      },
      editor: {
        type: Type.DATE
      }
    }],
    data: stockGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory, { Type } from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'ID'
    }, {
      dataField: 'name',
      text: 'Name'
    }, {
      dataField: 'inStockDate',
      text: 'Stock Date',
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== 'object') {
          dateObj = new Date(cell);
        }
        return \`$\{('0' + dateObj.getUTCDate()).slice(-2)}/$\{('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/$\{dateObj.getUTCFullYear()}\`;
      },
      editor: {
        type: Type.DATE
      }
    }];

    <BootstrapTable
      keyField="id"
      data={ stocks }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
    header: <h3>Date Editor</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Click 'Stock Date' cell (date editor, cells[2] in first row)
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[2]);

    // A date input should appear
    const dateInput = await canvas.findByDisplayValue(/\d{4}-\d{2}-\d{2}/);
    expect(dateInput).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};

interface QualityRangerProps {
  value?: number;
  onUpdate: (value: number) => void;
  didMount?: () => void;
}

const QualityRanger = ({ value = 0, onUpdate, didMount, ...rest }: QualityRangerProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.focus();
    }
  }, []);

  const getValue = () => {
    return parseInt(rangeRef.current?.value || '0', 10);
  };

  return (
    <>
      <input
        {...rest}
        name="quality"
        id={id}
        key="range"
        ref={rangeRef}
        type="range"
        min="0"
        max="100"
      />
      <button
        key="submit"
        className="btn btn-default"
        onClick={() => onUpdate(getValue())}
      >
        done
      </button>
    </>
  );
};

export const CustomEditor: Story = {
  name: "Custom editor",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      editorRenderer: (editorProps: any, value: any, row: any, column: any, rowIndex: any, columnIndex: any) => (
        <QualityRanger {...editorProps} value={value} />
      )
    }],
    data: productsQualityGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    interface QualityRangerProps {
      value?: number;
      onUpdate: (value: number) => void;
      didMount?: () => void;
    }

    const QualityRanger = ({ value = 0, onUpdate, ...rest }: QualityRangerProps) => {
      const rangeRef = React.useRef<HTMLInputElement>(null);

      const getValue = () => {
        return parseInt(rangeRef.current?.value || '0', 10);
      };

      return [
        <input
          { ...rest }
          key="range"
          ref={ rangeRef }
          type="range"
          min="0"
          max="100"
        />,
        <button
          key="submit"
          className="btn btn-default"
          onClick={ () => onUpdate(getValue()) }
        >
          done
        </button>
      ];
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
        <QualityRanger { ...editorProps } value={ value } />
      )
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true }),
  }
};

function afterSaveCell(oldValue: any, newValue: any) {
  console.log('--after save cell--');
  console.log('New Value was apply as');
  console.log(newValue);
  console.log(`and the type is ${typeof newValue}`);
}

export const CellEditorWithDataType: Story = {
  name: "Cell editor with data type",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Stock ID'
    }, {
      dataField: 'name',
      text: 'Stock Name'
    }, {
      dataField: 'price',
      text: 'Price',
      type: 'number'
    }, {
      dataField: 'visible',
      text: 'Visible?',
      type: 'bool',
      editor: {
        type: Type.CHECKBOX,
        value: 'true:false'
      }
    }, {
      dataField: 'inStockDate',
      text: 'Stock Date',
      type: 'date',
      formatter: (cell: any) => {
        let dateObj = cell;
        if (typeof cell !== 'object') {
          dateObj = new Date(cell);
        }
        return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`;
      },
      editor: {
        type: Type.DATE
      }
    }],
    data: stockGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

    const columns = [{
      dataField: 'id',
      text: 'Stock ID'
    }, {
      dataField: 'name',
      text: 'Stock Name'
    }, {
      dataField: 'price',
      text: 'Price',
      type: 'number'
    }, {
      dataField: 'visible',
      text: 'Visible?',
      type: 'bool',
      editor: {
        type: Type.CHECKBOX,
        value: 'true:false'
      }
    }, {
      dataField: 'inStockDate',
      text: 'Stock Date',
      type: 'date',
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== 'object') {
          dateObj = new Date(cell);
        }
        return \`$\{('0' + dateObj.getUTCDate()).slice(-2)}/$\{('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/$\{dateObj.getUTCFullYear()}\`;
      },
      editor: {
        type: Type.DATE
      }
    }];

    function afterSaveCell(oldValue, newValue) {
      console.log('--after save cell--');
      console.log('New Value was apply as');
      console.log(newValue);
      console.log(\`and the type is $\{typeof newValue}\`);
    }

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      cellEdit={ cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell
      }) }
    />
    `,
    cellEdit: cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Click 'Stock Name' (text) cell
    const cells = canvas.getAllByRole('cell');
    await userEvent.click(cells[1]);
    const input = await canvas.findByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  }
};
