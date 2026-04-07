import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

// import bootstrap style by given version
import { columns, productsExpandRowsGenerator } from '../utils/common';
import BootstrapTable from './RowExpand';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Row Expand',
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
    sourceCode1: { control: 'text', description: 'source code of the table' },
    sourceCode2: { control: 'text', description: 'source code of the table' },
    expandRow: { control: 'object', description: 'row list' },
    expandRow1: { control: 'object', description: 'row list' },
    expandRow2: { control: 'object', description: 'row list' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicRowExpand: Story = {
  name: "Basic row expand",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any, rowIndex: number) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id} and index: ${rowIndex}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    // initially just data rows
    expect(rows.length).toBe(6); // 1 header + 5 items
    
    // click row to expand
    const firstDataRow = rows[1];
    await userEvent.click(firstDataRow);
    
    // wait for expansion row text
    expect(await canvas.findByText('This Expand row is belong to rowKey 0 and index: 0')).toBeInTheDocument();
  }
};

export const ExpandManagement: Story = {
  name: "Expand management",
  args: {
    columns: columns,
    mode: "management",
    data: productsExpandRowsGenerator(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    
    // In ExpandManagement mode, we have buttons
    const expandButton = await canvas.findByText('Expand/Collapse 3rd row');
    await userEvent.click(expandButton);
    
    const rows = await within(table).findAllByRole('row');
    expect(rows.length).toBeGreaterThan(6); // expanded at least one row
  }
};

export const NoExpandableRows: Story = {
  name: "No expandable rows",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      nonExpandable: [1, 3]
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      nonExpandable: [1, 3]
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    const secondDataRow = rows[2];
    
    // Try to click expand indicator on row 1 (which is id 0, expandable)
    const expandCell1 = within(firstDataRow).getByText('(+)');
    await userEvent.click(expandCell1);
    
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
    
    // Try to click expand indicator on row 2 (which is id 1, non-expandable)
    // Actually when it's non-expandable, it doesn't render an indicator.
    // Let's verify no indicator is rendered for row 2
    expect(within(secondDataRow).queryByText('(+)')).not.toBeInTheDocument();
  }
};

export const ExpandIndicator: Story = {
  name: "Expand indicator",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    const expandIndicator = within(firstDataRow).getByText('(+)');
    await userEvent.click(expandIndicator);
    
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
  }
};

export const OnlyExpandByIndicator: Story = {
  name: "Only expand by indicator",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandByColumnOnly: true
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandByColumnOnly: true
    },
    header: <h3>Only able to expand row via clicking expand column (indicator)</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    
    // clicking on other cells should not expand
    const dataCell = within(firstDataRow).getAllByRole('cell')[1]; // name col
    await userEvent.click(dataCell);
    expect(canvas.queryByText('This Expand row is belong to rowKey 0')).not.toBeInTheDocument();
    
    // clicking on indicator column should expand
    const expandIndicator = within(firstDataRow).getByText('(+)');
    await userEvent.click(expandIndicator);
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
  }
};

export const ExpandOnlyOneRowAtTheSameTime: Story = {
  name: "Expand only one row at the same time",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      onlyOneExpanding: true,
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      onlyOneExpanding: true,
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    const secondDataRow = rows[2];
    
    // click first row
    await userEvent.click(firstDataRow);
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
    
    // click second row
    await userEvent.click(secondDataRow);
    expect(await canvas.findByText('This Expand row is belong to rowKey 1')).toBeInTheDocument();
    
    // first row should be collapsed now
    await waitFor(() => {
      expect(canvas.queryByText('This Expand row is belong to rowKey 0')).not.toBeInTheDocument();
    });
  }
};

export const CustomExpandIndicator: Story = {
  name: "Custom expand indicator",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        if (isAnyExpands) {
          return <b>-</b>;
        }
        return <b>+</b>;
      },
      expandColumnRenderer: ({ expanded }) => {
        if (expanded) {
          return (
            <b>-</b>
          );
        }
        return (
          <b>...</b>
        );
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }: any) => {
        if (isAnyExpands) {
          return <b>-</b>;
        }
        return <b>+</b>;
      },
      expandColumnRenderer: ({ expanded, rowKey, expandable }: any) => {
        if (expanded) {
          return (
            <b>-</b>
          );
        }
        return (
          <b>...</b>
        );
      }
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    
    // check expandHeader indicator
    const headerRow = rows[0];
    const headerIndicator = within(headerRow).getByText('+');
    expect(headerIndicator).toBeInTheDocument();
    
    // check row indicator
    const rowIndicator = within(firstDataRow).getByText('...');
    expect(rowIndicator).toBeInTheDocument();
    
    // click to expand
    await userEvent.click(rowIndicator);
    
    // check expanded row indicator
    expect(within(firstDataRow).getByText('-')).toBeInTheDocument();
    expect(within(headerRow).getByText('-')).toBeInTheDocument(); // header changes when any row is expanded
  }
};

