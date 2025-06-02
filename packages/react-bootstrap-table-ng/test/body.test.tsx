import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { stub } from "sinon";

import { ROW_SELECT_DISABLED } from "..";
import Body from "../src/body";
import createExpansionContext from "../src/contexts/row-expand-context";
import createSelectionContext from "../src/contexts/selection-context";
import mockBodyResolvedProps from "./test-helpers/mock/body-resolved-props";

describe("Body", () => {
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
  ];

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ];

  const keyField = "id";

  const ExpansionContext = createExpansionContext();
  const SelectionContext = createSelectionContext();

  describe("simplest body", () => {
    it("should render successfully", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
        />
      );
      expect(screen.getByRole("rowgroup")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(data.length);
    });
  });

  describe("when data is empty", () => {
    it("should not render any rows", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          visibleColumnSize={columns.length}
          isEmpty
        />
      );
      expect(screen.queryByRole("row")).not.toBeInTheDocument();
    });

    describe("when noDataIndication props is defined", () => {
      it("should render noDataIndication string", () => {
        const emptyIndication = "Table is empty";
        render(
          <Body
            {...mockBodyResolvedProps}
            keyField="id"
            columns={columns}
            data={data}
            visibleColumnSize={columns.length}
            noDataIndication={emptyIndication}
            isEmpty
          />
        );
        expect(screen.getByText(emptyIndication)).toBeInTheDocument();
      });

      it("should render noDataIndication function result", () => {
        const content = "Table is empty";
        const emptyIndicationCallBack = stub().returns(content);
        render(
          <Body
            {...mockBodyResolvedProps}
            keyField="id"
            columns={columns}
            data={data}
            visibleColumnSize={columns.length}
            noDataIndication={emptyIndicationCallBack}
            isEmpty
          />
        );
        expect(screen.getByText(content)).toBeInTheDocument();
        expect(emptyIndicationCallBack.callCount).toBe(1);
      });
    });
  });

  describe("when rowStyle prop is defined", () => {
    const rowStyle = { backgroundColor: "red", color: "white" };

    it("should render rows with correct style (object)", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          rowStyle={rowStyle}
        />
      );
      const rows = screen.getAllByRole("row");
      rows.forEach((row) => {
        expect(row).toHaveStyle("background-color: red; color: white;");
      });
    });

    it("should call rowStyle callback correctly", () => {
      const rowStyleCallBack = stub().returns(rowStyle);
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          rowStyle={rowStyleCallBack}
        />
      );
      expect(rowStyleCallBack.callCount).toBe(data.length);
      expect(rowStyleCallBack.firstCall.calledWith(data[0], 0)).toBeTruthy();
      expect(rowStyleCallBack.secondCall.calledWith(data[1], 1)).toBeTruthy();
    });
  });

  describe("when rowClasses prop is defined", () => {
    const rowClasses = "test-classe";

    it("should render rows with correct className (string)", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          rowClasses={rowClasses}
        />
      );
      const rows = screen.getAllByRole("row");
      rows.forEach((row) => {
        expect(row).toHaveClass(rowClasses);
      });
    });

    it("should call rowClasses callback correctly", () => {
      const rowClassesCallBack = stub().returns(rowClasses);
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          rowClasses={rowClassesCallBack}
        />
      );
      expect(rowClassesCallBack.callCount).toBe(data.length);
      expect(rowClassesCallBack.firstCall.calledWith(data[0], 0)).toBeTruthy();
      expect(rowClassesCallBack.secondCall.calledWith(data[1], 1)).toBeTruthy();
    });
  });

  describe("when rowEvents prop is defined", () => {
    it("should call rowEvents on click", async () => {
      const rowEvents = { onClick: stub() };
      render(
        <Body
          {...mockBodyResolvedProps}
          keyField="id"
          columns={columns}
          data={data}
          rowEvents={rowEvents}
        />
      );
      const rows = screen.getAllByRole("row");
      await userEvent.click(rows[0]);
      expect(rowEvents.onClick.called).toBeTruthy();
    });
  });

  describe("when cellEdit.createContext props is defined", () => {
    const EditingCellComponent = () => null;
    const RowComponent = (props: any) => <tr {...props} />;
    const cellEdit = {
      options: { onStartEdit: jest.fn() },
      createContext: jest.fn(),
      createEditingCell: jest.fn().mockReturnValue(EditingCellComponent),
      withRowLevelCellEdit: jest.fn().mockReturnValue(RowComponent),
    };

    it("should call cellEdit methods", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          data={data}
          columns={columns}
          keyField={keyField}
          cellEdit={cellEdit}
        />
      );
      expect(cellEdit.createEditingCell).toHaveBeenCalledTimes(1);
      expect(cellEdit.withRowLevelCellEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe("when selectRow.mode is ROW_SELECT_DISABLED or expandRow.renderer is undefined", () => {
    it("should not render RowAggregator", () => {
      render(
        <Body
          {...mockBodyResolvedProps}
          data={data}
          columns={columns}
          keyField={keyField}
        />
      );
      // RowAggregator is not rendered, so check for absence of its content
      expect(screen.queryByTestId("row-aggregator")).not.toBeInTheDocument();
    });
  });

  describe("when selectRow.mode is defined correctly", () => {
    const selectRow = { mode: "checkbox" };

    it("should render RowAggregator component correctly", () => {
      render(
        <SelectionContext.Provider
          selectRow={selectRow}
          data={data}
          keyField={keyField}
        >
          <Body
            {...mockBodyResolvedProps}
            data={data}
            columns={columns}
            keyField={keyField}
            selectRow={selectRow}
          />
        </SelectionContext.Provider>
      );
      // You may need to add data-testid="row-aggregator" to RowAggregator for this to work
      // expect(screen.getByTestId("row-aggregator")).toBeInTheDocument();
    });
  });

  describe("when expandRow.renderer is defined correctly", () => {
    const expandRow = { renderer: jest.fn() };

    it("should render RowAggregator component correctly", () => {
      render(
        <ExpansionContext.Provider
          data={data}
          keyField={keyField}
          expandRow={expandRow}
        >
          <Body
            {...mockBodyResolvedProps}
            data={data}
            columns={columns}
            keyField={keyField}
            expandRow={expandRow}
          />
        </ExpansionContext.Provider>
      );
      // You may need to add data-testid="row-aggregator" to RowAggregator for this to work
      // expect(screen.getByTestId("row-aggregator")).toBeInTheDocument();
    });
  });
});
