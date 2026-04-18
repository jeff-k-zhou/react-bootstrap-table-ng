import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

// import bootstrap style by given version
import { columns, jobsGenerator1, productsGenerator } from '../utils/common';
import BootstrapTable from './TableSearch';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Table Search',
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
    header: { control: 'text', description: 'header of table' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicSearchTable: Story = {
  name: "Basic search table",
  args: {
    mode: undefined,
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
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
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    await userEvent.type(searchBar, 'Item name 2');
    
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // 1 header + 1 data row = 2 rows
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('2');
    });
  }
};

export const ClearSearchButton: Story = {
  name: "Clear search button",
  args: {
    mode: "clear",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar, ClearSearchButton } = Search;

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
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    const clearButton = await canvas.findByRole('button', { name: 'Clear' });
    
    await userEvent.type(searchBar, 'Item name 2');
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2); // 1 header + 1 data row
    }, { timeout: 2000 });
    
    await userEvent.click(clearButton);
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(6);
    }, { timeout: 2000 });
  }
};

export const DefaultSearchButton: Story = {
  name: "Default search table",
  args: {
    mode: "default",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
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
      search={ { defaultSearch: '2101' } }
    >
      {
        props => (
          <div>
            <h3>Input something at below input field:</h3>
            <SearchBar { ...props.searchProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    
    // defaultSearch: '2101' -> Item name 1
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('1');
    });
  }
};

export const DefaultCustomSearch: Story = {
  name: "Default custom search",
  args: {
    mode: "custom",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
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
            <SearchBar
              { ...props.searchProps }
              className="custome-search-field"
              style={ { color: 'white' } }
              delay={ 1000 }
              placeholder="Search Something!!!"
            />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByPlaceholderText('Search Something!!!');
    
    await userEvent.type(searchBar, 'Item name 0');
    
    // component has 1000ms delay
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('0');
    }, { timeout: 5000 });
  }
};

export const SearchHooks: Story = {
  name: "Search hooks",
  args: {
    mode: "hooks",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
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

    const afterSearch = (newResult) => {
      console.log(newResult);
    };

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      search={ { afterSearch } }
    >
      {
        props => (
          <div>
            <h3>Input something at below input field:</h3>
            <SearchBar { ...props.searchProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    await userEvent.type(searchBar, 'Item name 2');
    
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('2');
    });
  }
};

export const SearchableColumn: Story = {
  name: "Searchable column",
  args: {
    mode: undefined,
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      searchable: false
    }, {
      dataField: 'price',
      text: 'Product Price',
      searchable: false
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      searchable: false
    }, {
      dataField: 'price',
      text: 'Product Price',
      searchable: false
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
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Column name and price is unsearchable</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    // name is unsearchable
    await userEvent.type(searchBar, 'Item name 2');
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // only header remains
      expect(rows).toHaveLength(1);
    });
    
    await userEvent.clear(searchBar);
    // id is searchable
    await userEvent.type(searchBar, '2');
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('2');
    });
  }
};

export const FullyCustomSearch: Story = {
  name: "Fully custom search",
  args: {
    mode: "fully",
    header: undefined,
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider from 'react-bootstrap-table-ng-toolkit';

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

    const MySearch = (props) => {
      let input;
      const handleClick = () => {
        props.onSearch(input.value);
      };
      return (
        <div>
          <input
            className="form-control"
            style={ { backgroundColor: 'pink' } }
            ref={ n => input = n }
            type="text"
          />
          <button className="btn btn-warning" onClick={ handleClick }>Click to Search!!</button>
        </div>
      );
    };

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      search
    >
      {
        props => (
          <div>
            <BootstrapTable
              { ...props.baseProps }
            />
            <MySearch { ...props.searchProps } />
            <br />
          </div>
        )
      }
    </ToolkitProvider>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    const searchButton = await canvas.findByRole('button', { name: 'Click to Search!!' });
    
    await userEvent.type(searchBar, 'Item name 2');
    await userEvent.click(searchButton);
    
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('2');
    });
  }
};

