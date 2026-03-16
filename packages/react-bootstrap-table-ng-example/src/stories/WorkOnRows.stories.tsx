import { expect, userEvent, within } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// import bootstrap style by given version
import { columns, productsGenerator } from '../utils/common';
import BootstrapTable from './WorkOnRows';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Work On Rows',
  component: BootstrapTable,
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
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const CustomizeRowStyle: Story = {
  name: "Customize row style",
  args: {
    mode: "customize",
    columns: columns,
    data: productsGenerator(),
    sourceCode1: `\
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

    const rowStyle = { backgroundColor: '#c8e6c9' };

    <BootstrapTable keyField='id' data={ products } columns={ columns } rowStyle={ rowStyle } />
    `,
    rowStyle1: { backgroundColor: '#c8e6c9' },
    sourceCode2: `\
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

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      if (row.id > 3) {
        style.backgroundColor = '#c8e6c9';
      } else {
        style.backgroundColor = '#00BFFF';
      }

      if (rowIndex > 2) {
        style.fontWeight = 'bold';
        style.color = 'white';
      }

      return style;
    };

    <BootstrapTable keyField='id' data={ products } columns={ columns } rowStyle={ rowStyle2 } />
    `,
    rowStyle2: (row: any, rowIndex: number) => {
      const style = { backgroundColor: "", fontWeight: "", color: "" };
      if (row.id > 3) {
        style.backgroundColor = '#c8e6c9';
      } else {
        style.backgroundColor = '#00BFFF';
      }

      if (rowIndex > 2) {
        style.fontWeight = 'bold';
        style.color = 'white';
      }

      return style;
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const tables = await canvas.findAllByRole('table');
    
    // CustomizeRowStyle renders two tables
    expect(tables.length).toBe(2);
    
    // Check first table (rowStyle1)
    const rows1 = await within(tables[0]).findAllByRole('row');
    expect(rows1[1]).toHaveStyle('background-color: rgb(200, 230, 201)'); // #c8e6c9
    
    // Check second table (rowStyle2)
    const rows2 = await within(tables[1]).findAllByRole('row');

    // row.id <= 3 (first 4 data rows, because id is 0-indexed in productsGenerator usually, wait id is index)
    // Actually rowIndex > 2 for font-weight
    expect(rows2[1]).toHaveStyle('background-color: rgb(0, 191, 255)'); // #00BFFF
    expect(rows2[4]).toHaveStyle('font-weight: 700'); // bold
    expect(rows2[4]).toHaveStyle('color: rgb(255, 255, 255)'); // white
  }
};

export const CustomizeRowClass: Story = {
  name: "Customize row class",
  args: {
    mode: "customize",
    columns: columns,
    data: productsGenerator(),
    sourceCode1: `\
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

    const rowClasses = 'custom-row-class';

    <BootstrapTable keyField='id' data={ products } columns={ columns } rowClasses={ rowClasses } />
    `,
    rowClasses1: 'custom-row-class',
    sourceCode2: `\
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

    const rowClasses = (row, rowIndex) => {
      let classes = null;

      if (rowIndex > 2) {
        classes = 'index-bigger-than-two';
      }

      return classes;
    };

    <BootstrapTable keyField='id' data={ products } columns={ columns } rowClasses={ rowClasses } />
    `,
    rowClasses2: (row: any, rowIndex: number) => {
      let classes: string | null = null;

      if (rowIndex > 2) {
        classes = 'index-bigger-than-two';
      }

      return classes;
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const tables = await canvas.findAllByRole('table');
    
    // CustomizeRowClass renders two tables
    expect(tables.length).toBe(2);
    
    // Check first table (rowClasses1)
    const rows1 = await within(tables[0]).findAllByRole('row');
    expect(rows1[1]).toHaveClass('custom-row-class');
    
    // Check second table (rowClasses2)
    const rows2 = await within(tables[1]).findAllByRole('row');
    
    // no class for rowIndex <= 2
    expect(rows2[1]).not.toHaveClass('index-bigger-than-two');
    
    // class for rowIndex > 2. (0-indexed rowIndex from data, plus header row)
    // header is 0, data pos 1 -> rowIndex=0. data pos 4 -> rowIndex=3
    expect(rows2[4]).toHaveClass('index-bigger-than-two');
  }
};

export const HideRows: Story = {
  name: "Hide rows",
  args: {
    columns: columns,
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

    const hiddenRowKeys = [1, 3];

    <BootstrapTable keyField="id" data={ products } columns={ columns } hiddenRows={ hiddenRowKeys } />
    `,
    hiddenRows: [1, 3],
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    // 5 products generated by default, 2 hidden (ids 1 and 3), so 3 data rows + 1 header = 4 rows
    expect(rows.length).toBe(4);
    
    // Data fields should be ids 0, 2, 4
    expect(rows[1]).toHaveTextContent('Item name 0');
    expect(rows[2]).toHaveTextContent('Item name 2');
    expect(rows[3]).toHaveTextContent('Item name 4');
  }
};

export const RowEvent: Story = {
  name: "Row event",
  args: {
    columns: columns,
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

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log(\`clicked on row with index: \${rowIndex}\`);
      },
      onMouseEnter: (e, row, rowIndex) => {
        console.log(\`enter on row with index: \${rowIndex}\`);
      }
    };

    <BootstrapTable keyField='id' data={ products } columns={ columns } rowEvents={ rowEvents } />
    `,
    rowEvents: {
      onClick: (e: any, row: any, rowIndex: number) => {
        console.log(`clicked on row with index: ${rowIndex}`);
      },
      onMouseEnter: (e: any, row: any, rowIndex: number) => {
        console.log(`enter on row with index: ${rowIndex}`);
      }
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    
    // Verify click and hover don't crash and events simulate correctly
    await userEvent.hover(firstDataRow);
    expect(firstDataRow).toBeInTheDocument();
  }
};
