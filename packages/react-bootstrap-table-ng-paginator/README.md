# react-bootstrap-table-ng-paginator

`react-bootstrap-table-ng` separate the pagination code base to [`react-bootstrap-table-ng-paginator`](https://github.com/jeff-k-zhou/react-bootstrap-table-ng/tree/main/packages/react-bootstrap-table-ng-paginator), so there's a little bit different when you use pagination. In the following, we are going to show you how to enable and configure the a pagination table

**[Live Demo For Pagination](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/docs/pagination--docs)**

**[API&Props Definitation](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html)**

---

## Install

```sh
$ npm install react-bootstrap-table-ng-paginator --save
```

## Add CSS

```js
// es5
require("react-bootstrap-table-ng-paginator/dist/react-bootstrap-table-ng-paginator.min.css");

// es6
import "react-bootstrap-table-ng-paginator/dist/react-bootstrap-table-ng-paginator.min.css";
```

## How

Let's enable a pagination on your table:

```js
import paginationFactory from "react-bootstrap-table-ng-paginator";
// omit...

<BootstrapTable
  keyField="id"
  data={products}
  columns={columns}
  pagination={paginationFactory()}
/>;
```

## Customization

### Basic Customization

`react-bootstrap-table-ng` give some simple ways to customize something like text, styling etc, following is all the props we support for basic customization:

- [paginationSize](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationsizeperpage-number)
- [sizePerPageList](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationsizeperpagelist-array)
- [withFirstAndLast](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationwithfirstandlast-bool)
- [alwaysShowAllBtns](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationalwaysshowallbtns-bool)
- [firstPageText](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationfirstpagetext-any)
- [prePageText](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationprepagetext-any)
- [nextPageText](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationnextpagetext-any)
- [lastPageText](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationlastpagetext-any)
- [firstPageTitle](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationfirstpagetitle-any)
- [prePageTitle](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationprepagetitle-any)
- [nextPageTitle](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationnextpagetitle-any)
- [lastPageTitle](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationlastpagetitle-any)
- [hideSizePerPage](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationhidesizeperpage-bool)
- [hidePageListOnlyOnePage](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationhidepagelistonlyonepage-bool)
- [showTotal](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationshowtotal-bool)
- [disablePageTitle](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationdisablepagetitle-bool)

You can check [this online demo](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/story/pagination--full-custom-pagination) for above props usage.

### Advance Customization

Sometime, you may feel above props is not satisfied with your requirement, don't worry, we provide following renderer for each part of pagination:

- [pageListRenderer](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationpagelistrenderer-function)
- [pageButtonRenderer](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationpagebuttonrenderer-function)
- [sizePerPageRenderer](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationsizeperpagerenderer-function)
- [sizePerPageOptionRenderer](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationsizeperpageoptionrenderer-function)
- [paginationTotalRenderer](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/pagination-props.html#paginationpaginationtotalrenderer-function)

### Fully Customization

If you want to customize the pagination component completely, you may get interesting on following solutions:

- Standalone
- Non-standalone

`react-bootstrap-table-ng-paginator` have a `PaginationProvider` which is a react context and that will be easier to customize the pagination components under the scope of `PaginationProvider`. Let's introduce it step by step:

#### 1. Import PaginationProvider

```js
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table-ng-paginator";
```

#### 2. Declare custom and totalSize in pagination option:

```js
const paginationOption = {
  custom: true,
  totalSize: products.length,
};
```

#### 3. Render PaginationProvider

```js
<PaginationProvider
  pagination={ paginationFactory(options) }
>
  {
    ({
      paginationProps,
      paginationTableProps
    }) => (
      .....
    )
  }
</PaginationProvider>
```

`PaginationProvider` actually is a wrapper for the concumser of react context, so that now you have to get the props from context provide then render to your compoennt and `BootstrapTable`:

- `paginationProps`: this include everything about pagination, you will use it when you render standalone component or your custom component.
- `paginationTableProps`: you don't need to know about this, but you have to render this as props to `BootstrapTable`.

So far, your customization pagination is supposed to look like it:

```js
<PaginationProvider pagination={paginationFactory(options)}>
  {({ paginationProps, paginationTableProps }) => (
    <div>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        {...paginationTableProps}
      />
    </div>
  )}
</PaginationProvider>
```

Now, you have to choose which solution you like: standalone or non-standalone ?

#### 4.1 Use Standalone Component

`react-bootstrap-table-ng-paginator` provider three standalone components:

- Size Per Page Dropdwn Standalone
- Pagination List Standalone
- Pagination Total Standalone

When render each standalone, you just need to pass the `paginationProps` props to standalone component:

```js
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
  PaginationTotalStandalone,
} from "react-bootstrap-table-ng-paginator";

<PaginationProvider pagination={paginationFactory(options)}>
  {({ paginationProps, paginationTableProps }) => (
    <div>
      <SizePerPageDropdownStandalone {...paginationProps} />
      <PaginationTotalStandalone {...paginationProps} />
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        {...paginationTableProps}
      />
      <PaginationListStandalone {...paginationProps} />
    </div>
  )}
</PaginationProvider>;
```

That's it!! The benifit for using standalone is you can much easier to render the standalone component in any posistion. In the future, we will implement more featue like applying `style`, `className` etc on standalone components.

##### Customizable props for `PaginationListStandalone`

- N/A

##### Customizable props for `SizePerPageDropdownStandalone`

- `open`: `true` to make dropdown show.
- `hidden`: `true` to hide the size per page dropdown.
- `btnContextual`: Set the button contextual
- `variation`: Variation for dropdown, available value is `dropdown` and `dropup`.
- `className`: Custom the class on size per page dropdown

##### Customizable props for `SizePerPageDropdownStandalone`

- N/A

#### 4.2 Customization Everything

If you choose to custom the pagination component by yourself, the `paginationProps` will be important for you. Becasue you have to know for example how to change page or what's the current page etc. Hence, following is all the props in `paginationProps` object:

```js
(page,
  sizePerPage,
  pageStartIndex,
  hidePageListOnlyOnePage,
  hideSizePerPage,
  alwaysShowAllBtns,
  withFirstAndLast,
  dataSize,
  sizePerPageList,
  paginationSize,
  showTotal,
  pageListRenderer,
  pageButtonRenderer,
  sizePerPageRenderer,
  paginationTotalRenderer,
  sizePerPageOptionRenderer,
  firstPageText,
  prePageText,
  nextPageText,
  lastPageText,
  prePageTitle,
  nextPageTitle,
  firstPageTitle,
  lastPageTitle,
  onPageChange,
  onSizePerPageChange,
  disablePageTitle);
```

In most of case, `page`, `sizePerPage`, `onPageChange` and `onSizePerPageChange` are most important things for developer.

- `page`: Current page.
- `sizePerPage`: Current size per page.
- `onPageChange`: Call it when you nede to change page. This function accept one number argument which indicate the new page
- `onSizePerPageChange`: Call it when you nede to change size per page. This function accept two number argument which indicate the new sizePerPage and new page

[Here](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/story/pagination--full-custom-pagination) is a online example.
