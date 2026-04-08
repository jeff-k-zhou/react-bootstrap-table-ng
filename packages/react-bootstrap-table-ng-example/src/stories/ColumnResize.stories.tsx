import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, within } from 'storybook/test';

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
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } columnResize />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    expect(table).toBeInTheDocument();

    // Verify all 3 columns have resizer handles
    const resizers = canvasElement.querySelectorAll('.react-bootstrap-table-column-resizer');
    expect(resizers.length).toBe(3);
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
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      resizable: false
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } columnResize />
    `,
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    expect(table).toBeInTheDocument();

    // In MixedColumnResize, only the second column (index 1) is resizable
    const resizers = canvasElement.querySelectorAll('.react-bootstrap-table-column-resizer');
    expect(resizers.length).toBe(1);

    // Verify the resizer is inside the "Product Name" header cell
    const productNameHeader = canvas.getByText('Product Name').closest('th');
    const resizerInNameHeader = productNameHeader?.querySelector('.react-bootstrap-table-column-resizer');
    expect(resizerInNameHeader).toBeInTheDocument();
  }
};
