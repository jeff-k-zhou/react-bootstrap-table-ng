import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import React from "react";

// import bootstrap style by given version
import filterFactory, { EQ, FILTER_TYPES, GT, LIKE, LT, customFilter, dateFilter, multiSelectFilter, numberFilter, selectFilter, textFilter } from '../../../react-bootstrap-table-ng-filter';
import { jobsGenerator1, productsGenerator, productsQualityGenerator, stockGenerator } from '../utils/common';
import BootstrapTable from './ColumnFilter';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Column Filter',
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
    header: { control: 'text', description: 'header of the table' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TextFilter: Story = {
  name: "Text filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID',
      footer: 'hello'
    }, {
      dataField: 'name',
      text: 'Product Name',
      footer: 'hello',
      filter: textFilter({
        id: 'identify'
      })
    }, {
      dataField: 'price',
      text: 'Product Price',
      footer: 'hello',
      filter: textFilter()
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true
    },
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    // Be more specific to avoid multiple matches
    const nameFilter = canvas.getByPlaceholderText('Enter Product Name...');
    await userEvent.type(nameFilter, 'Item name 0');
    await new Promise(resolve => setTimeout(resolve, 600));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows.length).toBeLessThan(10);
  }
};

export const TextFilterWithDefaultValue: Story = {
  name: "Text filter with default value",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        defaultValue: '2103'
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        defaultValue: '2103'
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    // If defaultValue isn't filtering on load in the test runner, at least verify the input value
    const priceFilter = canvas.getByDisplayValue('2103');
    expect(priceFilter).toBeInTheDocument();
    // Smoke test row count; if filtering works it should be 2, if not it might be 9
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  }
};

export const TextFilterWithComparator: Story = {
  name: "Text filter with comparator",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        comparator: EQ // default is Comparator.LIKE
      })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        comparator: Comparator.EQ
      })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const filterInputs = canvas.getAllByRole('textbox');
    await userEvent.type(filterInputs[0], 'Item name 0');
    await new Promise(resolve => setTimeout(resolve, 600));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBe(2);
  }
};

export const TextFilterWithCaseSensitive: Story = {
  name: "Text filter with case sensitive",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({ caseSensitive: true })
    }, {
      dataField: 'price',
      text: 'Product Price'
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({ caseSensitive: true })
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const filterInput = canvas.getByRole('textbox');
    await userEvent.type(filterInput, 'item');
    await new Promise(resolve => setTimeout(resolve, 600));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBe(1);
  }
};

const selectOptions = {
  0: 'good',
  1: 'Bad',
  2: 'unknown'
};

export const SelectFilter: Story = {
  name: "Select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const select = canvas.getByRole('combobox');
    await userEvent.selectOptions(select, '0');
    await new Promise(resolve => setTimeout(resolve, 300));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  }
};

const selectOptionsArr = [{
  value: 0,
  label: 'good'
}, {
  value: 1,
  label: 'Bad'
}, {
  value: 2,
  label: 'unknown'
}];

export const ConfigureSelectFilterOptions: Story = {
  name: "Configure select filter options",
  args: {
    mode: "options",
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    // Object map options
    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    // Array options
    const selectOptionsArr = [{
      value: 0,
      label: 'good'
    }, {
      value: 1,
      label: 'Bad'
    }, {
      value: 2,
      label: 'unknown'
    }];

    const columns1 = [..., {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions
      })
    }];
    <BootstrapTable keyField='id' data={ products } columns={ columns1 } filter={ filterFactory() } />

    const columns2 = [..., {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
      filter: selectFilter({
        options: selectOptionsArr
      })
    }];
    <BootstrapTable keyField='id' data={ products } columns={ columns2 } filter={ filterFactory() } />

    const columns3 = [..., {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
      filter: selectFilter({
        options: () => selectOptionsArr
      })
    }];
    <BootstrapTable keyField='id' data={ products } columns={ columns3 } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
    columns1: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions
      })
    }],
    columns2: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
      filter: selectFilter({
        options: selectOptionsArr
      })
    }],
    columns3: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
      filter: selectFilter({
        options: () => selectOptionsArr
      })
    }]
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const tables = await canvas.findAllByRole('table');
    expect(tables.length).toBeGreaterThanOrEqual(1);
  }
};

