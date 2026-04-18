import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

// import bootstrap style by given version
import paginationFactory from "../../../react-bootstrap-table-ng-paginator";
import { columns, productsGenerator, sortColumns } from '../utils/common';
import BootstrapTable from './Bootstrap5';
import bootstrapStyle, { BOOTSTRAP_VERSION } from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Bootstrap 5',
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
    defaultSorted: { control: 'object', description: 'default sorted data field' },
    selectRow: { control: 'object', description: 'table select row' },
    pagination: { control: 'object', description: 'table pagination' },
  },
  decorators: [
    (Story: any) => bootstrapStyle(BOOTSTRAP_VERSION.FIVE)(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const defaultSorted = [{
  dataField: 'name',
  order: 'desc'
}];

export const SortTableWithBootstrap5: Story = {
  name: "Sort table with Bootstrap 5",
  args: {
    columns: sortColumns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      sort: true
    }, {
      dataField: 'name',
      text: 'Product Name',
      sort: true
    }, {
      dataField: 'price',
      text: 'Product Price',
      sort: true
    }];

    const defaultSorted = [{
      dataField: 'name',
      order: 'desc'
    }];

    <BootstrapTable
      bootstrap5
      keyField="id"
      data={ products }
      columns={ columns }
      defaultSorted={ defaultSorted }
    />
    `,
    defaultSorted: defaultSorted,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Click 'Product ID' header to trigger a sort
    const idHeader = canvas.getByText('Product ID');
    await userEvent.click(idHeader);

    // Table should still be present after sort
    expect(await canvas.findByRole('table', { hidden: true })).toBeInTheDocument();
  }
};

export const TableCaptionBootstrap5: Story = {
  name: "Table caption Bootstrap 5",
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

    <BootstrapTable bootstrap5 keyField="id" data={ products } caption="Plain text header" columns={ columns } />

    <BootstrapTable bootstrap5 keyField="id" data={ products } caption={<CaptionElement />} columns={ columns } />
    `,
  }
};

const selectRow = {
  mode: 'radio',
  clickToSelect: true
};

export const RowSelectionTableWithBootstrap5: Story = {
  name: "Row selection table with Bootstrap 5",
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

    const selectRow = {
      mode: 'radio',
      clickToSelect: true
    };

    <BootstrapTable
      bootstrap5
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: selectRow,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Find all radio buttons and click the first data row's radio
    const radios = canvas.getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);

    await userEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
  }
};

export const PaginationTableWithBootstrap5: Story = {
  name: "Pagination table with Bootstrap 5",
  args: {
    columns: columns,
    data: productsGenerator(87),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';

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

    <BootstrapTable bootstrap5 keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
    `,
    pagination: paginationFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });

    // Use role='link' to specifically target the pagination anchor, not data cells containing '2'
    const page2Link = canvas.getByRole('link', { name: '2' });
    await userEvent.click(page2Link);

    // Verify the parent <li> now has the 'active' class
    const activeLi = page2Link.closest('li');
    expect(activeLi).toHaveClass('active');
  }
};

export const ColumnToggleWithBootstrap5: Story = {
  name: "Columns toggle with Bootstrap 5",
  args: {
    mode: "toggle",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table-ng-toolkit';

    const { ToggleList } = ColumnToggle;
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

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      columnToggle
    >
      {
        props => (
          <div>
            <ToggleList { ...props.columnToggleProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Verify the table and toggle buttons render correctly
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Verify all 3 toggle buttons are present
    const toggleButtons = canvas.getAllByRole('button');
    expect(toggleButtons.length).toBeGreaterThanOrEqual(3);
  }
};

export const ToolkitsTableBootstrap5: Story = {
  name: "Toolkits table Bootstrap 5",
  args: {
    mode: "toolkits",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar, ClearSearchButton } = Search;
    const { ExportCSVButton } = CSVExport;

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

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      search
    >
      {
        props => (
          <div>
            <h3>Input something at below input field:</h3>
            <SearchBar { ...props.searchProps } />
            <ClearSearchButton { ...props.searchProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
            <ExportCSVButton { ...props.csvProps }>Export CSV!!</ExportCSVButton>
          </div>
        )
      }
    </ToolkitProvider>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Verify the search input is present
    const searchInput = await canvas.findByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();

    // Type into the search box and verify functionality
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Item name 0', { delay: 50 });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear button should be reachable
    const clearButton = await canvas.findByRole('button', { name: 'Clear' });
    expect(clearButton).toBeInTheDocument();
    await userEvent.click(clearButton);
  }
};
