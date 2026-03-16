/* eslint-disable jsx-a11y/anchor-is-valid */
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from '@storybook/test';

// import bootstrap style by given version
import paginationFactory from "../../../react-bootstrap-table-ng-paginator";
import { columns, productsGenerator } from '../utils/common';
import BootstrapTable from './Pagination';
import bootstrapStyle from './bootstrap-style';

const customTotal = (from: number, to: number, size: number) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing {from} to {to} of {size} Results
  </span>
);

const customPaginationProducts = productsGenerator(87);

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Pagination',
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
    pagination: { control: 'object', description: 'table pagination' },
  },
  decorators: [
    (Story: any) => bootstrapStyle()(Story),
  ],
} satisfies Meta<typeof BootstrapTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicPaginationTable: Story = {
  name: "Basic pagination table",
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

    <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
    `,
    pagination: paginationFactory(),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Wait for the table to render with initial data (page 1)
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // Assuming default size is 10, item 10 should not be on page 1
    await expect(canvas.queryByText('Item name 10')).not.toBeInTheDocument();

    // Click on page 2
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    // Verify row 10 is visible on page 2
    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();

    // Click on page 3
    const page3Btn = await canvas.findByText('3', { selector: '.page-link' });
    await userEvent.click(page3Btn);

    // Verify row 20 is visible on page 3
    await expect(await canvas.findByText('Item name 20')).toBeInTheDocument();
  }
};

export const PaginationHooks: Story = {
  name: "Pagination hooks",
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

    const options = {
      onSizePerPageChange: (sizePerPage, page) => {
        console.log('Size per page change!!!');
        console.log('Newest size per page:' + sizePerPage);
        console.log('Newest page:' + page);
      },
      onPageChange: (page, sizePerPage) => {
        console.log('Page change!!!');
        console.log('Newest size per page:' + sizePerPage);
        console.log('Newest page:' + page);
      }
    };

    <BootstrapTable
      keyField="id"
      data={ products }
      columns={ columns }
      pagination={ paginationFactory(options) }
    />
    `,
    pagination: paginationFactory({
      onSizePerPageChange: (sizePerPage: number, page: any) => {
        console.log('Size per page change!!!');
        console.log(`Newest size per page: ${sizePerPage}`);
        console.log(`Newest page: ${page}`);
      },
      onPageChange: (page: any, sizePerPage: number) => {
        console.log('Page change!!!');
        console.log(`Newest size per page: ${sizePerPage}`);
        console.log(`Newest page: ${page}`);
      }
    }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();
  }
};

