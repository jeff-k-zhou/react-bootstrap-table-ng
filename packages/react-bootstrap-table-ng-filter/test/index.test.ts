import filterFactory, {
  textFilter,
  selectFilter,
  multiSelectFilter,
  numberFilter,
  dateFilter,
  customFilter,
  ComparatorNumber,
  FILTER_TYPES,
  EQ,
  LIKE,
} from "../index";
import TextFilter from "../src/components/text";
import SelectFilter from "../src/components/select";
import MultiSelectFilter from "../src/components/multiselect";
import NumberFilter from "../src/components/number";
import DateFilter from "../src/components/date";
import createContext from "../src/context";

describe("react-bootstrap-table-ng-filter index exports", () => {
  it("should have correct ComparatorNumber and constants", () => {
    expect(ComparatorNumber).toBe(7);
    expect(FILTER_TYPES).toBeDefined();
    expect(EQ).toBe("=");
    expect(LIKE).toBe("LIKE");
  });

  it("textFilter returns filter descriptor", () => {
    const res = textFilter({ placeholder: "test" });
    expect(res.Filter).toBe(TextFilter);
    expect(res.props.placeholder).toBe("test");
  });

  it("selectFilter returns filter descriptor", () => {
    const res = selectFilter({ options: [{ value: "1", label: "One" }] });
    expect(res.Filter).toBe(SelectFilter);
    expect(res.props.options).toHaveLength(1);
  });

  it("multiSelectFilter returns filter descriptor", () => {
    const res = multiSelectFilter({ comparator: EQ });
    expect(res.Filter).toBe(MultiSelectFilter);
    expect(res.props.comparator).toBe(EQ);
  });

  it("numberFilter returns filter descriptor", () => {
    const res = numberFilter({ defaultValue: { number: 10, comparator: EQ } });
    expect(res.Filter).toBe(NumberFilter);
    expect(res.props.defaultValue?.number).toBe(10);
  });

  it("dateFilter returns filter descriptor", () => {
    const res = dateFilter({ placeholder: "Select date" });
    expect(res.Filter).toBe(DateFilter);
    expect(res.props.placeholder).toBe("Select date");
  });

  it("customFilter returns filter descriptor", () => {
    const res = customFilter({ type: FILTER_TYPES.TEXT });
    expect(typeof res.Filter).toBe("function");
    expect(res.props.type).toBe(FILTER_TYPES.TEXT);
  });

  it("default export creates context factory with options", () => {
    const factory = filterFactory({ afterFilter: jest.fn() });
    expect(factory.createContext).toBe(createContext);
    expect(factory.options).toBeDefined();
    expect(factory.options.afterFilter).toBeDefined();

    const defaultFactory = filterFactory();
    expect(defaultFactory.options).toEqual({});
  });

  it("handles empty/default arguments for all filter functions", () => {
    expect(textFilter().props).toEqual({});
    expect(selectFilter().props).toEqual({});
    expect(multiSelectFilter().props).toEqual({});
    expect(numberFilter().props).toEqual({});
    expect(dateFilter().props).toEqual({});
    const custom = customFilter();
    expect(custom.props).toEqual({});
    // Call the empty Filter function
    expect(custom.Filter()).toBeUndefined();
  });
});