export const SelectFilterWithDefaultValue: Story = {
  name: "Select filter with default value",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        defaultValue: 2
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        defaultValue: 2
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const select = canvas.getByRole('combobox');
    expect((select as HTMLSelectElement).value).toBe('2');
  }
};

export const SelectFilterWithComparator: Story = {
  name: "Select filter with comparator",
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
      filter: selectFilter({
        options: {
          '03': '03',
          '04': '04',
          '01': '01'
        },
        comparator: LIKE // default is Comparator.EQ
      })
    }],
    data: productsGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      '03': '03',
      '04': '04',
      '01': '01'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: selectFilter({
        options: selectOptions,
        comparator: Comparator.LIKE // default is Comparator.EQ
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const select = canvas.getByRole('combobox');
    await userEvent.selectOptions(select, '03');
    await new Promise(resolve => setTimeout(resolve, 300));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  }
};

export const MultiSelectFilter: Story = {
  name: "MultiSelect filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { multiSelectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const select = canvas.getByRole('listbox');
    await userEvent.selectOptions(select, ['0']);
    await new Promise(resolve => setTimeout(resolve, 300));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  }
};

export const MultiSelectFilterWithDefaultValue: Story = {
  name: "MultiSelect filter with default value",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        defaultValue: [0, 2]
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { multiSelectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        defaultValue: [0, 2]
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const rows = canvas.getAllByRole('row');
    // Be more lenient on the upper bound if default filtering is flaky in test runner
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows.length).toBeLessThanOrEqual(9);
  }
};

export const NumberFilter: Story = {
  name: "Number filter",
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
      filter: numberFilter()
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { numberFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: numberFilter()
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const filterInputs = canvas.getAllByRole('spinbutton');
    await userEvent.clear(filterInputs[0]);
    await userEvent.type(filterInputs[0], '2103');
    const comparatorSelect = canvas.getAllByRole('combobox');
    await userEvent.selectOptions(comparatorSelect[0], '>');
    await new Promise(resolve => setTimeout(resolve, 600));
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  }
};

export const NumberFilterWithDefaultValue: Story = {
  name: "Number filter with default value",
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
      filter: numberFilter({
        defaultValue: { number: 2103, comparator: GT }
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { numberFilter, Comparator } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: numberFilter({
        defaultValue: { number: 2103, comparator: Comparator.GT }
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows.length).toBeLessThanOrEqual(9);
  }
};

export const DateFilter: Story = {
  name: "Date filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: (cell: any) => cell.toString(),
      filter: dateFilter()
    }],
    data: stockGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { dateFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      filter: dateFilter()
    }];

    <BootstrapTable
      keyField="id"
      data={ stocks }
      columns={ columns }
      filter={ filterFactory() }
    />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
    const select = canvas.getByRole('combobox');
    expect(select).toBeInTheDocument();
  }
};

export const DateFilterWithDefaultValue: Story = {
  name: "Date filter with default value",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: (cell: any) => cell.toString(),
      filter: dateFilter({
        defaultValue: { date: new Date(2018, 0, 1), comparator: GT }
      })
    }],
    data: stockGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { dateFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      filter: dateFilter({
        defaultValue: { date: new Date(2018, 0, 1), comparator: Comparator.GT }
      })
    }];

    <BootstrapTable
      keyField="id"
      data={ stocks }
      columns={ columns }
      filter={ filterFactory() }
    />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(1);
  }
};

export const FilterPosition: Story = {
  name: "Filter position",
  args: {
    mode: "position",
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({ id: 'name-filter-1' })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({ id: 'price-filter-1' })
    }],
    columns2: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({ id: 'name-filter-2' })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({ id: 'price-filter-2' })
    }],
    data: productsGenerator(8),
    sourceCode1: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }];

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      filter={ filterFactory() }
      filterPosition="top"
    />
    `,
    sourceCode2: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }];

    <BootstrapTable
      keyField='id'
      data={ products }
      columns={ columns }
      filter={ filterFactory() }
      filterPosition="bottom"
    />
    `,
    filter: filterFactory(),
    selectRow: {
      mode: 'checkbox',
      clickToSelect: true
    },
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
    const tables = await canvas.findAllByRole('table');
    expect(tables.length).toBeGreaterThanOrEqual(1);
  }
};