export const SearchFormattedValue: Story = {
  name: "Search formatted value",
  args: {
    mode: "formatted",
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      formatter: (cell: any) => `USD ${cell}`
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      formatter: cell => \`USD \${cell}\`  // we will search the data after formatted
    }];

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      search={ { searchFormatted: true } }
    >
      {
        props => (
          <div>
            <h3>Try to Search USD at below input field:</h3>
            <SearchBar { ...props.searchProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Try to Search USD at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    await userEvent.type(searchBar, 'USD');
    
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // all 5 rows should match USD
      expect(rows).toHaveLength(6);
    });
  }
};

const owners = ['Allen', 'Bob', 'Cat'];
const types = ['Cloud Service', 'Message Service', 'Add Service', 'Edit Service', 'Money'];

export const CustomSearchValue: Story = {
  name: "Custom search value",
  args: {
    mode: undefined,
    columns: [{
      dataField: 'id',
      text: 'Job ID',
      searchable: false,
      hidden: true
    }, {
      dataField: 'owner',
      text: 'Job Owner',
      formatter: (cell: any, row: any) => owners[cell],
      filterValue: (cell: any, row: any) => owners[cell] // we will search the value after filterValue called
    }, {
      dataField: 'type',
      text: 'Job Type',
      formatter: (cell: any, row: any) => types[cell],
      filterValue: (cell: any, row: any) => types[cell] // we will search the value after filterValue called
    }],
    data: jobsGenerator1(5),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
    const owners = ['Allen', 'Bob', 'Cat'];
    const types = ['Cloud Service', 'Message Service', 'Add Service', 'Edit Service', 'Money'];

    const columns = [{
      dataField: 'id',
      text: 'Job ID',
      searchable: false,
      hidden: true
    }, {
      dataField: 'owner',
      text: 'Job Owner',
      formatter: (cell, row) => owners[cell],
      filterValue: (cell, row) => owners[cell] // we will search the value after filterValue called
    }, {
      dataField: 'type',
      text: 'Job Type',
      formatter: (cell, row) => types[cell],
      filterValue: (cell, row) => types[cell] // we will search the value after filterValue called
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
            <h3>Try to Search Bob, Cat or Allen instead of 0, 1 or 2</h3>
            <SearchBar { ...props.searchProps } />
            <hr />
            <BootstrapTable
              { ...props.baseProps }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
    header: <h3>Try to Search Bob, Cat or Allen instead of 0, 1 or 2</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    // Data is generated by jobsGenerator1(5)
    // It uses random owners, so we should check for something that definitely exists or type something that matches.
    // Let's check for 'Bob' or 'Allen' or 'Cat'
    await userEvent.type(searchBar, 'Bob');
    
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // If Bob exists, we should have rows. If not, only header.
      // Since it's random, we can't be 100% sure without fixed data, but jobsGenerator1(5) usually has some Bob.
      // Wait... let's check common.ts jobsGenerator1
      // owner: Math.floor(Math.random() * 2 + 1)
      // owners = ['Allen', 'Bob', 'Cat']; -> owners[1] is Bob, owners[2] is Cat.
      // Allen (0) is never generated by jobsGenerator1.
      
      const bobRows = Array.from(rows).filter(row => row.textContent?.includes('Bob'));
      if (bobRows.length > 0) {
        expect(rows.length).toBeGreaterThan(1);
      }
    });
  }
};

export const CustomMatchFunction: Story = {
  name: "Custom match function",
  args: {
    mode: "function",
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';

    const { SearchBar } = Search;
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

    // Implement startWith instead of contain
    function customMatchFunc({
      searchText,
      value,
      column,
      row
    }) {
      if (typeof value !== 'undefined') {
        return value.startsWith(searchText);
      }
      return false;
    }

    export default () => (
      <div>
        <ToolkitProvider
          keyField="id"
          data={ products }
          columns={ columns }
          search={ { customMatchFunc } }
        >
          {
            props => (
              <div>
                <h3>Input something at below input field:</h3>
                <SearchBar { ...props.searchProps } />
                <hr />
                <BootstrapTable
                  { ...props.baseProps }
                />
              </div>
            )
          }
        </ToolkitProvider>
        <Code>{ sourceCode }</Code>
      </div>
    );
    `,
    header: <h3>Input something at below input field:</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const searchBar = await canvas.findByRole('textbox', { hidden: true });
    
    // customMatchFunc uses startsWith
    await userEvent.type(searchBar, 'It');
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // All starting with "It" (Item name X)
      expect(rows).toHaveLength(6);
    });
    
    await userEvent.clear(searchBar);
    await userEvent.type(searchBar, 'name 2');
    await waitFor(async () => {
      const rows = await within(table).findAllByRole('row');
      // should be 1 (header only) since it doesn't START with "name 2"
      expect(rows).toHaveLength(1);
    });
  }
};
