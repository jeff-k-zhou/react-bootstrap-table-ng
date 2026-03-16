import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from '@storybook/test';

// import bootstrap style by given version
import { productsGenerator, withOnSale } from '../utils/common';
import BootstrapTable from './WorkOnColumns';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Work On Columns',
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
    bordered: { control: 'boolean', description: 'to have or not to have table border' },
    header: { control: 'text', description: 'header of the table' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const DisplayNestedData: Story = {
  name: "Display nested data",
  args: {
    columns: [{
      dataField: 'id',
      text: 'User ID'
    }, {
      dataField: 'name',
      text: 'User Name'
    }, {
      dataField: 'phone',
      text: 'Phone'
    }, {
      dataField: 'address.city',
      text: 'City'
    }, {
      dataField: 'address.postCode',
      text: 'PostCode'
    }],
    data: productsGenerator(5, (value: any, index: number) => ({
      id: index,
      name: `User Name ${index}`,
      phone: 21009831 + index,
      address: {
        city: 'New York',
        postCode: '1111-4512'
      }
    })),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'User ID'
    }, {
      dataField: 'name',
      text: 'User Name'
    }, {
      dataField: 'phone',
      text: 'Phone'
    }, {
      dataField: 'address.city',
      text: 'City'
    }, {
      dataField: 'address.postCode',
      text: 'PostCode'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    expect(table).toBeInTheDocument();

    // Verify headers
    expect(canvas.getByText('User ID')).toBeInTheDocument();
    expect(canvas.getByText('User Name')).toBeInTheDocument();
    expect(canvas.getByText('Phone')).toBeInTheDocument();
    expect(canvas.getByText('City')).toBeInTheDocument();
    expect(canvas.getByText('PostCode')).toBeInTheDocument();

    // Verify data for a few rows using better selectors
    const rows = canvas.getAllByRole('row');
    // rows[0] is header
    const firstDataRow = rows[1];
    expect(within(firstDataRow).getByText('User Name 0')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('New York')).toBeInTheDocument();
    expect(within(firstDataRow).getByText('1111-4512')).toBeInTheDocument();
  }
};

function priceFormatter(cell: number, row: any) {
  if (row.onSale) {
    return (
      <span><strong style={{ color: 'red' }}>$ {cell} NTD(Sales!!)</strong></span>
    );
  }

  return (
    <span>$ {cell} NTD</span>
  );
}

export const ColumnFormatter: Story = {
  name: "Column formatter",
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
      formatter: priceFormatter
    }],
    data: withOnSale(productsGenerator()),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    function priceFormatter(cell, row) {
      if (row.onSale) {
        return (
          <span>
            <strong style={ { color: 'red' } }>$ { cell } NTD(Sales!!)</strong>
          </span>
        );
      }

      return (
        <span>$ { cell } NTD</span>
      );
    }

    const columns = [
    // omit...
    {
      dataField: 'price',
      text: 'Product Price',
      formatter: priceFormatter
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
    />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const rows = canvas.getAllByRole('row');
    // Check if at least one sale item exists (randomly generated)
    const saleItems = canvas.queryAllByText(/\(Sales!!\)/);
    if (saleItems.length > 0) {
      expect(saleItems[0]).toHaveStyle('color: rgb(255, 0, 0)');
    }
    
    // Check first data row price format
    const firstDataRow = rows[1];
    const priceCell = within(firstDataRow).getAllByRole('cell')[2];
    expect(priceCell.textContent).toMatch(/\$ \d+ NTD/);
  }
};

function rankFormatter(cell: any, row: any, rowIndex: any, formatExtraData: any) {
  return (
    <i className={formatExtraData[cell]} />
  );
}

