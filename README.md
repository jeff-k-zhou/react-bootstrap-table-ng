# react-bootstrap-table-ng
This is a fork of [react-bootstrap-table-nextgen](https://github.com/TerrenceMiao/react-bootstrap-table-nextgen) which was original 
forked from [react-bootstrap-table-next](https://github.com/react-bootstrap-table/react-bootstrap-table2). The goal of this fork is to provide stable version with react 18 and above, bootstrap 4 and above. 

The version number pattern is `major.minor.patch`, where `major` is the major version number of bootstrap, `minor` is the major version number of react, and `patch` is the patch version number of react-bootstrap-table-ng. For example, `4.18.0` means it is based on bootstrap 4, react 18, and react-bootstrap-table-ng patch 0 on 4.18.x. 

[![Build Status](https://travis-ci.org/jeff-k-zhou/react-bootstrap-table-ng.svg?branch=master)](https://travis-ci.org/jeff-k-zhou/react-bootstrap-table-ng)
Rebuild of [react-bootstrap-table-ng](https://github.com/jeff-k-zhou/react-bootstrap-table-ng)

> Note that `react-bootstrap-table-ng`'s npm module name is [**`react-bootstrap-table-ng`**](https://www.npmjs.com/package/react-bootstrap-table-ng)

The following sections were coppied from [react-bootstrap-table-next](https://github.com/react-bootstrap-table/react-bootstrap-table2) with package name changed to react-bootstrap-table-ng.

`react-bootstrap-table-ng` separates some functionalities from its core modules to other modules as listed in the following:

- [`react-bootstrap-table-ng`](https://www.npmjs.com/package/react-bootstrap-table-ng)
- [`react-bootstrap-table-ng-filter`](https://www.npmjs.com/package/react-bootstrap-table-ng-filter)
- [`react-bootstrap-table-ng-editor`](https://www.npmjs.com/package/react-bootstrap-table-ng-editor)
- [`react-bootstrap-table-ng-paginator`](https://www.npmjs.com/package/react-bootstrap-table-ng-paginator)
- [`react-bootstrap-table-ng-overlay`](https://www.npmjs.com/package/react-bootstrap-table-ng-overlay)
- [`react-bootstrap-table-ng-toolkit`](https://www.npmjs.com/package/react-bootstrap-table-ng-toolkit)

Not only does this reduce the bundle size of your apps but also helps us have a cleaner design to avoid handling too much logic in the kernel module (SRP).

## Migration

If you are coming from the legacy [`react-bootstrap-table`](https://github.com/AllenFang/react-bootstrap-table/), please check out the [migration guide](./docs/migration.md).

## Usage

See [getting started](https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/getting-started.html).

## Online Demo

See `react-bootstrap-table-ng` [storybook](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/index.html).

## Development

Please check the [development guide](./docs/development.md).

## Running storybook example on your local machine

```sh
# Clone the repo
$ git clone https://github.com/jeff-k-zhou/react-bootstrap-table-ng.git

# change dir to the cloned repo
$ cd react-bootstrap-table-ng

# Install all dependencies with yarn
$ yarn install

# Build with yarn
$ yarn build

# Run test with yarn
$ yarn test

# Start the stroybook server, then go to localhost:6006
$ yarn storybook

```