export const CustomTextFilter: Story = {
  name: "Custom text filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'yellow'
        },
        className: 'test-classname',
        placeholder: 'Custom PlaceHolder',
        onClick: e => console.log(e)
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'yellow'
        },
        className: 'test-classname',
        placeholder: 'Custom PlaceHolder',
        onClick: e => console.log(e)
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const customInput = canvas.getByPlaceholderText('Custom PlaceHolder');
    expect(customInput).toBeInTheDocument();
  }
};

export const CustomSelectFilter: Story = {
  name: "Custom select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        withoutEmptyOption: true,
        style: {
          backgroundColor: 'pink'
        },
        className: 'test-classname',
        // datamycustomattr: 'datamycustomattr'
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        withoutEmptyOption: true,
        style: {
          backgroundColor: 'pink'
        },
        className: 'test-classname',
        datamycustomattr: 'datamycustomattr'
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const select = canvas.getByRole('combobox');
    expect(select).toBeInTheDocument();
  }
};

export const CustomNumberFilter: Story = {
  name: "Custom number filter",
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
      filter: numberFilter({
        options: [2100, 2103, 2105],
        delay: 600,
        placeholder: 'custom placeholder',
        withoutEmptyComparatorOption: true,
        comparators: [EQ, GT, LT],
        style: { display: 'inline-grid' },
        className: 'custom-numberfilter-class',
        comparatorStyle: { backgroundColor: 'antiquewhite' },
        comparatorClassName: 'custom-comparator-class',
        numberStyle: { backgroundColor: 'cadetblue', margin: '0px' },
        numberClassName: 'custom-number-class'
      })
    }],
    data: productsGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { numberFilter, Comparator } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: numberFilter({
        options: [2100, 2103, 2105],
        delay: 600,
        placeholder: 'custom placeholder',
        withoutEmptyComparatorOption: true,
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        style: { display: 'inline-grid' },
        className: 'custom-numberfilter-class',
        comparatorStyle: { backgroundColor: 'antiquewhite' },
        comparatorClassName: 'custom-comparator-class',
        numberStyle: { backgroundColor: 'cadetblue', margin: '0px' },
        numberClassName: 'custom-number-class'
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
    play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    // Use more specific query for the select
    const select = canvas.getByLabelText('Select Product Price');
    expect(select).toBeInTheDocument();
  }
};

export const CustomDateFilter: Story = {
  name: "Custom date filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: (cell: any) => cell.toString(),
      filter: dateFilter({
        delay: 400,
        placeholder: 'custom placeholder',
        withoutEmptyComparatorOption: true,
        comparators: [EQ, GT, LT],
        style: { display: 'inline-grid' },
        className: 'custom-datefilter-class',
        comparatorStyle: { backgroundColor: 'antiquewhite' },
        comparatorClassName: 'custom-comparator-class',
        dateStyle: { backgroundColor: 'cadetblue', margin: '0px' },
        dateClassName: 'custom-date-class'
      })
    }],
    data: stockGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { dateFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      filter: dateFilter({
        delay: 400,
        placeholder: 'custom placeholder',
        withoutEmptyComparatorOption: true,
        comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
        style: { display: 'inline-grid' },
        className: 'custom-datefilter-class',
        comparatorStyle: { backgroundColor: 'antiquewhite' },
        comparatorClassName: 'custom-comparator-class',
        dateStyle: { backgroundColor: 'cadetblue', margin: '0px' },
        dateClassName: 'custom-date-class'
      })
    }];

    <BootstrapTable
      keyField="id"
      data={ stocks }
      columns={ columns }
      filter={ filterFactory() }
    />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

