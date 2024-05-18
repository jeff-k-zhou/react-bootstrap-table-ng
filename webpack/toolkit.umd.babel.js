import * as path from "path";
import umdConfig from "./webpack.umd.babel";

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng-toolkit/dist/react-bootstrap-table-ng-toolkit":
      "./packages/react-bootstrap-table-ng-toolkit/index.ts",
    "react-bootstrap-table-ng-toolkit/dist/react-bootstrap-table-ng-toolkit.min":
      "./packages/react-bootstrap-table-ng-toolkit/index.ts",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNgToolkit",
    libraryTarget: "umd",
  },
};
