import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

// import bootstrap style by given version
import { textFilter } from '../../../react-bootstrap-table-ng-filter';
import { columns, productsGenerator } from '../utils/common';
import BootstrapTable from './ColumnToggle';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Column Toggle',
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
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicColumnToggle: Story = {
  name: "Basic column toggle",
  args: {
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
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Verify initial headers using role to distinguish from buttons
    expect(canvas.getByRole('columnheader', { name: 'Product ID' })).toBeInTheDocument();
    expect(canvas.getByRole('columnheader', { name: 'Product Name' })).toBeInTheDocument();
    expect(canvas.getByRole('columnheader', { name: 'Product Price' })).toBeInTheDocument();

    // Toggle "Product Name"
    const toggleBtn = canvas.getByRole('button', { name: 'Product Name' });
    await userEvent.click(toggleBtn);

    // Verify "Product Name" header is gone (button still exists)
    expect(canvas.queryByRole('columnheader', { name: 'Product Name' })).not.toBeInTheDocument();

    // Toggle back
    await userEvent.click(toggleBtn);
    expect(canvas.getByRole('columnheader', { name: 'Product Name' })).toBeInTheDocument();
  }
};

export const DefaultVisibility: Story = {
  name: "Default visibility",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      hidden: true
    }, {
      dataField: 'price',
      text: 'Product Price',
      hidden: true
    }],
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
      text: 'Product Name',
      hidden: true
    }, {
      dataField: 'price',
      text: 'Product Price',
      hidden: true
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
            <BootstrapTable { ...props.baseProps } />
          </div>
        )
      }
    </ToolkitProvider>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Initially only ID is visible as header
    expect(canvas.getByRole('columnheader', { name: 'Product ID' })).toBeInTheDocument();
    expect(canvas.queryByRole('columnheader', { name: 'Product Name' })).not.toBeInTheDocument();
    expect(canvas.queryByRole('columnheader', { name: 'Product Price' })).not.toBeInTheDocument();

    // Toggle "Product Price"
    const toggleBtn = canvas.getByRole('button', { name: 'Product Price' });
    await userEvent.click(toggleBtn);

    // Verify "Product Price" header appeared
    expect(canvas.getByRole('columnheader', { name: 'Product Price' })).toBeInTheDocument();
  }
};

export const StylingColumnToggle: Story = {
  name: "Styling column toggle",
  args: {
    mode: "styling",
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
            <ToggleList
              contextual="success"
              className="list-custom-class"
              btnClassName="list-btn-custom-class"
              { ...props.columnToggleProps }
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
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Verify custom class
    const container = canvasElement.querySelector('.list-custom-class');
    expect(container).toBeInTheDocument();

    // Basic toggle check
    const toggleBtn = canvas.getByRole('button', { name: 'Product ID' });
    await userEvent.click(toggleBtn);
    expect(canvas.queryByRole('columnheader', { name: 'Product ID' })).not.toBeInTheDocument();
  }
};

export const CustomColumnToggle: Story = {
  name: "Custom column toggle",
  args: {
    mode: "custom",
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

    const CustomToggleList = ({
      columns,
      onColumnToggle,
      toggles
    }) => (
      <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons">
        {
          columns
            .map(column => ({
              ...column,
              toggle: toggles[column.dataField]
            }))
            .map(column => (
              <button
                type="button"
                key={ column.dataField }
                className={ \`btn btn-warning \${column.toggle ? 'active' : ''}\` }
                data-toggle="button"
                aria-pressed={ column.toggle ? 'true' : 'false' }
                onClick={ () => onColumnToggle(column.dataField) }
              >
                { column.text }
              </button>
            ))
        }
      </div>
    );

    <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columnsdt }
      columnToggle
    >
      {
        props => (
          <div>
            <CustomToggleList { ...props.columnToggleProps } />
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
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Verify custom buttons exist (they are btn-warning)
    const customBtns = canvasElement.querySelectorAll('.btn-warning');
    expect(customBtns.length).toBe(3);

    // Toggle "Product Price"
    const toggleBtn = canvas.getByRole('button', { name: 'Product Price' });
    await userEvent.click(toggleBtn);

    // Verify "Product Price" header is gone
    expect(canvas.queryByRole('columnheader', { name: 'Product Price' })).not.toBeInTheDocument();
  }
};

export const ColumnToggleWithFilter: Story = {
  name: "Column toggle with filter",
  args: {
    mode: "filter",
    columns: [{
      dataField: 'id',
      text: 'Product ID'
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
    }],
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';
    import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table-ng-toolkit';

    const { ToggleList } = ColumnToggle;
    const columns = [{
      dataField: 'id',
      text: 'Product ID'
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
              filter={ filterFactory() }
            />
          </div>
        )
      }
    </ToolkitProvider>
    `,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();

    // Toggle "Product ID" first to see if headers are accessible
    const toggleBtn = canvas.getByRole('button', { name: 'Product ID' });
    await userEvent.click(toggleBtn);
    
    // Verify header absence
    await new Promise(resolve => setTimeout(resolve, 500));
    const headers = canvasElement.querySelectorAll('th');
    const headerTexts = Array.from(headers).map(h => h.textContent);
    expect(headerTexts).not.toContain('Product ID');

    // Toggle back
    await userEvent.click(toggleBtn);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Now verify we have the input (using a more generic query if placeholder is tricky)
    const inputs = canvasElement.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2); // name and price filters
  }
};
