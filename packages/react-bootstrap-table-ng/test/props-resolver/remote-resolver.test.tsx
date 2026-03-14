import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { act } from "react";
import { stub } from "sinon";
import BootstrapTable from "../../src/bootstrap-table";
import withContext from "../../src/contexts";

const Container = withContext(BootstrapTable);

describe("remoteResolver", () => {
  const keyField = "id";
  const columns = [
    { dataField: "id", text: "ID", sort: true },
    { dataField: "name", text: "Name", sort: true },
  ];
  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ];

  const onTableChangeCB = jest.fn();

  beforeEach(() => {
    onTableChangeCB.mockReset();
  });

  function renderContainer(props?: any) {
    let instance: any = null;
    render(
        <Container
          keyField={keyField}
          data={data}
          columns={columns}
        ref={ref => { instance = ref; }}
        {...props}  
        />
      );
    return instance;
  }
          

  describe("sorting", () => {
    it("should call onTableChange when remote is true", () => {
      render(
        <Container
          keyField={keyField}
          data={data}
          columns={columns}
          remote={true}
          onTableChange={onTableChangeCB}
        />
      );
      fireEvent.click(screen.getByText("Name"));
      expect(onTableChangeCB).toHaveBeenCalledWith(
        "sort",
        expect.objectContaining({
          sortField: "name",
          sortOrder: "desc",
        })
      );
    });

    it("should NOT call onTableChange when remote is false", () => {
      render(
        <Container
          keyField={keyField}
          data={data}
          columns={columns}
          remote={false}
          onTableChange={onTableChangeCB}
        />
      );
      fireEvent.click(screen.getByText("Name"));
      expect(onTableChangeCB).not.toHaveBeenCalled();
    });
  });

  describe("isRemotePagination", () => {
    it("should return false when remote is false", () => {
      const instance = renderContainer();
      expect(instance.isRemotePagination()).toBeFalsy();
    });

    it("should return true when remote is true", () => {
      const instance = renderContainer({ remote: true });
      expect(instance.isRemotePagination()).toBeTruthy();
    });

    it("should return true when remote.pagination is true", () => {
      const instance = renderContainer({ remote: { pagination: true } });
      expect(instance.isRemotePagination()).toBeTruthy();
    });
  });

  describe("isRemoteFiltering", () => {
    it("should return false when remote is false", () => {
      const instance = renderContainer();
      expect(instance.isRemoteFiltering()).toBeFalsy();
    });

    it("should return true when remote is true", () => {
      const instance = renderContainer({ remote: true });
      expect(instance.isRemoteFiltering()).toBeTruthy();
    });

    it("should return true when remote.filter is true", () => {
      const instance = renderContainer({ remote: { filter: true } });
      expect(instance.isRemoteFiltering()).toBeTruthy();
    });

    it("should return true when isRemotePagination returns true", () => {
      const instance = renderContainer({ remote: { pagination: true } });
      expect(instance.isRemoteFiltering()).toBeTruthy();
    });
  });

  describe("isRemoteSort", () => {
    it("should return false when remote is false", () => {
      const instance = renderContainer();
      expect(instance.isRemoteSort()).toBeFalsy();
    });

    it("should return true when remote is true", () => {
      const instance = renderContainer({ remote: true });
      expect(instance.isRemoteSort()).toBeTruthy();
    });

    it("should return true when remote.sort is true", () => {
      const instance = renderContainer({ remote: { sort: true } });
      expect(instance.isRemoteSort()).toBeTruthy();
    });

    it("should return true when isRemotePagination returns true", () => {
      const instance = renderContainer({ remote: { pagination: true } });
      expect(instance.isRemoteSort()).toBeTruthy();
    });
  });

  describe("isRemoteCellEdit", () => {
    it("should return false when remote is false", () => {
      const instance = renderContainer();
      expect(instance.isRemoteCellEdit()).toBeFalsy();
    });

    it("should return true when remote is true", () => {
      const instance = renderContainer({ remote: true });
      expect(instance.isRemoteCellEdit()).toBeTruthy();
    });

    it("should return true when remote.cellEdit is true", () => {
      const instance = renderContainer({ remote: { cellEdit: true } });
      expect(instance.isRemoteCellEdit()).toBeTruthy();
    });
  });

  describe("isRemoteSearch", () => {
    it("should return false when remote is false", () => {
      const instance = renderContainer();
      expect(instance.isRemoteSearch()).toBeFalsy();
    });

    it("should return true when remote is true", () => {
      const instance = renderContainer({ remote: true });
      expect(instance.isRemoteSearch()).toBeTruthy();
    });

    it("should return true when remote.search is true", () => {
      const instance = renderContainer({ remote: { search: true } });
      expect(instance.isRemoteSearch()).toBeTruthy();
    });

    it("should return true when isRemotePagination returns true", () => {
      const instance = renderContainer({ remote: { pagination: true } });
      expect(instance.isRemoteSearch()).toBeTruthy();
    });
  });

  describe("handleRemoteCellChange", () => {
    const onTableChangeCB = stub();
    const rowId = 1;
    const dataField = "name";
    const newValue = "test";

    beforeEach(() => {
      onTableChangeCB.resetHistory();
    });

    it("should call props.onTableChange correctly", () => {
      const instance = renderContainer({ onTableChange: onTableChangeCB });
      act(() => {
        instance.handleRemoteCellChange(rowId, dataField, newValue);
      });
      const cellEdit = { rowId, dataField, newValue };
      expect(onTableChangeCB.calledOnce).toBeTruthy();
      expect(
        onTableChangeCB.calledWith(
          "cellEdit",
          instance.getNewestState({ cellEdit })
        )
      ).toBeTruthy();
    });
  });

  describe("handleSortChange", () => {
    const onTableChangeCB = stub();
    const newSortFiled = "name";
    const newSortOrder = "asc";

    beforeEach(() => {
      onTableChangeCB.resetHistory();
    });

    it("should call props.onTableChange correctly", () => {
      const instance = renderContainer({ onTableChange: onTableChangeCB });
      act(() => {
        instance.handleRemoteSortChange(newSortFiled, newSortOrder);
      });
      expect(onTableChangeCB.calledOnce).toBeTruthy();
      expect(
        onTableChangeCB.calledWith(
          "sort",
          instance.getNewestState({
            sortField: newSortFiled,
            sortOrder: newSortOrder,
          })
        )
      ).toBeTruthy();
    });
  });

  describe("handleRemotePageChange", () => {
    const onTableChangeCB = stub();
    const newPage = 2;
    const newSizePerPage = 10;

    beforeEach(() => {
      onTableChangeCB.resetHistory();
    });

    it("should call props.onTableChange correctly", () => {
      const instance = renderContainer({ onTableChange: onTableChangeCB });
      act(() => {
        instance.handleRemotePageChange(newPage, newSizePerPage);
      });
      expect(onTableChangeCB.calledOnce).toBeTruthy();
      expect(
        onTableChangeCB.calledWith(
          "pagination",
          instance.getNewestState({
            page: newPage,
            sizePerPage: newSizePerPage,
          })
        )
      ).toBeTruthy();
    });
  });

  describe("handleRemoteSearchChange", () => {
    const onTableChangeCB = stub();
    const searchText = "abc";

    beforeEach(() => {
      onTableChangeCB.resetHistory();
    });

    it("should call props.onTableChange correctly", () => {
      const instance = renderContainer({ onTableChange: onTableChangeCB });
      act(() => {
        instance.handleRemoteSearchChange(searchText);
      });
      expect(onTableChangeCB.calledOnce).toBeTruthy();
      expect(
        onTableChangeCB.calledWith(
          "search",
          instance.getNewestState({
            searchText,
          })
        )
      ).toBeTruthy();
    });
  });

  describe("handleRemoteFilterChange", () => {
    const onTableChangeCB = stub();
    const filters = { price: { filterVal: 20, filterType: "TEXT" } };

    beforeEach(() => {
      onTableChangeCB.resetHistory();
    });

    it("should call props.onTableChange correctly when remote pagination is disabled", () => {
      const instance = renderContainer({ onTableChange: onTableChangeCB });
      act(() => {
        instance.handleRemoteFilterChange(filters);
      });
      expect(onTableChangeCB.calledOnce).toBeTruthy();
      expect(
        onTableChangeCB.calledWith(
          "filter",
          instance.getNewestState({
            filters,
          })
        )
      ).toBeTruthy();
    });

    describe("when remote pagination is enabled", () => {
      const createContext = () => { };

      it("should call onTableChange with page property by pageStartIndex", () => {
        const options = { pageStartIndex: 0 };
        const instance = renderContainer({
          remote: true,
          onTableChange: onTableChangeCB,
          pagination: { options, createContext },
        });
        act(() => {
          instance.handleRemoteFilterChange(filters);
        });
        expect(onTableChangeCB.calledOnce).toBeTruthy();
        const newState = instance.getNewestState({ filters });
        newState.page = options.pageStartIndex;
        expect(onTableChangeCB.calledWith("filter", newState)).toBeTruthy();
      });

      it("should call onTableChange with page property by default 1", () => {
        const instance = renderContainer({
          remote: true,
          onTableChange: onTableChangeCB,
          pagination: { createContext },
        });
        act(() => {
          instance.handleRemoteFilterChange(filters);
        });
        expect(onTableChangeCB.calledOnce).toBeTruthy();
        const newState = instance.getNewestState({ filters });
        newState.page = 1;
        expect(onTableChangeCB.calledWith("filter", newState)).toBeTruthy();
      });
    });
  });

  describe("cell edit", () => {
    it("should call onTableChange when remote cell edit is enabled", () => {
      const cellEdit = { 
        mode: "click",
        blurToSave: true
      };
      render(
        <Container
          keyField={keyField}
          data={data}
          columns={columns}
          remote={{ sort: true }}
          onTableChange={onTableChangeCB}
        />
      );
      fireEvent.click(screen.getByText("ID"));
      expect(onTableChangeCB).toHaveBeenCalled();
    });

    it("should NOT call onTableChange for sorting when remote.sort is false but remote.filter is true", () => {
      render(
        <Container
          keyField={keyField}
          data={data}
          columns={columns}
          remote={{ filter: true }}
          onTableChange={onTableChangeCB}
        />
      );
      fireEvent.click(screen.getByText("ID"));
      expect(onTableChangeCB).not.toHaveBeenCalled();
    });
  });
});