export const CustomPagination: Story = {
  name: "Custom pagination",
  args: {
    columns: columns,
    data: customPaginationProducts,
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';
    // ...

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing { from } to { to } of { size } Results
      </span>
    );

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      // alwaysShowAllBtns: true, // Always show next and previous button
      // withFirstAndLast: false, // Hide the going to First and Last page button
      // hideSizePerPage: true, // Hide the sizePerPage dropdown always
      // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: products.length
      }] // A numeric array is also available. the purpose of above example is custom the text
    };

    <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory(options) } />
    `,
    pagination: paginationFactory({
      paginationSize: 4,
      pageStartIndex: 0,
      // alwaysShowAllBtns: true, // Always show next and previous button
      // withFirstAndLast: false, // Hide the going to First and Last page button
      // hideSizePerPage: true, // Hide the sizePerPage dropdown always
      // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: <span>Next</span>,
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: customPaginationProducts.length
      }] // A numeric array is also available. the purpose of above example is custom the text
    }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Initial state: page size is 5, so items 0-4 should be visible
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    await expect(canvas.queryByText('Item name 5')).not.toBeInTheDocument();

    // Click on "Next" page
    const nextBtn = await canvas.findByText('Next');
    await userEvent.click(nextBtn);

    // After clicking next, items 5-9 should be visible
    await expect(await canvas.findByText('Item name 5')).toBeInTheDocument();
    
    // There's a custom total showing "Showing X to Y of Z Results"
    // In page 2 with size 5, it should show 6 to 10
    await expect(await canvas.findByText('Showing 6 to 10 of 87 Results')).toBeInTheDocument();

    // Go to "Last" page
    const lastBtn = await canvas.findByText('Last');
    await userEvent.click(lastBtn);

    // It should be on the last page now, containing item 86
    await expect(await canvas.findByText('Item name 86')).toBeInTheDocument();
    await expect(await canvas.findByText('Showing 86 to 87 of 87 Results')).toBeInTheDocument();
  }
};

const pageButtonRenderer = ({
  page,
  active,
  disable,
  title,
  onPageChange
}: any) => {
  const handleClick = (e: any) => {
    e.preventDefault();
    onPageChange(page);
  };
  const activeStyle: { backgroundColor?: string, color?: string } = {};
  if (active) {
    activeStyle.backgroundColor = 'black';
    activeStyle.color = 'white';
  } else {
    activeStyle.backgroundColor = 'gray';
    activeStyle.color = 'black';
  }
  if (typeof page === 'string') {
    activeStyle.backgroundColor = 'white';
    activeStyle.color = 'black';
  }
  return (
    <li key={page} className="page-item">
      <a href="#" onClick={handleClick} style={activeStyle}>{page}</a>
    </li>
  );
};

export const CustomPageButton: Story = {
  name: "Custom page button",
  args: {
    columns: columns,
    data: productsGenerator(87),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';
    // ...

    const pageButtonRenderer = ({
      page,
      active,
      disable,
      title,
      onPageChange
    }) => {
      const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
      };
      const activeStyle = {};
      if (active) {
        activeStyle.backgroundColor = 'black';
        activeStyle.color = 'white';
      } else {
        activeStyle.backgroundColor = 'gray';
        activeStyle.color = 'black';
      }
      if (typeof page === 'string') {
        activeStyle.backgroundColor = 'white';
        activeStyle.color = 'black';
      }
      return (
        <li key={ page } className="page-item">
          <a href="#" onClick={ handleClick } style={ activeStyle }>{ page }</a>
        </li>
      );
    };

    const options = {
      pageButtonRenderer
    };

    <BootstrapTable keyField="id" data={ products } columns={ columns } pagination={ paginationFactory(options) } />
    `,
    pagination: paginationFactory({ pageButtonRenderer }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // In this custom renderer, the numbers are just rendered in anchors
    const page2Btn = await canvas.findByText('2', { selector: 'a' });
    await userEvent.click(page2Btn);

    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();
  }
};

const pageListRenderer = ({
  pages,
  onPageChange
}: any) => {
  const pageWithoutIndication = pages.filter((p: any) => typeof p.page !== 'string');
  return (
    <div>
      {
        pageWithoutIndication.map((p: any) => (
          <button key={p.page} className="btn btn-success" onClick={() => onPageChange(p.page)}>{p.page}</button>
        ))
      }
    </div>
  );
};

