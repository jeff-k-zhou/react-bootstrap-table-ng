import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

import { productsGenerator } from '../utils/common';
import CellExpand from './CellExpand';
import bootstrapStyle from './bootstrap-style';

const meta = {
  title: 'Cell Expand',
  component: CellExpand as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof CellExpand>;

export default meta;

type Story = StoryObj<typeof meta>;

const data = productsGenerator(5).map((p: any) => ({
  ...p,
  name: 'This_is_a_very_long_product_name_that_should_be_truncated_with_ellipsis_and_expanded_on_hover ' + p.name,
}));

export const TableLevelExpandable: Story = {
  name: "Table Level Cell Expand (false)",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      style: { maxWidth: '150px' } 
    }, {
      dataField: 'price',
      text: 'Product Price',
      style: { maxWidth: '100px' }
    }],
    data,
    cellExpandable: false,
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

    <BootstrapTable keyField='id' data={ products } columns={ columns } cellExpandable={false} />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
    
    const rows = canvas.getAllByRole('row');
    // First data row (index 1), ID cell (index 0), Name cell (index 1), Price cell (index 2)
    const nameCell = rows[1].querySelectorAll('td')[1];
    const priceCell = rows[1].querySelectorAll('td')[2];
    
    expect(nameCell).not.toHaveClass('expandable-cell');
    expect(priceCell).not.toHaveClass('expandable-cell');
  }
};

export const TableLevelExpandableDefault: Story = {
  name: "Table Level Cell Expand Default (true)",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      style: { maxWidth: '150px' } 
    }, {
      dataField: 'price',
      text: 'Product Price',
      style: { maxWidth: '100px' }
    }],
    data,
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

    <BootstrapTable keyField='id' data={ products } columns={ columns }/>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
    
    const rows = canvas.getAllByRole('row');
    const nameCell = rows[1].querySelectorAll('td')[1];
    const priceCell = rows[1].querySelectorAll('td')[2];
    
    // By default, it should be true
    expect(nameCell).toHaveClass('expandable-cell');
    expect(priceCell).toHaveClass('expandable-cell');
  }
};

export const ColumnLevelExpandable: Story = {
  name: "Column Level Cell Expand (false on Price)",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      style: { maxWidth: '150px' }
    }, {
      dataField: 'price',
      text: 'Product Price',
      style: { maxWidth: '100px' },
      cellExpandable: false
    }],
    data,
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    // cellExpandable false on 'Product Price' column
    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
    }, {
      dataField: 'price',
      text: 'Product Price',
      cellExpandable: false
    }];

    // cellExpandable defaults to true at table level.
    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
    
    const rows = canvas.getAllByRole('row');
    const nameCell = rows[1].querySelectorAll('td')[1];
    const priceCell = rows[1].querySelectorAll('td')[2];
    
    // Name should have it (default table level true)
    expect(nameCell).toHaveClass('expandable-cell');
    // Price should NOT have it (explicitly false for this column)
    expect(priceCell).not.toHaveClass('expandable-cell');

    // Test hover effect (though we mainly check class, we can simulate)
    await userEvent.hover(nameCell);
    // The CSS handles the display change, so we verify the class presence.
  }
};
