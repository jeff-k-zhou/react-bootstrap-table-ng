import * as path from "path";
import umdConfig from "./webpack.umd.babel";

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng-editor/dist/react-bootstrap-table-ng-editor":
      "./packages/react-bootstrap-table-ng-editor/index.js",
    "react-bootstrap-table-ng-editor/dist/react-bootstrap-table-ng-editor.min":
      "./packages/react-bootstrap-table-ng-editor/index.js",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNgEditor",
    libraryTarget: "umd",
  },
};