export const CustomPageList: Story = {
  name: "Custom page list",
  args: {
    columns: columns,
    data: productsGenerator(87),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';
    // ...

    const pageListRenderer = ({
      pages,
      onPageChange
    }) => {
      const pageWithoutIndication = pages.filter(p => typeof p.page !== 'string');
      return (
        <div>
          {
            pageWithoutIndication.map(p => (
              <button key={ p.page } className="btn btn-success" onClick={ () => onPageChange(p.page) }>{ p.page }</button>
            ))
          }
        </div>
      );
    };

    const options = {
      pageListRenderer
    };

    <BootstrapTable keyField="id" data={ products } columns={ columns } pagination={ paginationFactory(options) } />
    `,
    pagination: paginationFactory({ pageListRenderer }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // In this custom renderer, pages are buttons
    const page2Btn = await canvas.findByRole('button', { name: '2' });
    await userEvent.click(page2Btn);

    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();
  }
};

const sizePerPageOptionRenderer = ({
  text,
  page,
  onSizePerPageChange
}: any) => (
  <li
    key={text}
    role="presentation"
    className="dropdown-item"
  >
    <a
      href="#"
      // @ts-ignore
      tabIndex="-1"
      role="menuitem"
      data-page={page}
      onMouseDown={(e: any) => {
        e.preventDefault();
        onSizePerPageChange(page);
      }}
      style={{ color: 'red' }}
    >
      {text}
    </a>
  </li>
);

export const CustomSizePerPageOption: Story = {
  name: "Custom size per page option",
  args: {
    columns: columns,
    data: productsGenerator(87),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';
    // ...

    const sizePerPageOptionRenderer = ({
      text,
      page,
      onSizePerPageChange
    }) => (
      <li
        key={ text }
        role="presentation"
        className="dropdown-item"
      >
        <a
          href="#"
          tabIndex="-1"
          role="menuitem"
          data-page={ page }
          onMouseDown={ (e) => {
            e.preventDefault();
            onSizePerPageChange(page);
          } }
          style={ { color: 'red' } }
        >
          { text }
        </a>
      </li>
    );

    const options = {
      sizePerPageOptionRenderer
    };

    <BootstrapTable keyField="id" data={ products } columns={ columns } pagination={ paginationFactory(options) } />
    `,
    pagination: paginationFactory({ sizePerPageOptionRenderer }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // Default size is 10, items up to 9 visible
    await expect(canvas.queryByText('Item name 10')).not.toBeInTheDocument();

    // In this custom renderer, dropdown items are anchors with red text
    const dropdownToggle = await canvas.findByRole('button', { name: /10/ });
    await userEvent.click(dropdownToggle);
    
    const size25Btn = await canvas.findByText('25');
    await userEvent.click(size25Btn);

    // Items up to 24 should be visible
    await expect(await canvas.findByText('Item name 20')).toBeInTheDocument();
  }
};

const sizePerPageRenderer = ({
  options,
  currSizePerPage,
  onSizePerPageChange
}: any) => (
  <div className="btn-group" role="group">
    {
      options.map((option: any) => (
        <button
          key={option.text}
          type="button"
          onClick={() => onSizePerPageChange(option.page)}
          className={`btn ${currSizePerPage === `${option.page}` ? 'btn-secondary' : 'btn-warning'}`}
        >
          {option.text}
        </button>
      ))
    }
  </div>
);

export const CustomSizePerPage: Story = {
  name: "Custom size per page",
  args: {
    columns: columns,
    data: productsGenerator(87),
    sourceCode: `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';
    // ...

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange
    }) => (
      <div className="btn-group" role="group">
        {
          options.map((option) => {
            const isSelect = currSizePerPage === \`$\{option.page}\`;
            return (
              <button
                key={ option.text }
                type="button"
                onClick={ () => onSizePerPageChange(option.page) }
                className={ \`btn $\{isSelect ? 'btn-secondary' : 'btn-warning'}\` }
              >
                { option.text }
              </button>
            );
          })
        }
      </div>
    );

    const options = {
      sizePerPageRenderer
    };

    <BootstrapTable keyField="id" data={ products } columns={ columns } pagination={ paginationFactory(options) } />
    `,
    pagination: paginationFactory({ sizePerPageRenderer }),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // Default size is 10, items up to 9 visible
    await expect(canvas.queryByText('Item name 10')).not.toBeInTheDocument();

    // The sizePerPageRenderer creates buttons with strings like '25'
    const size25Btn = await canvas.findByText('25');
    await userEvent.click(size25Btn);

    // Items up to 24 should be visible
    await expect(await canvas.findByText('Item name 20')).toBeInTheDocument();
  }
};

export const PaginationWithDynamicData: Story = {
  name: "Pagination with dynamic data",
  args: {
    mode: "dynamic",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Only Book 1-5 displayed
    await expect(await canvas.findByText('Book 1')).toBeInTheDocument();
    await expect(await canvas.findByText('Book 5')).toBeInTheDocument();
    await expect(canvas.queryByText('Book 6')).not.toBeInTheDocument();

    // Add a book
    const addBtn = await canvas.findByRole('button', { name: /Add a book to the end/i });
    await userEvent.click(addBtn);

    // Click next page
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    // Book 6-10 displayed
    await expect(await canvas.findByText('Book 10')).toBeInTheDocument();
  }
};

export const StandalonePaginationList: Story = {
  name: "Standalone pagination list",
  args: {
    mode: "standalone-list",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // pagination list click
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();
  }
};

export const StandaloneSizePerPageDropdown: Story = {
  name: "Standalone size per page dropdown",
  args: {
    mode: "standalone-dropdown",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    
    // dropdown click
    const dropdownToggle = await canvas.findByRole('button', { name: /10/ });
    await userEvent.click(dropdownToggle);

    const size25Btn = await canvas.findByText('25', { selector: '.dropdown-item a' });
    await userEvent.click(size25Btn);

    await expect(await canvas.findByText('Item name 20')).toBeInTheDocument();
  }
};

export const StandalonePaginationTotal: Story = {
  name: "Standalone pagination total",
  args: {
    mode: "standalone-total",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    await expect(await canvas.findByText(/Showing rows 1 to 10 of/)).toBeInTheDocument();
    
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    await expect(await canvas.findByText(/Showing rows 11 to 20 of/)).toBeInTheDocument();
  }
};

export const FullCustomPagination: Story = {
  name: "Full custom pagination",
  args: {
    mode: "full",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();
    await expect(await canvas.findByText(/Current Page: 1/)).toBeInTheDocument();
    
    // Click Next Page button
    const nextBtn = await canvas.findByRole('button', { name: 'Next Page' });
    await userEvent.click(nextBtn);

    await expect(await canvas.findByText('Item name 10')).toBeInTheDocument();
    await expect(await canvas.findByText(/Current Page: 2/)).toBeInTheDocument();

    const size25Btn = await canvas.findByRole('button', { name: 'Size Per Page: 25' });
    await userEvent.click(size25Btn);

    // On page 2 with size 25, first item is index 25
    await expect(await canvas.findByText('Item name 25')).toBeInTheDocument();
    await expect(await canvas.findByText(/Current SizePerPage: 25/)).toBeInTheDocument();
  }
};

export const RemoteFullCustomPagination: Story = {
  name: "Remote full custom pagination",
  args: {
    mode: "remote-full",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    
    // Remote fetch simulates delay, items 0 to 9 loaded initially
    await expect(await canvas.findByText('Item name 0', {}, { timeout: 3000 })).toBeInTheDocument();
    
    // Click Page 2
    const page2Btn = await canvas.findByText('2', { selector: '.page-link' });
    await userEvent.click(page2Btn);

    // Wait for the simulated 2000ms delay
    await expect(await canvas.findByText('Item name 10', {}, { timeout: 5000 })).toBeInTheDocument();
  }
};

export const CustomPaginationWithFilter: Story = {
  name: "Custom pagination with filter",
  args: {
    mode: "filter",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();

    const loadBtn = await canvas.findByRole('button', { name: 'Load Another Data' });
    await userEvent.click(loadBtn);

    // After loading, it uses productsQualityGenerator(40, 7)
    await expect(await canvas.findByText('Item name 7')).toBeInTheDocument();
  }
};

export const CustomPaginationWithSearch: Story = {
  name: "Custom pagination with search",
  args: {
    mode: "search",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Item name 0')).toBeInTheDocument();

    // Type into the search bar
    const searchInput = await canvas.findByPlaceholderText('Search');
    await userEvent.type(searchInput, '22');

    // Should find "Item name 22" (wait for filter to apply)
    await expect(await canvas.findByText('Item name 22')).toBeInTheDocument();
    
    // Item 0 should be gone because it doesn't match '22'
    await expect(canvas.queryByText('Item name 0')).not.toBeInTheDocument();
  }
};
