import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';

import { columns, productsGenerator } from '../utils/common';
import ColumnResize from './ColumnResize';
import bootstrapStyle from './bootstrap-style';

const meta = {
  title: 'Column Resize',
  component: ColumnResize as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object', description: 'table data' },
    columns: { control: 'object', description: 'table columns' },
    sourceCode: { control: 'text', description: 'source code of the table' },
    columnResize: { control: 'boolean', description: 'column resize flag' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof ColumnResize>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultColumnResize: Story = {
  name: "Default Column Resize",
  args: {
    columnResize: true,
    columns: columns.map(col => ({ ...col, resizable: true })),
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      resizable: true
    }, {
      dataField: 'name',
      text: 'Product Name',
      resizable: true
    }, {
      dataField: 'price',
      text: 'Product Price',
      resizable: true
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } columnResize />
    `,
  }
};

export const MixedColumnResize: Story = {
  name: "Mixed Column Resize",
  args: {
    columnResize: true,
    columns: columns.map((col, index) => ({ ...col, resizable: index === 1 })),
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      resizable: false
    }, {
      dataField: 'name',
      text: 'Product Name',
      resizable: true
    }, {
      dataField: 'price',
      text: 'Product Price',
      resizable: false
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } columnResize />
    `,
  }
};
