import { expect, userEvent, within, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

// import bootstrap style by given version
import BootstrapTable from './TableOverlay';
import bootstrapStyle from './bootstrap-style';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Table Overlay',
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
export const EmptyTableOverlay: Story = {
  name: "Empty table overlay",
  args: {
    mode: "empty",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    
    // pagination button 2
    // We target the link inside the pagination component
    const page2Button = await canvas.findByRole('link', { name: '2' });
    await userEvent.click(page2Button);
    
    // verify spinner appears (it should appear since handleTableChange calls setData([]))
    await waitFor(() => {
      const spinner = canvasElement.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // wait for data to load (3s delay in component)
    await waitFor(async () => {
      const table = canvasElement.querySelector('table');
      if (!table) throw new Error('Table not found');
      const rows = table.querySelectorAll('tr');
      // rows[0] is header, rows[1] is first data row
      expect(rows[1]).toHaveTextContent('Item name 10');
    }, { timeout: 10000 });
  }
};

export const TableOverlay: Story = {
  name: "Table overlay",
  args: {
    mode: undefined,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    
    // pagination button 2
    const page2Button = await canvas.findByRole('link', { name: '2' });
    await userEvent.click(page2Button);
    
    // verify overlay spinner appears
    await waitFor(() => {
      // Search for something that identifies the loading overlay
      const overlay = canvasElement.querySelector('._loading_overlay_overlay') || 
                      canvasElement.querySelector('.loading-overlay'); 
      // Also look for any element with 'loading' text or classes if possible
      expect(overlay).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // wait for data to load
    await waitFor(async () => {
      const table = canvasElement.querySelector('table');
      if (!table) throw new Error('Table not found');
      const rows = table.querySelectorAll('tr');
      expect(rows[1]).toHaveTextContent('Item name 10');
    }, { timeout: 10000 });
  }
};
