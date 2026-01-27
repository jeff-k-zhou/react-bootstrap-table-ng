import { render } from "@testing-library/react";
import React from "react";

import BootstrapTable from "../../src/bootstrap-table";
import createDataContext from "../../src/contexts/data-context";

describe("DataContext", () => {
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

  const DataContext = createDataContext();

  function renderContext(props = {}) {
    return render(
      <DataContext.Provider data={data} {...props}>
        <DataContext.Consumer>
          {(dataProps) => mockBase(dataProps)}
        </DataContext.Consumer>
      </DataContext.Provider>
    );
  }

  beforeEach(() => {
    mockBase.mockClear();
  });

  describe("default render", () => {
    it("should have correct Provider property after calling createDataContext", () => {
      expect(DataContext.Provider).toBeDefined();
    });

    it("should have correct Consumer property after calling createDataContext", () => {
      expect(DataContext.Consumer).toBeDefined();
    });

    it("should provide correct data to children", () => {
      renderContext();
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.data).toEqual(data);
      expect(typeof props.getData).toBe("function");
    });
  });

  describe("getData", () => {
    let getData: any;
    const fakeData = [...data, { id: 3, name: "test" }];

    beforeEach(() => {
      renderContext();
      getData = mockBase.mock.calls[0][0].getData;
    });

    describe("if third argument is given", () => {
      it("should return the data property from third argument", () => {
        const result = getData(null, null, { data: fakeData });
        expect(result).toEqual(fakeData);
      });
    });

    describe("if second argument is given", () => {
      it("should return the data property from second argument", () => {
        const result = getData(null, { data: fakeData });
        expect(result).toEqual(fakeData);
      });
    });

    describe("if first argument is given", () => {
      it("should return the default data", () => {
        const result = getData({ data: fakeData });
        expect(result).toEqual(data);
      });
    });

    describe("if no argument is given", () => {
      it("should return default props.data", () => {
        const result = getData();
        expect(result).toEqual(data);
      });
    });
  });
});
