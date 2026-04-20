import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

import { columns, productsGenerator } from '../utils/common';
import TableOperation from './TableOperation';
import bootstrapStyle from './bootstrap-style';

const meta = {
  title: 'Table Operation',
  component: TableOperation as any,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof TableOperation>;

export default meta;

type Story = StoryObj<typeof meta>;

const sourceCodeInsertInline = `
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { InsertRowButton } from 'react-bootstrap-table-ng-toolkit';
import cellEditFactory from 'react-bootstrap-table-ng-editor';

<ToolkitProvider
  keyField="id"
  data={ products }
  columns={ columns }
  insertRow={ (newRow) => { /* handle insert */ } }
>
  {
    props => (
      <div>
        <InsertRowButton { ...props.opProps } initRow={{ name: 'New Product', price: 0 }} />
        <BootstrapTable
          { ...props.baseProps }
          cellEdit={ cellEditFactory({ mode: 'click' }) }
        />
      </div>
    )
  }
</ToolkitProvider>
`;

const sourceCodeInsertEmptyInline = `
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { InsertRowButton } from 'react-bootstrap-table-ng-toolkit';
import cellEditFactory from 'react-bootstrap-table-ng-editor';

<ToolkitProvider
  keyField="id"
  data={ products }
  columns={ columns }
  insertRow={ (newRow) => { /* handle insert */ } }
>
  {
    props => (
      <div>
        <InsertRowButton { ...props.opProps } />
        <BootstrapTable
          { ...props.baseProps }
          cellEdit={ cellEditFactory({ mode: 'click' }) }
        />
      </div>
    )
  }
</ToolkitProvider>
`;

const sourceCodeInsertModalRow = `
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { InsertModalToggle } from 'react-bootstrap-table-ng-toolkit';
import cellEditFactory from 'react-bootstrap-table-ng-editor';

<ToolkitProvider
  keyField="id"
  data={ products }
  columns={ columns }
  insertRow={ (newRow) => { /* handle insert */ } }
>
  {
    props => (
      <div>
        <InsertModalToggle { ...props.opProps } columns={ props.columnToggleProps.columns } />
        <BootstrapTable
          { ...props.baseProps }
          cellEdit={ cellEditFactory({ mode: 'click' }) }
        />
      </div>
    )
  }
</ToolkitProvider>
`;

const sourceCodeDeleteSelectedRow = `
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { DeleteRowButton } from 'react-bootstrap-table-ng-toolkit';

<ToolkitProvider
  keyField="id"
  data={ products }
  columns={ columns }
  deleteRow={ (rowKeys) => { /* handle delete */ } }
>
  {
    props => (
      <div>
        <DeleteRowButton { ...props.opProps } />
        <BootstrapTable
          { ...props.baseProps }
          selectRow={{ mode: 'checkbox' }}
        />
      </div>
    )
  }
</ToolkitProvider>
`;

export const InsertInlineRow: Story = {
  name: "Add row inline",
  args: {
    columns: columns,
    products: productsGenerator(),
    mode: "inline",
    enableCellEdit: true,
    sourceCode: sourceCodeInsertInline
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const addBtn = await canvas.findByRole('button', { name: /New Row/i });
    expect(addBtn).toBeInTheDocument();
  }
};


export const InsertEmptyInlineRow: Story = {
  name: "Add completely empty row inline",
  args: {
    columns: columns,
    products: productsGenerator(),
    mode: "empty-inline",
    enableCellEdit: true,
    sourceCode: sourceCodeInsertEmptyInline
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const addBtn = await canvas.findByRole('button', { name: /New Row/i });
    expect(addBtn).toBeInTheDocument();
  }
};

export const InsertModalRow: Story = {
  name: "Add row with modal",
  args: {
    columns: columns,
    products: productsGenerator(),
    mode: "modal",
    enableCellEdit: true,
    sourceCode: sourceCodeInsertModalRow
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const addBtn = await canvas.findByRole('button', { name: /New Record/i });
    expect(addBtn).toBeInTheDocument();
  }
};

export const DeleteSelectedRow: Story = {
  name: "Delete selected row",
  args: {
    columns: columns,
    products: productsGenerator(),
    mode: "delete",
    enableCellEdit: false,
    sourceCode: sourceCodeDeleteSelectedRow
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const deleteBtn = await canvas.findByRole('button', { name: /Delete Selected Rows/i });
    expect(deleteBtn).toBeInTheDocument();
  }
};
