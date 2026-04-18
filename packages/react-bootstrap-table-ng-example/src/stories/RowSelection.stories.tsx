import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

// import bootstrap style by given version
import cellEditFactory from '../../../react-bootstrap-table-ng-editor';
import { columns, productsGenerator } from '../utils/common';
import BootstrapTable from './RowSelection';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Row Selection',
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
    selectRow: { control: 'object', description: 'row list' },
    selectRow1: { control: 'object', description: 'row list' },
    selectRow2: { control: 'object', description: 'row list' },
    cellEdit: { control: 'object', description: 'cell edit object' },
    noDataIndication: { control: 'text', description: 'no data indication' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SingleSelection: Story = {
  name: "Single selection",
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
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'radio',
      clickToSelect: true
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    
    // initially nothing selected
    const radioInputs = canvas.getAllByRole('radio') as HTMLInputElement[];
    radioInputs.forEach(input => expect(input.checked).toBe(false));

    // click second row
    await userEvent.click(rows[2]); // rows[0] is header, rows[1] is id 0, rows[2] is id 1
    
    expect(radioInputs[1].checked).toBe(true);
    expect(radioInputs[0].checked).toBe(false);
  }
};

export const MultipleSelection: Story = {
  name: "Multiple selection",
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
      mode: 'checkbox',
      clickToSelect: true
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    
    const checkboxes = canvas.getAllByRole('checkbox') as HTMLInputElement[];
    
    // click first and second data rows
    await userEvent.click(rows[1]);
    await userEvent.click(rows[2]);
    
    expect(checkboxes[1].checked).toBe(true); // checkboxes[0] is select all
    expect(checkboxes[2].checked).toBe(true);
  }
};

export const ClickToSelect: Story = {
  name: "Click to select",
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
      mode: 'checkbox',
      clickToSelect: true
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    const checkboxes = await canvas.findAllByRole('checkbox') as HTMLInputElement[];
    
    // click on the name cell of the first row
    const nameCell = within(rows[1]).getByText('Item name 0');
    await userEvent.click(nameCell);
    
    expect(checkboxes[1].checked).toBe(true);
  }
};

export const DefaultSelect: Story = {
  name: "Default select",
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
      mode: 'checkbox',
      clickToSelect: true,
      selected: [1, 3]
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      selected: [1, 3]
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const checkboxes = await canvas.findAllByRole('checkbox') as HTMLInputElement[];
    
    // IDs are 0, 1, 2, 3, 4
    // selected are 1 and 3
    expect(checkboxes[2].checked).toBe(true); // id 1
    expect(checkboxes[4].checked).toBe(true); // id 3
    expect(checkboxes[1].checked).toBe(false); // id 0
  }
};

export const SelectManagement: Story = {
  name: "Select management",
  args: {
    mode: "management",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByText('Select/UnSelect 3rd row');
    
    const checkboxes = canvas.getAllByRole('checkbox') as HTMLInputElement[];
    // initially id 0 and 1 are selected (see RowSelection.tsx)
    expect(checkboxes[1].checked).toBe(true);
    expect(checkboxes[2].checked).toBe(true);
    expect(checkboxes[3].checked).toBe(false);
    
    await userEvent.click(button);
    expect(checkboxes[3].checked).toBe(true);
  }
};

const handleOnSelect = (row: any, isSelect: any) => {
  if (isSelect && row.id < 3) {
    alert('Oops, You can not select Product ID which less than 3');
    return false; // return false to deny current select action
  }
  return true; // return true or dont return to approve current select action
}

const handleOnSelectAll = (isSelect: any, rows: any) => {
  if (isSelect) {
    return rows.filter((r: any) => r.id >= 3).map((r: any) => r.id);
  }
}

export const AdvanceSelectionManagement: Story = {
  name: "Advance selection management",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const AdvSelectionManagment = () => {
      const handleOnSelect = (row: any, isSelect: boolean) => {
        if (isSelect && row.id < 3) {
          alert('Oops, You can not select Product ID which less than 3');
          return false; // return false to deny current select action
        }
        return true; // return true or dont return to approve current select action
      };

      const handleOnSelectAll = (isSelect: boolean, rows: any[]) => {
        if (isSelect) {
          return rows.filter((r: any) => r.id >= 3).map((r: any) => r.id);
        }
      };

      const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
      };

      return (
        <div>
          <h3>You can not select Product ID less than 3</h3>
          <BootstrapTable keyField="id" data={ products } columns={ columns } selectRow={ selectRow } />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: handleOnSelect,
      onSelectAll: handleOnSelectAll
    }
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    const checkboxes = canvas.getAllByRole('checkbox') as HTMLInputElement[];
    
    // click first row (id 0) -> should be denied
    // Mocking alert might be needed if it blocks, but usually test-runner handles it or we can just check state
    // In Storybook environment, alert might be a no-op or captured.
    await userEvent.click(rows[1]);
    expect(checkboxes[1].checked).toBe(false);
    
    // click row with id 3
    await userEvent.click(rows[4]);
    expect(checkboxes[4].checked).toBe(true);
  }
};

