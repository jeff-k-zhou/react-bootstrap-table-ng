import * as path from "path";
import umdConfig from "./webpack.umd.babel";

module.exports = {
  ...umdConfig,
  entry: {
    "react-bootstrap-table-ng-overlay/dist/react-bootstrap-table-ng-overlay":
      "./packages/react-bootstrap-table-ng-overlay/index.tsx",
    "react-bootstrap-table-ng-overlay/dist/react-bootstrap-table-ng-overlay.min":
      "./packages/react-bootstrap-table-ng-overlay/index.tsx",
  },
  output: {
    path: path.join(__dirname, "../packages"),
    filename: "[name].js",
    library: "ReactBootstrapTableNgOverlay",
    libraryTarget: "umd",
  },
};
