/* eslint no-param-reassign: 0 */
import { render } from "@testing-library/react";
import React from "react";

import Base from "../../src/bootstrap-table";
import withContext from "../../src/contexts";

describe("Context", () => {
  const keyField = "id";

  let columns: any;

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

  const BootstrapTable = withContext(Base);

  beforeEach(() => {
    columns = [
      {
        dataField: keyField,
        text: "ID",
      },
      {
        dataField: "name",
        text: "Name",
      },
    ];
  });

  describe("basic render", () => {
    it("should render correctly and provide DataContext", () => {
      const { container } = render(
        <BootstrapTable keyField={keyField} data={data} columns={columns} />
      );
      // Table should be rendered
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if there's sort is enable", () => {
    it("should render with sort context", () => {
      const columnsWithSort = columns.map((c: any) => {
        return { ...c, sort: true };
      });
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columnsWithSort}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if thers's any column hidden", () => {
    it("should render with column context", () => {
      const columnsWithHidden = [
        {
          dataField: keyField,
          text: "ID",
        },
        {
          dataField: "name",
          text: "Name",
          hidden: true,
        },
      ];
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columnsWithHidden}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if columnToggle is enable", () => {
    it("should render with column context", () => {
      const columnToggle = { toggles: { id: true, name: true } };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          columnToggle={columnToggle}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if row selection is enable", () => {
    it("should render with selection context", () => {
      const selectRow = { mode: "radio" };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          selectRow={selectRow}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if cell editing is enable", () => {
    it("should render with cell edit context", () => {
      const CellEditContext = React.createContext(null);
      const cellEdit = {
        createContext: jest.fn().mockReturnValue({
          Provider: CellEditContext.Provider,
          Consumer: CellEditContext.Consumer,
        }),
        options: {},
        createEditingCell: jest.fn().mockReturnValue(() => null),
        withRowLevelCellEdit: jest.fn().mockReturnValue(() => null),
      };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          cellEdit={cellEdit}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if search is enable", () => {
    it("should render with search context", () => {
      const SearchContext = React.createContext(null);
      const search = {
        searchContext: jest.fn().mockReturnValue(SearchContext),
        searchText: "",
      };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          search={search}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if column filter is enable", () => {
    it("should render with filter context", () => {
      const FilterContext = React.createContext(null);
      const filter = {
        createContext: jest.fn().mockReturnValue({
          Provider: FilterContext.Provider,
          Consumer: FilterContext.Consumer,
        }),
      };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          filter={filter}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if pagination is enable", () => {
    it("should render with pagination context", () => {
      const PaginationContext = React.createContext(null);
      const paginator = {
        createContext: jest.fn().mockReturnValue({
          Provider: PaginationContext.Provider,
          Consumer: PaginationContext.Consumer,
        }),
      };
      const { container } = render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          pagination={paginator}
        />
      );
      expect(container.querySelector("table")).toBeInTheDocument();
    });
  });

  describe("if registerExposedAPI props is defined", () => {
    it("should call props.registerExposedAPI correctly", () => {
      const registerExposedAPI = jest.fn();
      const PaginationContext = React.createContext(null);
      const paginator = {
        createContext: jest.fn().mockReturnValue({
          Provider: PaginationContext.Provider,
          Consumer: PaginationContext.Consumer,
        }),
      };
      render(
        <BootstrapTable
          keyField={keyField}
          data={data}
          columns={columns}
          pagination={paginator}
          registerExposedAPI={registerExposedAPI}
        />
      );
      expect(registerExposedAPI).toHaveBeenCalledTimes(1);
    });
  });
});
