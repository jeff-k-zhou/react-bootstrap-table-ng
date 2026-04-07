import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

// import bootstrap style by given version
import BootstrapTable from './Remote';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Remote',
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
export const RemoteSort: Story = {
  name: "Remote sort",
  args: {
    mode: "sort",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();

    // Click to sort by Name
    const nameHeader = await canvas.findByText('Product Name');
    await userEvent.click(nameHeader);

    // Wait for the simulated 2000ms delay and sort to apply
    // Ascending string sort on "Item name 0" to "Item name 4":
    // "Item name 0", "Item name 1", "Item name 2", "Item name 3", "Item name 4"
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 4000 })).toBeInTheDocument();

    // Click again to sort descending
    await userEvent.click(nameHeader);
    
    // Descending string sort means "Item name 4" will be at the top
    await expect(await canvas.findByText('Item name 4', {}, { timeout: 4000 })).toBeInTheDocument();
  }
};

export const RemoteFilter: Story = {
  name: "Remote filter",
  args: {
    mode: "filter",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();

    const nameFilters = await canvas.findAllByPlaceholderText('Enter Product Name...');
    // Type and wait for the filter to apply
    await userEvent.clear(nameFilters[0]);
    await userEvent.type(nameFilters[0], '12');

    // Wait for the simulated 2000ms delay + filter delay to finish
    await new Promise(r => setTimeout(r, 3500));
    await expect(canvas.queryByText('Item name 0')).not.toBeInTheDocument();
    await expect(await canvas.findByText('Item name 12')).toBeInTheDocument();
  }
};

export const RemotePagination: Story = {
  name: "Remote pagination",
  args: {
    mode: "pagination",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();

    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    // Wait for pagination delay
    await expect(await canvas.findByText('Item name 10', {}, { timeout: 4000 })).toBeInTheDocument();
  }
};

export const RemoteSearch: Story = {
  name: "Remote search",
  args: {
    mode: "search",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();

    const searchInput = await canvas.findByPlaceholderText('Search');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, '12');

    // Wait for the simulated 2000ms delay + search delay to finish
    await new Promise(r => setTimeout(r, 3500));
    await expect(canvas.queryByText('Item name 0')).not.toBeInTheDocument();
    await expect(await canvas.findByText('Item name 12')).toBeInTheDocument();
  }
};

export const RemoteCellEditing: Story = {
  name: "Remote cell editing",
  args: {
    mode: "edit",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();

    const cellToEdit = await canvas.findByText('Item name 0');
    await userEvent.click(cellToEdit);

    const input = await canvas.findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'test{Enter}');

    // Wait for the simulated 2000ms delay and error message
    await expect(await canvas.findByText(/Oops/, {}, { timeout: 6000 })).toBeInTheDocument();
  }
};

export const RemoteAll: Story = {
  name: "Remote all",
  args: {
    mode: "all",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // RemoteAll uses productsGenerator(87) and starts on page 1 (items 0-9)
    await expect(await canvas.findByText('Item name 8', {}, { timeout: 5000 })).toBeInTheDocument();

    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    // Wait for pagination delay to show Item name 10
    await expect(await canvas.findByText('Item name 10', {}, { timeout: 5000 })).toBeInTheDocument();
  }
};

export const RemoteAllCustom: Story = {
  name: "Remote all + custom toolbars",
  args: {
    mode: "all-custom",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 5000 })).toBeInTheDocument();

    // The custom toolbar doesn't have a search bar, but it does have
    // a size per page dropdown. Let's test changing the page size.
    // Initial size is 10
    await expect(canvas.queryByText('Item name 10')).not.toBeInTheDocument();

    // Click dropdown toggle
    const dropdownToggles = await canvas.findAllByRole('button', { name: /10/ });
    await userEvent.click(dropdownToggles[0]);

    // Click 25
    const size25Btns = await canvas.findAllByText('25', { selector: '.dropdown-item a' });
    await userEvent.click(size25Btns[0]);

    // Wait for the simulated fetch to complete and show 25 items total text
    const paginationText = await canvas.findAllByText(/1 to 25 of 487 rows/, {}, { timeout: 6000 });
    await expect(paginationText.length).toBeGreaterThan(0);
  }
};

