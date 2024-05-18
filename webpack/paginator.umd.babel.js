import * as path from "path";
import umdConfig from "./webpack.umd.babel";

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng-paginator/dist/react-bootstrap-table-ng-paginator":
      "./packages/react-bootstrap-table-ng-paginator/index.tsx",
    "react-bootstrap-table-ng-paginator/dist/react-bootstrap-table-ng-paginator.min":
      "./packages/react-bootstrap-table-ng-paginator/index.tsx",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNgPaginator",
    libraryTarget: "umd",
  },
};