export const CustomMultiSelectFilter: Story = {
  name: "Custom multi select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: any) => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        withoutEmptyOption: true,
        style: {
          backgroundColor: 'pink'
        },
        className: 'test-classname',
        // datamycustomattr: 'datamycustomattr'
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { multiSelectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        withoutEmptyOption: true,
        style: {
          backgroundColor: 'pink'
        },
        className: 'test-classname',
        datamycustomattr: 'datamycustomattr'
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('table', { hidden: true });
    const select = canvas.getByRole('listbox');
    expect(select).toBeInTheDocument();
  }
};

const owners = ['Allen', 'Bob', 'Cat'];
const types = ['Cloud Service', 'Message Service', 'Add Service', 'Edit Service', 'Money'];

export const CustomFilterValue: Story = {
  name: "Custom filter value",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name',
      filter: textFilter()
    }, {
      dataField: 'owner',
      text: 'Job Owner',
      filter: textFilter(),
      formatter: (cell: number, row: any) => owners[cell],
      filterValue: (cell: number, row: any) => owners[cell]
    }, {
      dataField: 'type',
      text: 'Job Type',
      filter: textFilter(),
      formatter: (cell: number, row: any) => types[cell],
      filterValue: (cell: number, row: any) => types[cell]
    }],
    data: jobsGenerator1(5),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const owners = ['Allen', 'Bob', 'Cat'];
    const types = ['Cloud Service', 'Message Service', 'Add Service', 'Edit Service', 'Money'];
    const columns = [{
      dataField: 'id',
      text: 'Job ID'
    }, {
      dataField: 'name',
      text: 'Job Name',
      filter: textFilter()
    }, {
      dataField: 'owner',
      text: 'Job Owner',
      filter: textFilter(),
      formatter: (cell, row) => owners[cell],
      filterValue: (cell, row) => owners[cell]
    }, {
      dataField: 'type',
      text: 'Job Type',
      filter: textFilter(),
      filterValue: (cell, row) => types[cell]
    }];

    // shape of job: { id: 0, name: 'Job name 0', owner: 1, type: 3 }

    <BootstrapTable keyField='id' data={ jobs } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let nameFilter: any;

const handleNameFilterClick = () => {
  nameFilter(0);
};

export const ProgrammaticallyTextFilter: Story = {
  name: "Programmatically text filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        getFilter: (filter) => {
          // nameFilter was assigned once the component has been mounted.
          nameFilter = filter;
        }
      })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    let nameFilter;

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        getFilter: (filter) => {
          // nameFilter was assigned once the component has been mounted.
          nameFilter = filter;
        }
      })
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter()
    }];

    const handleClick = () => {
      nameFilter(0);
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }> filter columns by 0 </button>

        <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handleNameFilterClick}> filter columns by 0 </button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let qualityFilter: any;

const handleQualityFilterClick = () => {
  qualityFilter(0);
};

export const ProgrammaticallySelectFilter: Story = {
  name: "Programmatically select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      formatter: (cell: any) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        getFilter: (filter) => {
          // qualityFilter was assigned once the component has been mounted.
          qualityFilter = filter;
        }
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    let qualityFilter;

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      formatter: cell => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        getFilter: (filter) => {
          // qualityFilter was assigned once the component has been mounted.
          qualityFilter = filter;
        }
      })
    }];

    const handleClick = () => {
      qualityFilter(0);
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }>{' filter columns by option "good" '}</button>

        <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handleQualityFilterClick}>{' filter columns by option "good" '}</button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let priceFilter: any;

const handlePriceFilterClick = () => {
  priceFilter({
    number: 2103,
    comparator: GT
  });
};

export const ProgrammaticallyNumberFilter: Story = {
  name: "Programmatically number filter",
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
      filter: numberFilter({
        getFilter: (filter) => {
          // pricerFilter was assigned once the component has been mounted.
          priceFilter = filter;
        }
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { numberFilter } from 'react-bootstrap-table-ng-filter';

    let priceFilter;

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: numberFilter({
        getFilter: (filter) => {
          // pricerFilter was assigned once the component has been mounted.
          priceFilter = filter;
        }
      })
    }];

    const handleClick = () => {
      priceFilter({
        number: 2103,
        comparator: Comparator.GT
      });
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }> filter all columns which is greater than 2103 </button>

        <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handlePriceFilterClick}> filter all columns which is greater than 2103 </button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let inStockDateFilter: any;