export const ClickToSelectAndEditCell: Story = {
  name: "Click to select and edit cell",
  args: {
    columns: columns,
    data: productsGenerator(),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import cellEditFactory from 'react-bootstrap-table-ng-editor';

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
      mode: 'checkbox',
      clickToSelect: true,
      clickToEdit: true  // Click to edit cell also
    };

    const cellEdit = {
      mode: 'click'
    };

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
      cellEdit={ cellEditFactory({ mode: 'click' }) }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      clickToEdit: true
    },
    cellEdit: cellEditFactory({ mode: 'click' }),
  }
};

export const RowSelectAndExpand: Story = {
  name: "Row select and expand",
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
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true
    };

    const expandRow = {
      showExpandColumn: true,
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
      selectRow={ selectRow }
      expandRow={ expandRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true
    },
    expandRow: {
      showExpandColumn: true,
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
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    const checkboxes = await canvas.findAllByRole('checkbox') as HTMLInputElement[];
    
    // clicking row should select AND expand
    await userEvent.click(rows[1]);
    
    expect(checkboxes[1].checked).toBe(true);
    expect(await canvas.findByText('This Expand row is belong to rowKey 0')).toBeInTheDocument();
  }
};

export const SelectWithoutData: Story = {
  name: "Select without data",
  args: {
    columns: columns,
    data: [],
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
      mode: 'checkbox',
      clickToSelect: true
    };

    <BootstrapTable
      keyField='id'
      data={ [] }
      columns={ columns }
      selectRow={ selectRow }
      noDataIndication={ 'no results found' }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true
    },
    noDataIndication: "no results found",
  }
};

export const SelectionStyle: Story = {
  name: "Selection style",
  args: {
    mode: "style",
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      style: (row, rowIndex) => {
        const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'checkbox',
      clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' }
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      style: (row: any, rowIndex: number) => {
        const backgroundColor = rowIndex > 1 ? '#00BFFF' : '#00FFFF';
        return { backgroundColor };
      }
    }
  }
};

export const SelectionClass: Story = {
  name: "Selection class",
  args: {
    mode: "style",
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      classes: 'selection-row'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      classes: (row, rowIndex) =>
        (rowIndex > 1 ? 'row-index-bigger-than-2101' : 'row-index-small-than-2101')
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'checkbox',
      clickToSelect: true,
      classes: 'selection-row'
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      classes: (row: any, rowIndex: number) => (rowIndex > 1 ? 'row-index-bigger-than-2101' : 'row-index-small-than-2101')
    }
  }
};

export const CustomSelectionColumnHeaderStyle: Story = {
  name: "Custom selection column header style",
  args: {
    mode: "style",
    columns: columns,
    data: productsGenerator(2),
    sourceCode1: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = ...

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      headerColumnStyle: {
        backgroundColor: 'blue'
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    sourceCode2: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = ...

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      headerColumnStyle: (status) => {
        if (status === 'checked') {
          return {
            backgroundColor: 'yellow'
          };
        } else if (status === 'indeterminate') {
          return {
            backgroundColor: 'pink'
          };
        } else if (status === 'unchecked') {
          return {
            backgroundColor: 'grey'
          };
        }
        return {};
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'checkbox',
      clickToSelect: true,
      headerColumnStyle: {
        backgroundColor: 'blue'
      }
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      headerColumnStyle: (status: string) => {
        if (status === 'checked') {
          return {
            backgroundColor: 'yellow'
          };
        } else if (status === 'indeterminate') {
          return {
            backgroundColor: 'pink'
          };
        } else if (status === 'unchecked') {
          return {
            backgroundColor: 'grey'
          };
        }
        return {};
      }
    }
  }
};

export const HideSelectAll: Story = {
  name: "Hide select all",
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
      mode: 'checkbox',
      clickToSelect: true,
      hideSelectAll: true
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      hideSelectAll: true
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    const headerRow = rows[0];
    
    // Should not have a checkbox in the header
    expect(within(headerRow).queryByRole('checkbox')).not.toBeInTheDocument();
  }
};

