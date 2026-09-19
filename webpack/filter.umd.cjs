const path = require("path");
const umdConfig = require("./webpack.umd.cjs");

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng-filter/dist/react-bootstrap-table-ng-filter":
      "./packages/react-bootstrap-table-ng-filter/index.ts",
    "react-bootstrap-table-ng-filter/dist/react-bootstrap-table-ng-filter.min":
      "./packages/react-bootstrap-table-ng-filter/index.ts",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNgFilter",
    libraryTarget: "umd",
  },
};
