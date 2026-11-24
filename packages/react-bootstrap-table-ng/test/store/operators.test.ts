import operators from "../../src/store/operators";

describe("store/operators", () => {
  it("is an object exporting all store operations", () => {
    expect(typeof operators).toBe("object");
  });

  it("includes row operations", () => {
    expect(typeof operators.matchRow).toBe("function");
    expect(typeof operators.getRowByRowId).toBe("function");
  });

  it("includes selection operations", () => {
    expect(typeof operators.getSelectionSummary).toBe("function");
    expect(typeof operators.selectableKeys).toBe("function");
    expect(typeof operators.unSelectableKeys).toBe("function");
    expect(typeof operators.getSelectedRows).toBe("function");
  });

  it("includes expand operations", () => {
    expect(typeof operators.isAnyExpands).toBe("function");
    expect(typeof operators.expandableKeys).toBe("function");
    expect(typeof operators.getExpandedRows).toBe("function");
  });

  it("includes sort operations", () => {
    expect(typeof operators.nextOrder).toBe("function");
    expect(typeof operators.sort).toBe("function");
  });

  it("includes type operations", () => {
    expect(typeof operators.typeConvert).toBe("function");
  });

  it("invokes row operations correctly", () => {
    const data = [{ id: 1 }, { id: 2 }];
    expect(operators.getRowByRowId(data, "id", 1)).toEqual({ id: 1 });
    expect(operators.getRowByRowId(data, "id", 99)).toBeUndefined();
  });

  it("invokes selection operations correctly", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const result = operators.getSelectionSummary(data, "id", [1, 2]);
    expect(result.allRowsSelected).toBe(true);
    expect(result.allRowsNotSelected).toBe(false);
  });
});
