import { render } from "@testing-library/react";
import React from "react";

import BootstrapTable from "../../src/bootstrap-table";
import createColumnContext from "../../src/contexts/column-context";

describe("ColumnManagementContext", () => {
  const data = [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ];

  const columns = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "name",
      text: "Name",
    },
  ];

  const mockBase = jest.fn((props) => (
    <BootstrapTable data={data} columns={columns} keyField="id" {...props} />
  ));

  const ColumnContext = createColumnContext();

  function renderContext(options = {}) {
    return render(
      <ColumnContext.Provider data={data} columns={columns} {...options}>
        <ColumnContext.Consumer>
          {(columnToggleProps) => mockBase(columnToggleProps)}
        </ColumnContext.Consumer>
      </ColumnContext.Provider>
    );
  }

  beforeEach(() => {
    mockBase.mockClear();
  });

  describe("default render", () => {
    it("should have correct Provider property after calling createColumnManagementContext", () => {
      expect(ColumnContext.Provider).toBeDefined();
    });

    it("should have correct Consumer property after calling createColumnManagementContext", () => {
      expect(ColumnContext.Consumer).toBeDefined();
    });

    it("should provide all columns by default", () => {
      renderContext();
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.columns).toHaveLength(columns.length);
      expect(props.columns[0].dataField).toEqual("id");
      expect(props.columns[1].dataField).toEqual("name");
    });
  });

  describe("when toggles props exist", () => {
    it("should provide only toggled columns", () => {
      renderContext({
        toggles: {
          id: true,
          name: false,
        },
      });
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.columns).toHaveLength(columns.length - 1);
      expect(props.columns[0].dataField).toEqual("id");
    });
  });

  describe("if there is any column.hidden is true", () => {
    it("should provide only visible columns", () => {
      renderContext({
        columns: [
          {
            dataField: "id",
            text: "ID",
          },
          {
            dataField: "name",
            text: "Name",
            hidden: true,
          },
        ],
      });
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.columns).toHaveLength(columns.length - 1);
      expect(props.columns[0].dataField).toEqual("id");
    });
  });
});
