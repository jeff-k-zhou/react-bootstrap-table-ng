import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import createSearchContext from "../src/search/context";

describe("SearchContext (createSearchContext)", () => {
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
    { dataField: "age", text: "Age", searchable: false },
  ];

  const data = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  const isRemoteSearch = jest.fn().mockReturnValue(false);
  const handleRemoteSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    isRemoteSearch.mockReturnValue(false);
  });

  // createSearchContext returns a factory function. Call it with (__, isRemoteSearch, handler) to get {Provider, Consumer, options}
  function getContext(searchOpts: any = {}) {
    const factory = createSearchContext(searchOpts);
    return factory({}, isRemoteSearch, handleRemoteSearchChange);
  }

  it("factory returns Provider, Consumer and options", () => {
    const ctx = getContext({ searchFormatted: true });
    expect(ctx).toHaveProperty("Provider");
    expect(ctx).toHaveProperty("Consumer");
    expect(ctx).toHaveProperty("options");
    expect(ctx.options).toEqual({ searchFormatted: true });
  });

  it("renders children and returns all data when searchText is empty", async () => {
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText=""
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:3");
    expect(screen.getByText("count:3")).toBeInTheDocument();
  });

  it("filters data based on searchText", async () => {
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="alice"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:1");
  });

  it("skips non-searchable columns", async () => {
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="30" // age=30 but age column is not searchable
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:0");
  });

  it("calls handleRemoteSearchChange when isRemoteSearch returns true", async () => {
    isRemoteSearch.mockReturnValue(true);
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="test"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await waitFor(() => {
      expect(handleRemoteSearchChange).toHaveBeenCalledWith("test");
    });
  });

  it("returns data unchanged when isRemoteSearch is true", async () => {
    isRemoteSearch.mockReturnValue(true);
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="alice"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:3"); // all data returned for remote search
  });

  it("calls column.filterValue when available during search", async () => {
    const filterValue = jest.fn().mockReturnValue("filtered-alice");
    const colsWithFilterValue = [
      { dataField: "name", text: "Name", filterValue },
    ];
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={colsWithFilterValue}
        searchText="filtered-alice"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await waitFor(() => {
      expect(filterValue).toHaveBeenCalled();
    });
  });

  it("uses onColumnMatch option when provided and returns match", async () => {
    const onColumnMatch = jest.fn().mockReturnValue(true);
    const ctx = getContext({ onColumnMatch });

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="anything"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await waitFor(() => {
      expect(onColumnMatch).toHaveBeenCalled();
    });
    // All rows match because onColumnMatch always returns true
    await screen.findByText("count:3");
  });

  it("uses onColumnMatch returning false for no match", async () => {
    const onColumnMatch = jest.fn().mockReturnValue(false);
    const ctx = getContext({ onColumnMatch });

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="anything"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:0");
  });

  it("calls afterSearch callback when search text changes", async () => {
    const afterSearch = jest.fn();
    const ctx = getContext({ afterSearch });

    const { rerender } = render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText=""
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:3");

    rerender(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="alice"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:1");
    await waitFor(() => {
      expect(afterSearch).toHaveBeenCalled();
    });
  });

  it("exposes getSearched via imperative handle ref", async () => {
    const ctx = getContext({});
    const ref = React.createRef<any>();

    render(
      <ctx.Provider
        ref={ref}
        data={data}
        columns={columns}
        searchText="alice"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("count:1");
    expect(ref.current?.getSearched().length).toBe(1);
  });

  it("renders function children (render props pattern)", async () => {
    const ctx = getContext({});

    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText=""
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        {({ data: d }: any) => <div>fn-count:{d.length}</div>}
      </ctx.Provider>
    );

    await screen.findByText("fn-count:3");
  });

  it("handles searchFormatted with formatter and filterValue fallback", async () => {
    const formattedColumns = [
      {
        dataField: "id",
        text: "ID",
        formatter: (cell: any) => `FORMATTED_${cell}`,
      },
      {
        dataField: "name",
        text: "Name",
        filterValue: (cell: any) => `FILTERED_${cell}`,
      },
    ];

    const ctx = getContext({ searchFormatted: true });
    render(
      <ctx.Provider
        data={data}
        columns={formattedColumns}
        searchText="FORMATTED_1"
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>formatted-count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("formatted-count:1");

    // Test filterValue when searchFormatted is false
    const ctx2 = getContext({ searchFormatted: false });
    render(
      <ctx2.Provider
        data={data}
        columns={formattedColumns}
        searchText="FILTERED_Alice"
        options={ctx2.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx2.Consumer>
          {({ data: d }: any) => <div>filtered-val-count:{d.length}</div>}
        </ctx2.Consumer>
      </ctx2.Provider>
    );

    await screen.findByText("filtered-val-count:1");
  });

  it("handles onColumnMatch custom matcher and dataChangeListener", async () => {
    const onColumnMatch = jest.fn(({ searchText, value }: any) => {
      return String(value).toLowerCase().startsWith(searchText);
    });
    const dataChangeListener = { emit: jest.fn() };

    const ctx = getContext({ onColumnMatch });
    render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText="al"
        options={{ onColumnMatch }}
        dataChangeListener={dataChangeListener}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>match-count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("match-count:1");
    expect(dataChangeListener.emit).toHaveBeenCalledWith("filterChanged", 1);
  });

  it("handles remote search data prop update", async () => {
    isRemoteSearch.mockReturnValue(true);
    const ctx = getContext({});
    const { rerender } = render(
      <ctx.Provider
        data={data}
        columns={columns}
        searchText=""
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>remote-count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("remote-count:3");

    // Update data prop remotely
    const newData = [{ id: 10, name: "Remote 10", age: 40 }];
    rerender(
      <ctx.Provider
        data={newData}
        columns={columns}
        searchText=""
        options={ctx.options}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>remote-count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("remote-count:1");
  });

  it("handles omitted searchText and options default values, and null targetValue in data", async () => {
    const ctx = getContext();
    const dataWithNull = [
      { id: 1, name: null, age: 30 },
      { id: 2, name: undefined, age: 25 },
      { id: 3, name: "David", age: 35 },
    ];

    render(
      <ctx.Provider
        data={dataWithNull}
        columns={columns}
        isRemoteSearch={isRemoteSearch}
        handleRemoteSearchChange={handleRemoteSearchChange}
      >
        <ctx.Consumer>
          {({ data: d }: any) => <div>null-test-count:{d.length}</div>}
        </ctx.Consumer>
      </ctx.Provider>
    );

    await screen.findByText("null-test-count:3");
  });
});


