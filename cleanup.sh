#!/bin/sh

rm -rf node_modules

rm -rf packages/react-bootstrap-table-ng/dist
rm -rf packages/react-bootstrap-table-ng/lib
rm -rf packages/react-bootstrap-table-ng/node_modules
find packages/react-bootstrap-table-ng -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-editor/dist
rm -rf packages/react-bootstrap-table-ng-editor/lib
rm -rf packages/react-bootstrap-table-ng-editor/node_modules
find packages/react-bootstrap-table-ng-editor -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-example/node_modules
rm -rf packages/react-bootstrap-table-ng-example/storybook-static
find packages/react-bootstrap-table-ng-example/src -type f -name "*.js" -exec rm {} \;
find packages/react-bootstrap-table-ng-example/test -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-filter/dist
rm -rf packages/react-bootstrap-table-ng-filter/lib
rm -rf packages/react-bootstrap-table-ng-filter/node_modules
find packages/react-bootstrap-table-ng-filter -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-overlay/dist
rm -rf packages/react-bootstrap-table-ng-overlay/lib
rm -rf packages/react-bootstrap-table-ng-overlay/node_modules
find packages/react-bootstrap-table-ng-overlay -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-paginator/dist
rm -rf packages/react-bootstrap-table-ng-paginator/lib
rm -rf packages/react-bootstrap-table-ng-paginator/node_modules
find packages/react-bootstrap-table-ng-paginator -type f -name "*.js" -exec rm {} \;

rm -rf packages/react-bootstrap-table-ng-toolkit/dist
rm -rf packages/react-bootstrap-table-ng-toolkit/lib
rm -rf packages/react-bootstrap-table-ng-toolkit/node_modules
find packages/react-bootstrap-table-ng-toolkit -type f -name "*.js" -exec rm {} \;

rm -rf website/node_modules
rm -rf website/build
rm -rf website/static/storybook
rm -rf website/build_output.txt
rm -rf website/build.log
rm -rf website/final_build.log

rm -rf lerna-debug.log
rm -rf yarn-debug.log
rm -rf yarn-error.log   

find . -type f -name "*.js.map" -exec rm {} \;
find . -type f -name "*.d.ts" -exec rm {} \;
