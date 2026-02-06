---
id: basic-pagination
title: Pagination
sidebar_label: Pagination
---

`react-bootstrap-table-ng` separate the pagination code base to [`react-bootstrap-table-ng-pagination`](https://github.com/jeff-k-zhou/react-bootstrap-table-ng/tree/develop/packages/react-bootstrap-table-ng-pagination), so there's a little bit different when you use pagination. In the following, we are going to show you how to enable and configure the a pagination table

**[Live Demo For Pagination](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=Pagination)**   
**[API & Props Definition](./pagination-props)**

-----

## Install

```sh
$ npm install react-bootstrap-table-ng-pagination --save
```
## Add CSS

```js
// es5 
require('react-bootstrap-table-ng-pagination/dist/react-bootstrap-table-ng-pagination.min.css');

// es6
import 'react-bootstrap-table-ng-pagination/dist/react-bootstrap-table-ng-pagination.min.css';
```

## How

Let's enable a pagination on your table:

```js
import paginationFactory from 'react-bootstrap-table-ng-pagination';
// omit...

```js
<BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
```

## Customization

### Basic Customization

`react-bootstrap-table-ng` give some simple ways to customize something like text, styling etc, following is all the props we support for basic customization:

* [paginationSize](./pagination-props#paginationpaginationsize-number)
* [sizePerPageList](./pagination-props#paginationsizeperpagelist-array)
* [withFirstAndLast](./pagination-props#paginationwithfirstandlast-bool)
* [alwaysShowAllBtns](./pagination-props#paginationalwaysshowallbtns-bool)
* [firstPageText](./pagination-props#paginationfirstpagetext-any)
* [prePageText](./pagination-props#paginationprepagetext-any)
* [nextPageText](./pagination-props#paginationnextpagetext-any)
* [lastPageText](./pagination-props#paginationlastpagetext-any)
* [firstPageTitle](./pagination-props#paginationfirstpagetitle-any)
* [prePageTitle](./pagination-props#paginationprepagetitle-any)
* [nextPageTitle](./pagination-props#paginationnextpagetitle-any)
* [lastPageTitle](./pagination-props#paginationlastpagetitle-any)
* [hideSizePerPage](./pagination-props#paginationhidesizeperpage-bool)
* [hidePageListOnlyOnePage](./pagination-props#paginationhidepagelistonlyonepage-bool)
* [showTotal](./pagination-props#paginationshowtotal-bool)
* [disablePageTitle](./pagination-props#paginationdisablepagetitle-bool)

You can check [this online demo](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/index.html?selectedKind=Pagination&selectedStory=Custom%20Pagination&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel) for above props usage.

### Advance Customization

Sometime, you may feel above props is not satisfied with your requirement, don't worry, we provide following renderer for each part of pagination:

* [pageListRenderer](./pagination-props#paginationpagelistrenderer-function)
* [pageButtonRenderer](./pagination-props#paginationpagebuttonrenderer-function)
* [sizePerPageRenderer](./pagination-props#paginationsizeperpagerenderer-function)
* [sizePerPageOptionRenderer](./pagination-props#paginationsizeperpageoptionrenderer-function)
* [paginationTotalRenderer](./pagination-props#paginationpaginationtotalrenderer-function)

### Completely Customization

If you want to customize the pagination component completely, you may get interesting on following solution:

* Standalone
* Non-standalone

`react-bootstrap-table-ng-paginator` have a `PaginationProvider` which is a react context and you will be easier to customize the pagination components under the scope of `PaginationProvider`. Let's introduce it step by step:

#### 1. Import PaginationProvider

```js
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table-ng-paginator';

```

#### 2. Declare custom and totalSize in pagination option:

```js
const paginationOption = {
  custom: true,
  totalSize: products.length
};
```

#### 3. Render PaginationProvider

```js
<PaginationProvider
  pagination={ paginationFactory(paginationOption) }
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

`PaginationProvider` actually is a wrapper for the consumer of react context so that you are able to get the props from context then render to your compoennt and `BootstrapTable`:

* `paginationProps`: this include everything about pagination, you will use it when you render standalone component or your custom component.
* `paginationTableProps`: you don't need to know about this, but you have to give it as props when render `BootstrapTable`.

So far, your customization pagination should look like it:
```js
<PaginationProvider
  pagination={ paginationFactory(paginationOption) }
>
  {
    ({
      paginationProps,
      paginationTableProps
    }) => (
      <div>
        <BootstrapTable
          keyField="id"
          data={ products }
          columns={ columns }
          { ...paginationTableProps }
        />
      </div>
    )
  }
</PaginationProvider>
```

Now, you have two choices
* Use Standalone Component
* Customize everything by yourself

#### 4.1 Use Standalone Component
`react-bootstrap-table-ng-paginator` provider three standalone components:

* Size Per Page Dropdown Standalone
* Pagination List Standalone
* Pagination Total Standalone

When render each standalone, you just need to pass the `paginationProps` props to standalone component:

```js
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table-ng-paginator';

<PaginationProvider
  pagination={ paginationFactory(options) }
>
  {
    ({
      paginationProps,
      paginationTableProps
    }) => (
      <div>
        <SizePerPageDropdownStandalone
          { ...paginationProps }
        />
        <PaginationTotalStandalone
          { ...paginationProps }
        />
        <BootstrapTable
          keyField="id"
          data={ products }
          columns={ columns }
          { ...paginationTableProps }
        />
        <PaginationListStandalone
          { ...paginationProps }
        />
      </div>
    )
  }
</PaginationProvider>
```

That's it!!  The benifit for using standalone is you can much easier to render the standalone component in any posistion. In the future, we will implement more featue like applying `style`, `className` etc on standalone components.    


<h5><b>Customizable props on `PaginationListStandalone`</b></h5>
* N/A

<h5><b>Customizable props on `SizePerPageDropdownStandalone`</b></h5>
* `open`: <b>true</b> to make dropdown show.
* `hidden`: <b>true</b> to hide the size per page dropdown.
* `btnContextual`: Set the button contextual.
* `variation`: Variation for dropdown, available value is `dropdown` and `dropup`.
* `className`: Custom the class on size per page dropdown

<h5><b>Customizable props on `SizePerPageDropdownStandalone`</b></h5>
* N/A


#### 4.2 Customization Everything

If you choose to custom the pagination component by yourself, the `paginationProps` will be important for you. Becasue you have to know for example how to change page or what's the current page etc. Therefore, following is all the props in `paginationProps` object:

```js
page,
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
disablePageTitle,
onPageChange,
onSizePerPageChange
```

In most of case, `page`, `sizePerPage`, `onPageChange` and `onSizePerPageChange` are most important properties for you:

* `page`: Current page.
* `sizePerPage`: Current size per page.
* `onPageChange`: Call it when you nede to change page. This function accept one number argument which indicate the new page 
* `onSizePerPageChange`: Call it when you nede to change size per page. This function accept two number argument which indicate the new sizePerPage and new page

[This](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/index.html?selectedKind=Pagination&selectedStory=Fully%20Custom%20Pagination&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel) is a online example for showing how to custom pagination completely.