import ToolkitProvider, {
  ToolkitContext,
  ColumnToggle,
  CSVExport,
  Search,
  DeleteRowButton,
  InsertRowButton,
  InsertModal,
  InsertModalToggle,
} from "../index";

import ColumnToggleIndex from "../src/column-toggle/index";
import CSVExportIndex from "../src/csv/index";
import SearchIndex from "../src/search/index";
import OpIndex from "../src/op/index";

describe("Toolkit exports and sub-module indices", () => {
  it("exports ToolkitProvider and ToolkitContext", () => {
    expect(ToolkitProvider).toBeDefined();
    expect(ToolkitContext).toBeDefined();
  });

  it("exports submodules from index", () => {
    expect(ColumnToggle).toBeDefined();
    expect(CSVExport).toBeDefined();
    expect(Search).toBeDefined();
    expect(DeleteRowButton).toBeDefined();
    expect(InsertRowButton).toBeDefined();
    expect(InsertModal).toBeDefined();
    expect(InsertModalToggle).toBeDefined();
  });

  it("exports ColumnToggleIndex", () => {
    expect(ColumnToggleIndex.ToggleList).toBeDefined();
  });

  it("exports CSVExportIndex", () => {
    expect(CSVExportIndex.ExportCSVButton).toBeDefined();
  });

  it("exports SearchIndex", () => {
    expect(SearchIndex.SearchBar).toBeDefined();
    expect(SearchIndex.ClearSearchButton).toBeDefined();
  });

  it("exports OpIndex", () => {
    expect(OpIndex).toEqual({});
  });
});