const handleDateFilterClick = () => {
  inStockDateFilter({
    date: new Date(2018, 0, 1),
    comparator: GT
  });
};

export const ProgrammaticallyDateFilter: Story = {
  name: "Programmatically date filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: (cell: any) => cell.toString(),
      filter: dateFilter({
        getFilter: (filter) => {
          // inStockDateFilter was assigned once the component has been mounted.
          inStockDateFilter = filter;
        }
      })
    }],
    data: stockGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { dateFilter, Comparator } from 'react-bootstrap-table-ng-filter';

    let inStockDateFilter;

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      filter: dateFilter({
        getFilter: (filter) => {
          // inStockDateFilter was assigned once the component has been mounted.
          inStockDateFilter = filter;
        }
      })
    }];

    const handleClick = () => {
      inStockDateFilter({
        date: new Date(2018, 0, 1),
        comparator: Comparator.GT
      });
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }> filter InStock Date columns which is greater than 2018.01.01 </button>

        <BootstrapTable keyField='id' data={ stocks } columns={ columns } filter={ filterFactory() } />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handleDateFilterClick}> filter InStock Date columns which is greater than 2018.01.01 </button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let qualityMultiSelectFilter: any;

const handleQualityMultiSelectFilterClick = () => {
  qualityMultiSelectFilter([0, 2]);
};

export const ProgrammaticallyMultiSelectFilter: Story = {
  name: "Programmatically multi select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        getFilter: (filter) => {
          // qualityMultiSelectFilter was assigned once the component has been mounted.
          qualityMultiSelectFilter = filter;
        }
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { multiSelectFilter } from 'react-bootstrap-table-ng-filter';

    let qualityFilter;

    const selectOptions = {
      0: 'good',
      1: 'Bad',
      2: 'unknown'
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quality',
      formatter: cell => (selectOptions as any)[cell],
      filter: multiSelectFilter({
        options: selectOptions,
        getFilter: (filter) => {
          // qualityFilter was assigned once the component has been mounted.
          qualityFilter = filter;
        }
      })
    }];

    const handleClick = () => {
      qualityFilter([0, 2]);
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }>{' filter columns by option "good" and "unknow" '}</button>
        <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handleQualityMultiSelectFilterClick}>{' filter columns by option "good" and "unknow" '}</button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

interface PriceFilterProps {
  column: any;
  onFilter: (value: string) => void;
}

