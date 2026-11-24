import cellEditFactory, {
  TIME_TO_CLOSE_MESSAGE,
  DELAY_FOR_DBCLICK,
  CLICK_TO_CELL_EDIT,
  DBCLICK_TO_CELL_EDIT,
  EDITTYPE,
  Type,
} from "../index";

describe("react-bootstrap-table-ng-editor index", () => {
  it("exports constants properly", () => {
    expect(TIME_TO_CLOSE_MESSAGE).toBe(3000);
    expect(DELAY_FOR_DBCLICK).toBe(200);
    expect(CLICK_TO_CELL_EDIT).toBe("click");
    expect(DBCLICK_TO_CELL_EDIT).toBe("dbclick");
    expect(EDITTYPE.TEXT).toBe("text");
    expect(Type.TEXT).toBe("text");
  });

  it("calls cellEditFactory with default options", () => {
    const plugin = cellEditFactory();
    expect(plugin.options).toEqual({});
    expect(plugin.DBCLICK_TO_CELL_EDIT).toBe("dbclick");
    expect(plugin.DELAY_FOR_DBCLICK).toBe(200);
    expect(typeof plugin.createContext).toBe("function");
    expect(typeof plugin.createEditingCell).toBe("function");
    expect(typeof plugin.withRowLevelCellEdit).toBe("function");
  });

  it("calls cellEditFactory with custom options", () => {
    const customOpts = { mode: "click" as const, blurToSave: true };
    const plugin = cellEditFactory(customOpts as any);
    expect(plugin.options).toEqual(customOpts);
  });
});
