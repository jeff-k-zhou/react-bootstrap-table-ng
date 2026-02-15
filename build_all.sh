#!/bin/sh

# build react-bootstrap-table-ng
echo "-- build react-bootstrap-table-ng"
yarn install
yarn build

# build react-bootstrap-table-ng-example
echo "-- build storybook"
cd packages/react-bootstrap-table-ng-example
yarn install
yarn gh-pages:build
cd ../..

# build website
echo "-- build website"
cd website
yarn install
yarn build
cd ..