export const ColumnFormatterWithCustomData: Story = {
  name: "Column formatter with custom data",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'rank',
      text: 'Rank',
      formatter: rankFormatter,
      formatExtraData: {
        up: 'glyphicon glyphicon-chevron-up',
        down: 'glyphicon glyphicon-chevron-down'
      }
    }],
    data: productsGenerator(5, (value: any, index: number) => ({
      id: index,
      name: `User Name ${index}`,
      rank: Math.random() < 0.5 ? 'down' : 'up'
    })),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    function rankFormatter(cell, row, rowIndex, formatExtraData) {
      return (
        <i className={ formatExtraData[cell] } />
      );
    }

    const columns = [
    // omit...
    {
      dataField: 'rank',
      text: 'Rank',
      formatter: rankFormatter,
      formatExtraData: {
        up: 'glyphicon glyphicon-chevron-up',
        down: 'glyphicon glyphicon-chevron-down'
    }];

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      bordered={ false }
    />
    `,
    bordered: false,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBe(6); // 1 header + 5 data rows

    // Verify icon exists in the Rank column of the first data row
    const firstDataRow = rows[1];
    const rankCell = within(firstDataRow).getAllByRole('cell')[2];
    const icon = rankCell.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon?.className).toMatch(/glyphicon-chevron-(up|down)/);
  }
};

export const ColumnAlign: Story = {
  name: "Column align",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      align: 'center'
    }, {
      dataField: 'name',
      text: 'Product Name',
      align: (cell: any, row: any, rowIndex: number, colIndex: any) => {
        if (rowIndex % 2 === 0) return 'right';
        return 'left';
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      align: 'center'
    }, {
      dataField: 'name',
      text: 'Product Name',
      align: (cell, row, rowIndex, colIndex) => {
        if (rowIndex % 2 === 0) return 'right';
        return 'left';
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const rows = canvas.getAllByRole('row');
    const firstDataRow = rows[1];
    const secondDataRow = rows[2];
    
    const cells1 = within(firstDataRow).getAllByRole('cell');
    const cells2 = within(secondDataRow).getAllByRole('cell');

    expect(cells1[0]).toHaveStyle('text-align: center');
    expect(cells1[1]).toHaveStyle('text-align: right');
    expect(cells2[1]).toHaveStyle('text-align: left');
  }
};

export const ColumnTitle: Story = {
  name: "Column title",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      title: true
    }, {
      dataField: 'name',
      text: 'Product Name',
      title: (cell: any, row: any, rowIndex: any, colIndex: any) => `this is custom title for ${cell}`
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      title: true
    }, {
      dataField: 'name',
      text: 'Product Name',
      title: (cell, row, rowIndex, colIndex) => \`this is custom title for \${cell}\`
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
    header: <h3>Try to hover on any Product Name cells</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const rows = canvas.getAllByRole('row');
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole('cell');

    // ID column has title=true
    expect(cells[0]).toHaveAttribute('title', cells[0].textContent || '');

    // Name column has custom title function
    const expectedTitle = `this is custom title for ${cells[1].textContent}`;
    expect(cells[1]).toHaveAttribute('title', expectedTitle);

    // Price column has no title attribute added by default
    expect(cells[2]).not.toHaveAttribute('title');
  }
};

export const ColumnHidden: Story = {
  name: "Column hidden",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      hidden: true
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      hidden: true
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const headers = await canvas.findAllByRole('columnheader');
    expect(headers.length).toBe(2);
    expect(headers[0]).toHaveTextContent('Product Name');
    expect(headers[1]).toHaveTextContent('Product Price');

    const rows = await canvas.findAllByRole('row');
    // rows[0] is header
    const firstDataRow = rows[1];
    expect(within(firstDataRow).getAllByRole('cell').length).toBe(2);
  }
};

export const ColumnEvent: Story = {
  name: "Column event",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      events: {
        onClick: (e: any, column: any, columnIndex: number, row: any, rowIndex: number) => {
          console.log('onClick on Product ID field');
        },
        onMouseEnter: (e: any, column: any, columnIndex: number, row: any, rowIndex: number) => {
          console.log('onMouseEnter on Product ID field');
        }
      }
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          console.log('onClick on Product ID field');
          alert('Click on Product ID field');
        },
        onMouseEnter: (e, column, columnIndex, row, rowIndex) => {
          console.log('onMouseEnter on Product ID field');
        }
      }
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
    header: <h3>Try to Click or Mouse over on Product ID columns</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const firstCell = (await canvas.findAllByRole('cell'))[0];
    await userEvent.click(firstCell);
    expect(firstCell).toBeInTheDocument();
  }
};

export const CustomizeColumnClass: Story = {
  name: "Customize column class",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      classes: 'demo-key-row'
    }, {
      dataField: 'name',
      text: 'Product Name',
      classes: (cell: any, row: any, rowIndex: number, colIndex: number) => {
        if (rowIndex % 2 === 0) return 'demo-row-even';
        return 'demo-row-odd';
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      classes: 'demo-key-row'
    }, {
      dataField: 'name',
      text: 'Product Name',
      classes: (cell, row, rowIndex, colIndex) => {
        if (rowIndex % 2 === 0) return 'demo-row-even';
        return 'demo-row-odd';
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Product Name');

    const row1 = canvas.getAllByRole('row')[1];
    const cells1 = within(row1).getAllByRole('cell');

    expect(cells1[0]).toHaveClass('demo-key-row');
    expect(cells1[1]).toHaveClass('demo-row-even');
  }
};

export const CustomizeColumnStyle: Story = {
  name: "Customize column style",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      style: {
        fontWeight: 'bold',
        fontSize: '18px'
      }
    }, {
      dataField: 'name',
      text: 'Product Name',
      style: (cell: any, row: any, rowIndex: number, colIndex: any) => {
        if (rowIndex % 2 === 0) {
          return {
            backgroundColor: '#81c784'
          };
        }
        return {
          backgroundColor: '#c8e6c9'
        };
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      style: {
        fontWeight: 'bold',
        fontSize: '18px'
      }
    }, {
      dataField: 'name',
      text: 'Product Name',
      style: (cell, row, rowIndex, colIndex) => {
        if (rowIndex % 2 === 0) {
          return {
            backgroundColor: '#81c784'
          };
        }
        return {
          backgroundColor: '#c8e6c9'
        };
      }
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Product Name');

    const row1 = canvas.getAllByRole('row')[1];
    const cells1 = within(row1).getAllByRole('cell');

    expect(cells1[0]).toHaveStyle('font-weight: 700');
    expect(cells1[1]).toHaveStyle('background-color: rgb(129, 199, 132)');
  }
};

export const CustomizeColumnHTMLAttribute: Story = {
  name: "Customize column HTML attribute",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      attrs: { title: 'id column' }
    }, {
      dataField: 'name',
      text: 'Product Name',
      attrs: (cell: any, row: any, rowIndex: number, colIndex: any) => ({ 'data-test': `customized data ${rowIndex}` })
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      attrs: { title: 'id column' }
    }, {
      dataField: 'name',
      text: 'Product Name',
      attrs: (cell, row, rowIndex, colIndex) => ({ 'data-test': \`customized data \${rowIndex}\` })
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
    header: <h3>Try to hover on Product ID Cell</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Product Name');

    const row1 = canvas.getAllByRole('row')[1];
    const cells1 = within(row1).getAllByRole('cell');

    expect(cells1[0]).toHaveAttribute('title', 'id column');
    expect(cells1[1]).toHaveAttribute('data-test', 'customized data 0');
  }
};

export const DummyColumn: Story = {
  name: "Dummy column",
  args: {
    mode: "dummy",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    // Find row with Item 13
    const row13 = await canvas.findByText('Item 13');
    const row = row13.closest('tr') as HTMLElement;
    
    // Verify initial state
    const checkbox = within(row).getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(within(row).getAllByText('Available')[0]).toBeInTheDocument();

    // Toggle stock status
    const toggleButton = canvas.getByText('Toggle item 13 stock status');
    await userEvent.click(toggleButton);

    // Verify updated state
    await waitFor(async () => {
      const updatedRow13 = await canvas.findByText('Item 13');
      const updatedRow = updatedRow13.closest('tr') as HTMLElement;
      const updatedCheckbox = within(updatedRow).getByRole('checkbox') as HTMLInputElement;
      expect(updatedCheckbox.checked).toBe(false);
    });
  }
};

export const RowExpandWithDummyColumn: Story = {
  name: "Row expand with dummy column formatter",
  args: {
    mode: "rowdummy",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table');

    const firstDataRow = canvas.getAllByRole('row')[1];
    const expandToggle = within(firstDataRow).getByText('(+)');
    await userEvent.click(expandToggle);
    
    const elements = await canvas.findAllByText('Content');
    expect(elements.length).toBeGreaterThan(0);
  }
};
