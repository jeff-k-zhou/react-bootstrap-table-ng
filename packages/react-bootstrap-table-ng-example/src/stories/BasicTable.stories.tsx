import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within, spyOn } from 'storybook/test';

// import bootstrap style by given version
import { columns, productsGenerator, sortFilterColumns } from '../utils/common';
import BootstrapTable from './BasicTable';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Basic Table',
  component: BootstrapTable as any,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'text', description: 'mode' },
    id: { control: 'text', description: 'id' },
    classes: { control: 'text', description: 'classes' },
    headerWrapperClasses: { control: 'text', description: 'headerWrapperClasses' },
    bodyClasses: { control: 'text', description: 'bodyClasses' },
    wrapperClasses: { control: 'text', description: 'wrapperClasses' },
    data: { control: 'object', description: 'table data' },
    caption: { control: 'object', description: 'table caption' },
    columns: { control: 'object', description: 'table columns' },
    selectRow: { control: 'object', description: 'table select row' },
    expandRow: { control: 'object', description: 'table expand row' },
    sourceCode: { control: 'text', description: 'source code of the table' },
    striped: { control: 'boolean', description: 'striped flag', table: { defaultValue: { summary: 'false' } } },
    hover: { control: 'boolean', description: 'hover flag', table: { defaultValue: { summary: 'false' } } },
    condensed: { control: 'boolean', description: 'condensed flag', table: { defaultValue: { summary: 'false' } } },
    bordered: { control: 'boolean', description: 'bordered flag', table: { defaultValue: { summary: 'true' } } },
    noDataIndication: { control: 'text', description: 'no data in the table indication' },
    tabIndexCell: { control: 'boolean', description: 'tab index cell', table: { defaultValue: { summary: 'false' } } },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicTable: Story = {
  name: "Basic table",
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

    <BootstrapTable keyField='id' data={ products } columns={ columns } />
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    expect(table).toBeInTheDocument();
    
    // Verify headers
    expect(canvas.getByText('Product ID')).toBeInTheDocument();
    expect(canvas.getByText('Product Name')).toBeInTheDocument();
    expect(canvas.getByText('Product Price')).toBeInTheDocument();

    // Verify row count (default generator is 5)
    // 1 header row + 5 data rows = 6
    const rows = canvas.getAllByRole('row');
    expect(rows).toHaveLength(6);
  }
};

export const StripedHoverCondensedTable: Story = {
  name: "Striped, hover, condensed table",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    // omit...

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      striped
      hover
      condensed
    />
    `,
    striped: true,
    hover: true,
    condensed: true,
  }
};

export const BorderlessTable: Story = {
  name: "Borderless table",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    // omit...

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
    const table = await canvas.findByRole('table');
    expect(table).not.toHaveClass('react-bootstrap-table-bordered');
  }
};

export const EmptyTable: Story = {
  name: "Indication for empty table",
  args: {
    columns: columns,
    data: [],
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    // omit...

    <BootstrapTable keyField='id' data={ [] } columns={ columns } noDataIndication="Table is Empty" />

    // Following is a more flexible example

    function indication() {
      // return something here
    }

    <BootstrapTable keyField='id' data={ [] } columns={ columns } noDataIndication={ indication } />
    `,
    noDataIndication: "Table is Empty",
  }
};

export const CustomizedIdAndClassTable: Story = {
  name: "Customized id and class table",
  args: {
    mode: "idAndClass",
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

    <BootstrapTable id="bar" keyField='id' data={ products } columns={ columns } />
    <BootstrapTable classes="foo" keyField="id" data={ products } columns={ columns } />
    <BootstrapTable headerWrapperClasses="foo" keyField="id" data={ products } columns={ columns } />
    <BootstrapTable bodyClasses="foo" keyField="id" data={ products } columns={ columns } />
    <BootstrapTable wrapperClasses="boo" keyField="id" data={ products } columns={ columns } />
    `,
    id: "bar",
    classes: "foo",
    headerWrapperClasses: "foo",
    bodyClasses: "foo",
    wrapperClasses: "boo",
  }
};

export const TableWithCaption: Story = {
  name: "Table with caption",
  args: {
    mode: "caption",
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

    const CaptionElement = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'purple', border: '1px solid purple', padding: '0.5em' }}>Component as Header</h3>;

    <BootstrapTable keyField="id" data={ products } caption="Plain text header" columns={ columns } />
    <BootstrapTable keyField="id" data={ products } caption={<CaptionElement />} columns={ columns } />
    `,
  }
};

