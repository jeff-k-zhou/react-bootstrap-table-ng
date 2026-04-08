import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';

// import bootstrap style by given version
import BootstrapTable from './Data';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Data',
  component: BootstrapTable as any,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'text', description: 'mode' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const DataChangeListener: Story = {
  name: "Data change listener",
  args: {
    mode: "data",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Wait for content
    await canvas.findAllByRole('table');

    // Verify initial row count for the first badge
    const badges = canvasElement.querySelectorAll('.badge');
    expect(badges[0]).toHaveTextContent('8');

    // Filter "Product Name" in the first table
    const nameFilters = canvas.getAllByPlaceholderText('Enter Product Name...');
    await userEvent.type(nameFilters[0], '0');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify badge updated
    const tables = canvasElement.querySelectorAll('table');
    const filteredCount = tables[0].querySelectorAll('tbody tr').length;
    expect(badges[0]).toHaveTextContent(filteredCount.toString());
  }
};

export const LodadDataWithFilter: Story = {
  name: "Load data with filter",
  args: {
    mode: "filter",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Wait for the "Products" heading to ensure it's loaded
    await canvas.findByText('Products');
    
    // Initially should have 0 rows in tbody
    let rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);

    // Click "Load Data"
    const loadBtn = await canvas.findByRole('button', { name: /Load Data/i });
    await userEvent.click(loadBtn);

    // Verify rows exist
    await new Promise(resolve => setTimeout(resolve, 500));
    rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  }
};

export const LodadDataWithDefaultFilter: Story = {
  name: "Load data with default filter",
  args: {
    mode: "default-filter",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Initially filtered by "1" (3 products total, filtered should be less)
    await new Promise(resolve => setTimeout(resolve, 500));
    let rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThan(3);

    // Click "Load Data" (should load 14 products, still filtered by "1")
    const loadBtn = canvas.getByRole('button', { name: /Load Data/i });
    await userEvent.click(loadBtn);

    // Verify filter still applies (14 products, should be few matches for "1")
    await new Promise(resolve => setTimeout(resolve, 500));
    rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThan(14);
    expect(rows.length).toBeGreaterThan(0);
  }
};

export const LodadDataWithSearch: Story = {
  name: "Load data with search",
  args: {
    mode: "search",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Wait for content
    await canvas.findByText('Products');
    
    // Initially 0 rows
    let rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);

    // Click "Load Data"
    const loadBtn = await canvas.findByRole('button', { name: /Load Data/i });
    await userEvent.click(loadBtn);

    // Verify rows exist
    await new Promise(resolve => setTimeout(resolve, 500));
    rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  }
};

export const LodadDataWithDefaultSearch: Story = {
  name: "Load data with default search",
  args: {
    mode: "default-search",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Initially searched by "3" (4 products total)
    await new Promise(resolve => setTimeout(resolve, 500));
    let rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThan(4);

    // Click "Load Data" (34 products)
    const loadBtn = canvas.getByRole('button', { name: /Load Data/i });
    await userEvent.click(loadBtn);

    // Verify search still applies
    await new Promise(resolve => setTimeout(resolve, 500));
    rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThan(34);
    expect(rows.length).toBeGreaterThan(0);
  }
};

export const LodadDataWithFilterAndPagination: Story = {
  name: "Load data with filter and pagination",
  args: {
    mode: "pagination",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Initially 60 products, filtered by "6"
    await new Promise(resolve => setTimeout(resolve, 500));
    let rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);

    // Click "Load Data" (14 products)
    const loadBtn = canvas.getByRole('button', { name: /Load Data/i });
    await userEvent.click(loadBtn);

    // Verify rows updated
    await new Promise(resolve => setTimeout(resolve, 500));
    rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(14);
  }
};