export const ExpandColumnPosition: Story = {
  name: "Expand column position",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandColumnPosition: 'right'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      expandColumnPosition: 'right'
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole('cell');
    
    // expand column should be the last one (index 3 out of 4 total columns)
    expect(cells[3]).toHaveTextContent('(+)');
  }
};

export const ExpandHooks: Story = {
  name: "Expand hooks",
  args: {
    columns: columns,
    data: productsExpandRowsGenerator(),
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

    const expandRow = {
      renderer: row => (
        <div>
          <p>{ \`This Expand row is belong to rowKey $\{row.id}\` }</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      onExpand: (row, isExpand, rowIndex, e) => {
        console.log(row.id);
        console.log(isExpand);
        console.log(rowIndex);
        console.log(e);
      },
      onExpandAll: (isExpandAll, rows, e) => {
        console.log(isExpandAll);
        console.log(rows);
        console.log(e);
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow: {
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      ),
      showExpandColumn: true,
      onExpand: (row: any, isExpand: boolean, rowIndex: number, e: any) => {
        console.log(row.id);
        console.log(isExpand);
        console.log(rowIndex);
        console.log(e);
      },
      onExpandAll: (isExpandAll: boolean, rows: any, e: any) => {
        console.log(isExpandAll);
      }
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table');
    const rows = await within(table).findAllByRole('row');
    
    const firstDataRow = rows[1];
    const expandIndicator = within(firstDataRow).getByText('(+)');
    
    // test doesn't check console output natively easily but we ensure no crashes occur.
    await userEvent.click(expandIndicator);
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
  }
};

export const CustomParentRowClassname: Story = {
  name: "Custom parent row classname",
  args: {
    mode: "style",
    columns: columns,
    data: productsExpandRowsGenerator(),
    sourceCode1: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = // omit...

    const expandRow = {
      parentClassName: 'parent-expand-foo',
      renderer: row => (
        <div>.....</div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    sourceCode2: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = // omit...

    const expandRow = {
      parentClassName: (isExpanded, row, rowIndex) => {
        if (rowIndex > 2) return 'parent-expand-foo';
        return 'parent-expand-bar';
      },
      renderer: row => (
        <div>...</div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow1: {
      parentClassName: 'parent-expand-foo',
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    },
    expandRow2: {
      parentClassName: (isExpanded: boolean, row: any, rowIndex: number) => {
        if (rowIndex > 2) return 'parent-expand-foo';
        return 'parent-expand-bar';
      },
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const tables = await canvas.findAllByRole('table');
    
    expect(tables.length).toBe(2);
    
    // first table
    const rows1 = await within(tables[0]).findAllByRole('row');
    const firstDataRow1 = rows1[1];
    await userEvent.click(firstDataRow1);
    // Add wait to avoid flakiness with parent class toggling immediately
    expect(firstDataRow1).toHaveClass('parent-expand-foo');
    
    // second table
    const rows2 = await within(tables[1]).findAllByRole('row');
    const firstDataRow2 = rows2[1];
    await userEvent.click(firstDataRow2);
    expect(firstDataRow2).toHaveClass('parent-expand-bar'); // rowIndex <= 2 gets bar
  }
};

export const CustomExpandingRowClassname: Story = {
  name: "Custom expanding row classname",
  args: {
    mode: "style",
    columns: columns,
    data: productsExpandRowsGenerator(),
    sourceCode1: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = // omit...

    const expandRow = {
      className: 'expanding-foo',
      renderer: row => (
        <div>.....</div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    sourceCode2: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = // omit...

    const expandRow = {
      className: (isExpanded, row, rowIndex) => {
        if (rowIndex > 2) return 'expanding-foo';
        return 'expanding-bar';
      },
      renderer: row => (
        <div>...</div>
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      expandRow={ expandRow }
    />
    `,
    expandRow1: {
      className: 'expanding-foo',
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    },
    expandRow2: {
      className: (isExpanded: boolean, row: any, rowIndex: number) => {
        if (rowIndex > 2) return 'expanding-foo';
        return 'expanding-bar';
      },
      renderer: (row: any) => (
        <div>
          <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
          <p>You can render anything here, also you can add additional data on every row object</p>
          <p>expandRow.renderer callback will pass the origin row object to you</p>
        </div>
      )
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const tables = await canvas.findAllByRole('table');
    
    // first table
    const rows1 = await within(tables[0]).findAllByRole('row');
    await userEvent.click(rows1[1]);
    
    // Find the newly appeared expanded row. It's inserted right after rows[1].
    // Since rows was queried statically before expansion, query again.
    const newRows1 = await within(tables[0]).findAllByRole('row');
    expect(within(newRows1[2]).getByRole('cell')).toHaveClass('expanding-foo');
    
    // second table
    const rows2 = await within(tables[1]).findAllByRole('row');
    await userEvent.click(rows2[1]);
    
    const newRows2 = await within(tables[1]).findAllByRole('row');
    expect(within(newRows2[2]).getByRole('cell')).toHaveClass('expanding-bar');
  }
};