const expandRow = {
  showExpandColumn: true,
  renderer: (row: any) => (
    <div>
      <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
      <p>You can render anything here, also you can add additional data on every row object</p>
      <p>expandRow.renderer callback will pass the origin row object to you</p>
    </div>
  )
};

export const LargeTable: Story = {
  name: "Large table",
  args: {
    columns: columns,
    data: productsGenerator(20),
    selectRow: { mode: 'checkbox', clickToSelect: true },
    expandRow: expandRow,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const rows = await canvas.findAllByRole('row');
    // 1 header row + 20 data rows = 21
    expect(rows).toHaveLength(21);
  }
};

export const ExposedAPITable: Story = {
  name: "Exposed API",
  args: {
    mode: "exposedAPI",
    columns: sortFilterColumns,
    data: productsGenerator(63),
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>
            You can render anything here, also you can add additional data on
            every row object
          </p>
          <p>
            expandRow.renderer callback will pass the origin row object to you
          </p>
        </div>
      ),
      showExpandColumn: true,
    },
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      sort: true
    }, {
      dataField: 'name',
      text: 'Product Name',
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      sort: true,
      filter: textFilter()
    }];

    const ExposedFunctionTable = () => {
      const node = React.useRef(null);

      const handleGetCurrentData = () => {
        console.log(node.current.table.props.data);
      }

      const handleGetSelectedData = () => {
        console.log(node.current.selectionContext.selected);
      }

      const handleGetExpandedData = () => {
        console.log(node.current.rowExpandContext.state.expanded);
      }

      const handleGetCurrentPage = () => {
        console.log(node.current.paginationContext.currPage);
      }

      const handleGetCurrentSizePerPage = () => {
        console.log(node.current.paginationContext.currSizePerPage);
      }

      const handleGetCurrentSortColumn = () => {
        console.log(node.current.sortContext.state.sortColumn);
      }

      const handleGetCurrentSortOrder = () => {
        console.log(node.current.sortContext.state.sortOrder);
      }

      const handleGetCurrentFilter = () => {
        console.log(node.current.filterContext.currFilters);
      }

      const expandRow = {
        renderer: row => (
          <div>
            <p>.....</p>
            <p>You can render anything here, also you can add additional data on every row object</p>
            <p>expandRow.renderer callback will pass the origin row object to you</p>
          </div>
        ),
        showExpandColumn: true
      };

      return (
        <div>
          <button className="btn btn-default" onClick={ handleGetCurrentData }>Get Current Display Rows</button>
          <button className="btn btn-default" onClick={ handleGetSelectedData }>Get Current Selected Rows</button>
          <button className="btn btn-default" onClick={ handleGetExpandedData }>Get Current Expanded Rows</button>
          <button className="btn btn-default" onClick={ handleGetCurrentPage }>Get Current Page</button>
          <button className="btn btn-default" onClick={ handleGetCurrentSizePerPage }>Get Current Size Per Page</button>
          <button className="btn btn-default" onClick={ handleGetCurrentSortColumn }>Get Current Sort Column</button>
          <button className="btn btn-default" onClick={ handleGetCurrentSortOrder }>Get Current Sort Order</button>
          <button className="btn btn-default" onClick={ handleGetCurrentFilter }>Get Current Filter Information</button>
          <BootstrapTable
            ref={ node }
            keyField="id"
            data={ products }
            columns={ columns }
            filter={ filterFactory() }
            pagination={ paginationFactory() }
            selectRow={ { mode: 'checkbox', clickToSelect: true } }
            expandRow={ expandRow }
          />
          <Code>{ sourceCode }</Code>
        </div>
      );
    }
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const buttons = [
      'Get Current Display Rows',
      'Get Current Selected Rows',
      'Get Current Expanded Rows',
      'Get Current Page',
      'Get Current Size Per Page',
      'Get Current Sort Column',
      'Get Current Sort Order',
      'Get Current Filter Information'
    ];
    
    // Wait for buttons to appear
    await canvas.findByText(buttons[0]);

    const consoleSpy = spyOn(console, 'log').mockName('console.log');
    
    for (const label of buttons) {
      const button = canvas.getByText(label);
      expect(button).toBeInTheDocument();
      if (label === 'Get Current Display Rows') {
        await userEvent.click(button);
        const loggedArray = consoleSpy.mock.calls[0][0];
        expect(loggedArray).toHaveLength(10);
        consoleSpy.mockClear();
      } else if (label === 'Get Current Selected Rows') {
        //find all checkbox
        const allCheckbox = canvas.getAllByRole('checkbox');
        await userEvent.click(allCheckbox[0]);
        await userEvent.click(button);
        const loggedArray = consoleSpy.mock.calls[0][0];
        expect(loggedArray).toHaveLength(10);
        await userEvent.click(allCheckbox[0]);
        await userEvent.click(button);
        const loggedArray2 = consoleSpy.mock.calls[1][0];
        expect(loggedArray2).toHaveLength(0);
        consoleSpy.mockClear();
      } else if (label === 'Get Current Expanded Rows') {
        await userEvent.click(button);
        const loggedArray = consoleSpy.mock.calls[0][0];
        expect(loggedArray).toHaveLength(0);
        //expand all rows
        const expandCells = canvas.getAllByText('(+)');
        await userEvent.click(expandCells[0]);
        await userEvent.click(button);
        const loggedArray2 = consoleSpy.mock.calls[1][0];
        expect(loggedArray2).toHaveLength(10);
        await userEvent.click(expandCells[1]);
        await userEvent.click(button);
        const loggedArray3 = consoleSpy.mock.calls[2][0];
        expect(loggedArray3).toHaveLength(9);
        consoleSpy.mockClear();
      } else if (label === 'Get Current Page') {
        await userEvent.click(button);
        expect(consoleSpy).toHaveBeenCalledWith(1);
        consoleSpy.mockClear();
      } else if (label === 'Get Current Size Per Page') {
        await userEvent.click(button);
        expect(consoleSpy).toHaveBeenCalledWith(10);
        consoleSpy.mockClear();
      } else if (label === 'Get Current Sort Column') {
        await userEvent.click(button);
        expect(consoleSpy).toHaveBeenCalledWith(undefined);
        const sColumn = canvas.getByText('Product ID');
        userEvent.click(sColumn); 
        await userEvent.click(button);
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({dataField: 'id', text: 'Product ID', sort: true}));
        consoleSpy.mockClear();
      } else if (label === 'Get Current Sort Order') {
        await userEvent.click(button);
        //expect(consoleSpy).toHaveBeenCalledWith(undefined);
        const sColumn = canvas.getByText('Product ID');
        userEvent.click(sColumn);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('sc'));
        consoleSpy.mockClear();
      } else if (label === 'Get Current Filter Information') {
        await userEvent.click(button);
        //expect empty filteer
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({}));
        consoleSpy.mockClear();
        //find filter input
        const filterInput = canvas.getByPlaceholderText('Enter Product Name...');
        await userEvent.type(filterInput, '1');
        //user press enter key
        await userEvent.type(filterInput, '{enter}');
        //wait for filter to apply
        await new Promise(resolve => setTimeout(resolve, 1000));
        await userEvent.click(button);
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({name: {caseSensitive: false, comparator: "LIKE", filterType: "TEXT", filterVal: "1"}}));
        consoleSpy.mockClear();
      }
    }

    // Check if table rendered
    expect(await canvas.findByRole('table')).toBeInTheDocument();
  }
};

export const EnableTabIndexOnCell: Story = {
  name: "Enable tabIndex on cell",
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

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ { mode: 'checkbox' } }
      tabIndexCell
    />
    `,
    selectRow: { mode: 'checkbox' },
    tabIndexCell: true,
  }
};