export const CustomSelection: Story = {
  name: "Custom selection",
  args: {
    mode: "style",
    columns: columns,
    data: productsGenerator(),
    sourceCode1: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = ....;

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      selectionHeaderRenderer: () => 'X',
      selectionRenderer: ({ mode, ...rest }: any) => (
        <input type={ mode } { ...rest } />
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    sourceCode2: `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const columns = ....;

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      selectionHeaderRenderer: ({ indeterminate, ...rest }: any) => (
        <input
          type="checkbox"
          ref={ (input) => {
            if (input) input.indeterminate = indeterminate;
          } }
          { ...rest }
        />
      ),
      selectionRenderer: ({ mode, ...rest }: any) => (
        <input type={ mode } { ...rest } />
      )
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'radio',
      clickToSelect: true,
      selectionHeaderRenderer: () => 'X',
      selectionRenderer: ({ mode, ...rest }: any) => (
        <input type={mode} onChange={() => { }} {...rest} />
      )
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      selectionHeaderRenderer: ({ indeterminate, ...rest }: any) => (
        <input
          type="checkbox"
          ref={(input) => {
            if (input) input.indeterminate = indeterminate;
          }}
          onChange={() => { }}
          {...rest}
        />
      ),
      selectionRenderer: ({ mode, ...rest }: any) => (
        <input type={mode} onChange={() => { }} {...rest} />
      )
    }
  }
};

export const SelectionBackgroundColor: Story = {
  name: "Selection background color",
  args: {
    mode: "style",
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: (row, rowIndex) => (rowIndex > 1 ? '#00BFFF' : '#00FFFF')
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF'
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: (row: any, rowIndex: number) => (rowIndex > 1 ? '#00BFFF' : '#00FFFF')
    }
  }
};

export const NotSelectableRows: Story = {
  name: "Not selectable rows",
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
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4]
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4]
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    
    // row 0 (id 0) is non-selectable
    await userEvent.click(rows[1]);
    const checkboxes = canvas.getAllByRole('checkbox', { hidden: true }) as HTMLInputElement[];
    // ID 0, 1, 2, 3, 4 map to rows 1, 2, 3, 4, 5
    // Non-selectable rows might not even render a checkbox or it might be disabled
    
    // Checkbox for row 1 should be disabled or not present
    // Let's check selection state via row class or just check the input
    expect(checkboxes[1].disabled).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
    
    // row 1 (id 1) IS selectable
    await userEvent.click(rows[2]);
    expect(checkboxes[2].checked).toBe(true);
  }
};

export const NotSelectableRowsStyle: Story = {
  name: "Not selectable rows style",
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
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4],
      nonSelectableStyle: { backgroundColor: 'gray' }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4],
      nonSelectableStyle: { backgroundColor: 'gray' }
    },
  }
};

export const NotSelectableRowsClass: Story = {
  name: "Not selectable rows class",
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
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4],
      nonSelectableClasses: 'row-index-bigger-than-2101'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      nonSelectable: [0, 2, 4],
      nonSelectableClasses: 'row-index-bigger-than-2101'
    },
  }
};

export const SelectionHooks: Story = {
  name: "Selection hooks",
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
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        console.log(row.id);
        console.log(isSelect);
        console.log(rowIndex);
        console.log(e);
      },
      onSelectAll: (isSelect, rows, e) => {
        console.log(isSelect);
        console.log(rows);
        console.log(e);
      }
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: (row: any, isSelect: any, rowIndex: number, e: any) => {
        console.log(row.id);
        console.log(isSelect);
        console.log(rowIndex);
        console.log(e);
      },
      onSelectAll: (isSelect: any, rows: any, e: any) => {
        console.log(isSelect);
        console.log(rows);
        console.log(e);
      }
    },
  }
};

export const HideSelectionColumn: Story = {
  name: "Hide selection column",
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
      mode: 'checkbox',
      clickToSelect: true,
      hideSelectColumn: true,
      bgColor: '#00BFFF'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      hideSelectColumn: true,
      bgColor: '#00BFFF'
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const rows = await within(table).findAllByRole('row');
    
    // No checkbox column
    expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
    
    // But can still select via click
    await userEvent.click(rows[1]);
    expect(rows[1]).toHaveStyle('background-color: rgb(0, 191, 255)'); // #00BFFF
  }
};

export const CustomSelectionColumnStyle: Story = {
  name: "Custom selection column style",
  args: {
    mode: "style",
    columns: columns,
    data: productsGenerator(2),
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
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

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: (row, rowIndex) => (rowIndex > 1 ? '#00BFFF' : '#00FFFF')
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow1: {
      mode: 'checkbox',
      clickToSelect: true,
      selectColumnStyle: {
        backgroundColor: 'grey'
      }
    },
    selectRow2: {
      mode: 'checkbox',
      clickToSelect: true,
      selectColumnStyle: ({
        checked,
        disabled,
        rowIndex,
        rowKey
      }: any) => {
        if (checked) {
          return {
            backgroundColor: 'yellow'
          };
        }
        return {
          backgroundColor: 'pink'
        };
      }
    }
  }
};

export const SelectionColumnPosition: Story = {
  name: "Selection column position",
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
      mode: 'checkbox',
      clickToSelect: true,
      selectColumnPosition: 'right'
    };

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      selectRow={ selectRow }
    />
    `,
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true,
      selectColumnPosition: 'right'
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    const headerRow = (await within(table).findAllByRole('row'))[0];
    const headerCells = within(headerRow).getAllByRole('columnheader');
    
    // Selection column should be on the right
    expect(headerCells[headerCells.length - 1]).toHaveAttribute('data-row-selection', 'true');
  }
};