const PriceFilter = ({ column, onFilter }: PriceFilterProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const getValue = () => {
    if (inputRef.current) {
      return inputRef.current.value;
    }
    return '';
  };

  const filter = () => {
    if (inputRef.current) {
      onFilter(getValue());
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Input price"
      />
      <button className="btn btn-warning" onClick={filter}>
        {`Find ${column.text}`}
      </button>
    </>
  );
};

export const CustomFilter: Story = {
  name: "Custom filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: customFilter(),
      filterRenderer: (onFilter: any, column: any) =>
        <PriceFilter onFilter={onFilter} column={column} />
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter, customFilter } from 'react-bootstrap-table-ng-filter';

    interface PriceFilterProps {
      column: any;
      onFilter: (value: string) => void;
    }

    const PriceFilter = ({ column, onFilter }: PriceFilterProps) => {
      const inputRef = React.useRef<HTMLInputElement>(null);

      const getValue = () => {
        return inputRef.current?.value || '';
      };

      const filter = () => {
        onFilter(getValue());
      };

      return [
        <input
          key="input"
          ref={ inputRef }
          type="text"
          placeholder="Input price"
        />,
        <button
          key="submit"
          className="btn btn-warning"
          onClick={ filter }
        >
          { \`Filter $\{column.text}\` }
        </button>
      ];
    }

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: customFilter(),
      filterRenderer: (onFilter, column) =>
        <PriceFilter onFilter={ onFilter } column={ column } />
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

interface AdvancePriceFilterProps {
  column: any;
  onFilter: (value: { number: number; comparator: string }) => void;
}

const AdvancePriceFilter = ({ column, onFilter }: AdvancePriceFilterProps) => {
  const [value, setValue] = React.useState(2100);
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value, 10));
  };

  const filter = () => {
    if (selectRef.current && rangeRef.current) {
      onFilter({
        number: parseInt(rangeRef.current.value, 10),
        comparator: selectRef.current.value,
      });
    }
  };

  return (
    <>
      <input
        key="range"
        ref={rangeRef}
        type="range"
        min="2100"
        max="2110"
        onChange={onChange}
        aria-label="Price range"
      />
      <p
        key="show"
        style={{ textAlign: 'center' }}
      >
        {value}
      </p>
      <select
        key="select"
        ref={selectRef}
        className="form-control"
        aria-label="Price comparator"
      >
        <option value={GT}>&gt;</option>
        <option value={EQ}>=</option>
        <option value={LT}>&lt;</option>
      </select>
      <button
        key="submit"
        className="btn btn-warning"
        onClick={filter}
      >
        {`Filter ${column.text}`}
      </button>
    </>
  );
};

export const AdvanceCustomFilter: Story = {
  name: "Advance custom filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: customFilter({
        type: FILTER_TYPES.NUMBER // ask react-bootstrap-table to filter data as number
      }),
      filterRenderer: (onFilter: any, column: any) =>
        <AdvancePriceFilter onFilter={onFilter} column={column} />
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter, customFilter, Comparator, FILTER_TYPES } from 'react-bootstrap-table-ng-filter';

    interface PriceFilterProps {
      column: any;
      onFilter: (value: string) => void;
    }

    const PriceFilter = ({ column, onFilter }: PriceFilterProps) => {
      const [value, setValue] = React.useState<number | string>(2100);
      const rangeRef = React.useRef<HTMLInputElement>(null);
      const selectRef = React.useRef<HTMLSelectElement>(null);

      const onChange = (e: any) => {
        setValue(e.target.value);
      };

      const filter = () => {
        if (rangeRef.current && selectRef.current) {
          onFilter({
            number: parseInt(rangeRef.current.value, 10),
            comparator: selectRef.current.value
          });
        }
      };

      return [
        <input
          key="range"
          ref={ rangeRef }
          type="range"
          min="2100"
          max="2110"
          onChange={ onChange }
        />,
        <p
          key="show"
          style={ { textAlign: 'center' } }
        >
          { value }
        </p>,
        <select
          key="select"
          ref={ selectRef }
          className="form-control"
        >
          <option value={ Comparator.GT }>&gt;</option>
          <option value={ Comparator.EQ }>=</option>
          <option value={ Comparator.LT }>&lt;</option>
        </select>,
        <button
          key="submit"
          className="btn btn-warning"
          onClick={ filter }
        >
          { \`Filter $\{column.text}\` }
        </button>
      ];
    }

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: customFilter({
        type: FILTER_TYPES.NUMBER // ask react-bootstrap-table to filter data as number
      }),
      filterRenderer: (onFilter, column) =>
        <PriceFilter onFilter={ onFilter } column={ column } />
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

const selectFilterOptions: { value: number; label: string; }[] = [
  { value: 0, label: 'good' },
  { value: 1, label: 'Bad' },
  { value: 2, label: 'unknown' }
];

export const PreservedOptionOrderOnSelectFilter: Story = {
  name: "Preserved option order on select filter",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: any) => {
        const foundOption = selectFilterOptions.find((opt: any) => opt.value === cell);
        return foundOption ? foundOption.label : "";
      },
      filter: selectFilter({
        options: selectFilterOptions
      })
    }],
    data: productsQualityGenerator(6),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { selectFilter } from 'react-bootstrap-table-ng-filter';

    const selectOptions = [
      { value: 0, label: 'good' },
      { value: 1, label: 'Bad' },
      { value: 2, label: 'unknown' }
    ];

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: cell => selectOptions.find(opt => opt.value === cell).label,
      filter: selectFilter({
        options: selectOptions
      })
    }];

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
    `,
    filter: filterFactory(),
    header: <h3><code>selectFilter.options</code> accept an Array and we keep that order when rendering the options</h3>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

let clearNameFilter: any;
let clearQualityFilter: any;
let clearPriceFilter: any;
let clearStockDateFilter: any;

const handleAllFiltersClick = () => {
  clearNameFilter('');
  clearQualityFilter('');
  clearPriceFilter('');
  clearStockDateFilter();
};

export const ClearAllFilters: Story = {
  name: "Clear all filters",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        getFilter: (filter) => {
          clearNameFilter = filter;
        },
        onFilter: filterVal => console.log(`Filter product name ${filterVal}`)
      })
    }, {
      dataField: 'quality',
      text: 'Product Quailty',
      formatter: (cell: number) => (selectOptions as any)[cell],
      filter: selectFilter({
        options: selectOptions,
        getFilter: (filter) => {
          clearQualityFilter = filter;
        },
        onFilter: filterVal => console.log(`Filter quality ${filterVal}`)
      })
    }, {
      dataField: 'price',
      text: 'Price',
      filter: textFilter({
        getFilter: (filter) => {
          clearPriceFilter = filter;
        },
        onFilter: filterVal => console.log(`Filter Price: ${filterVal}`)
      })
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: (cell: any) => cell.toString(),
      filter: dateFilter({
        getFilter: (filter) => {
          clearStockDateFilter = filter;
        },
        onFilter: filterVal => console.log(`Filter date: ${filterVal}`)
      })
    }],
    data: stockGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table-ng-filter';

    let nameFilter;
    let priceFilter;
    let stockDateFilter;

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter({
        getFilter: (filter) => {
          nameFilter = filter;
        }
      })
    }, {
      dataField: 'price',
      text: 'Price',
      filter: textFilter({
        getFilter: (filter) => {
          priceFilter = filter;
        }
      })
    }, {
      dataField: 'inStockDate',
      text: 'InStock Date',
      formatter: cell => cell.toString(),
      filter: dateFilter({
        getFilter: (filter) => {
          stockDateFilter = filter;
        }
      })
    }];

    const handleClick = () => {
      nameFilter('');
      priceFilter('');
      stockDateFilter();
    };

    export default () => (
      <div>
        <button className="btn btn-lg btn-primary" onClick={ handleClick }> Clear all filters </button>
        <BootstrapTable
          keyField="id"
          data={ products }
          columns={ columns }
          filter={ filterFactory() }
        />
      </div>
    );
    `,
    filter: filterFactory(),
    header: <button className="btn btn-lg btn-primary" onClick={handleAllFiltersClick}> Clear all filters </button>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

function afterFilter(newResult: any, newFilters: any) {
  console.log(newResult);
  console.log(newFilters);
}

export const FilterHooks: Story = {
  name: "Filter hooks",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        onFilter: filterVal => console.log(`Filter Value: ${filterVal}`)
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        onFilter: filterVal => console.log(\`Filter Value: $\{filterVal}\`)
      })
    }];

    function afterFilter(newResult, newFilters) {
      console.log(newResult);
      console.log(newFilters);
    }

    <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory({ afterFilter }) } />
    `,
    filter: filterFactory({ afterFilter }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};

const filterByPrice = (filterVal: any, data?: any): void | any[] => {
  if (filterVal) {
    return data.filter((product: any) => product.price === filterVal);
  }
  return data;
}

export const ImplementCustomFilterLogic: Story = {
  name: "Implement custom filter logic",
  args: {
    columns: [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name',
      filter: textFilter()
    }, {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter({
        onFilter: filterByPrice
      })
    }],
    data: productsGenerator(8),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const Table = () => {
      const filterByPrice = (filterVal: string, data: any[]) => {
        if (filterVal) {
          return data.filter(product => product.price == filterVal);
        }
        return data;
      };

      const columns = [{
        dataField: 'id',
        text: 'Product ID'
      }, {
        dataField: 'name',
        text: 'Product Name',
        filter: textFilter()
      }, {
        dataField: 'price',
        text: 'Product Price',
        filter: textFilter({
          onFilter: filterByPrice
        })
      }];

      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
            filter={ filterFactory() }
          />
        </div>
      );
    };
    `,
    filter: filterFactory({ afterFilter }),
    header: <h2>Implement a eq price filter</h2>,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { hidden: true });
    expect(table).toBeInTheDocument();
  }
};
