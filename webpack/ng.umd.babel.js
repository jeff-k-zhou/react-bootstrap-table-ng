import * as path from "path";
import umdConfig from "./webpack.umd.babel";

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng/dist/react-bootstrap-table-ng":
      "./packages/react-bootstrap-table-ng/index.ts",
    "react-bootstrap-table-ng/dist/react-bootstrap-table-ng.min":
      "./packages/react-bootstrap-table-ng/index.ts",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNg",
    libraryTarget: "umd",
  },
};
