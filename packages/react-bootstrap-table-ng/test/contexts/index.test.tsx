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
          Provider: (props: any) => (
            <CellEditContext.Provider value={props}>
              {props.children}
            </CellEditContext.Provider>
          ),
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
        searchContext: jest.fn().mockReturnValue({
          Provider: (props: any) => (
            <SearchContext.Provider value={props}>
              {props.children}
            </SearchContext.Provider>
          ),
          Consumer: SearchContext.Consumer,
        }),
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
          Provider: (props: any) => (
            <FilterContext.Provider value={props}>
              {props.children}
            </FilterContext.Provider>
          ),
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
          Provider: (props: any) => (
            <PaginationContext.Provider value={props}>
              {props.children}
            </PaginationContext.Provider>
          ),
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
    it("should call props.registerExposedAPI and handle all emitted events", () => {
      const paginationFactory = require("../../../react-bootstrap-table-ng-paginator").default;
      let apiEmitter: any;
      const registerExposedAPI = jest.fn((emitter) => {
        apiEmitter = emitter;
      });
      const setPaginationRemoteEmitter = jest.fn();
      const setDependencyModules = jest.fn();
      let paginationEmitter: any;
      const ref = React.createRef<any>();

      const paginator = paginationFactory();


      const selectRow = {
        mode: "checkbox",
        clickToSelect: true,
      };

      const cellEdit = {
        createContext: jest.fn().mockReturnValue({
          Provider: (props: any) => <div>{props.children}</div>,
          Consumer: ({ children }: any) => children({}),
        }),
        createEditingCell: jest.fn().mockReturnValue(() => null),
        withRowLevelCellEdit: jest.fn().mockImplementation((comp: any) => comp),
        options: { mode: "click" },
      };

      render(
        <BootstrapTable
          ref={ref}
          keyField={keyField}
          data={data}
          columns={columns}
          pagination={paginator}
          selectRow={{ mode: "checkbox" }}
          onTableChange={jest.fn()}
          registerExposedAPI={registerExposedAPI}
          setPaginationRemoteEmitter={(emitter: any) => {
            paginationEmitter = emitter;
            setPaginationRemoteEmitter(emitter);
          }}
          setDependencyModules={setDependencyModules}
        />
      );

      expect(registerExposedAPI).toHaveBeenCalledTimes(1);
      expect(setPaginationRemoteEmitter).toHaveBeenCalledTimes(1);
      expect(setDependencyModules).toHaveBeenCalledTimes(1);

      const payload1 = { result: null };
      apiEmitter.emit("get.table.data", payload1);
      expect(payload1.result).toBeDefined();

      const payload2 = { result: null };
      apiEmitter.emit("get.selected.rows", payload2);
      expect(payload2.result).toBeDefined();

      const payload3 = { result: null };
      apiEmitter.emit("get.filtered.rows", payload3);
      expect(payload3.result).toBeDefined();

      // Test remote pagination emitter
      const e = { result: undefined };
      paginationEmitter.emit("isRemotePagination", e);
      expect(e.result).toBe(false);

      paginationEmitter.emit("paginationChange", 2, 10);

      // Test ref getters
      expect(ref.current.table).toBeDefined();
      expect(ref.current.selectionContext).toBeDefined();
      expect(ref.current.paginationContext).toBeDefined();
      expect(ref.current.cellEditContext).toBeDefined();
      expect(ref.current.rowExpandContext).toBeNull();
      expect(ref.current.sortContext).toBeNull();
      expect(ref.current.searchContext).toBeNull();
      expect(ref.current.filterContext).toBeNull();
    });
  });
});

