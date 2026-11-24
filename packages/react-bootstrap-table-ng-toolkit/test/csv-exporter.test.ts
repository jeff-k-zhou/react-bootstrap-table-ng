import { getMetaInfo, transform, save } from "../src/csv/exporter";
import FileSaver from "file-saver";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

describe("CSV Exporter", () => {
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name", csvType: String },
    { dataField: "age", text: "Age", csvType: Number },
    { dataField: "hidden", text: "Hidden", csvExport: false },
  ];

  describe("getMetaInfo", () => {
    it("returns meta info for exported columns", () => {
      const meta = getMetaInfo(columns);
      expect(meta.length).toBe(3); // hidden is excluded
      expect(meta[0].field).toBe("id");
      expect(meta[1].field).toBe("name");
      expect(meta[2].field).toBe("age");
    });

    it("uses csvText as header when provided", () => {
      const cols = [{ dataField: "id", text: "ID", csvText: "Identifier" }];
      const meta = getMetaInfo(cols);
      expect(meta[0].header).toBe("Identifier");
    });

    it("sets default type to String when not provided", () => {
      const cols = [{ dataField: "id", text: "ID" }];
      const meta = getMetaInfo(cols);
      expect(meta[0].type).toBe(String);
    });

    it("sets row, rowSpan, colSpan defaults", () => {
      const cols = [{ dataField: "id", text: "ID" }];
      const meta = getMetaInfo(cols);
      expect(meta[0].row).toBe(0);
      expect(meta[0].rowSpan).toBe(1);
      expect(meta[0].colSpan).toBe(1);
    });
  });

  describe("transform", () => {
    const _ = { get: (obj: any, key: string) => obj[key], pluck: (arr: any[], key: string) => arr.map(r => r[key]) };

    const data = [
      { id: 1, name: "Alice", age: 30 },
      { id: 2, name: 'Bob "the Great"', age: 25 },
    ];

    const meta = getMetaInfo(columns);

    it("generates CSV content with header", () => {
      const result = transform(data, meta, columns, _, {
        separator: ",",
        ignoreHeader: false,
        ignoreFooter: true,
      });
      expect(result).toContain('"ID"');
      expect(result).toContain('"Name"');
      expect(result).toContain('"Alice"');
    });

    it("generates CSV content without header when ignoreHeader=true", () => {
      const result = transform(data, meta, columns, _, {
        separator: ",",
        ignoreHeader: true,
        ignoreFooter: true,
      });
      expect(result).not.toContain('"ID"');
    });

    it("handles empty data gracefully", () => {
      const result = transform([], meta, columns, _, {
        separator: ",",
        ignoreHeader: false,
        ignoreFooter: true,
      });
      expect(result).toContain('"ID"');
      expect(result.split("\n").length).toBe(2); // header + empty line
    });

    it("applies custom formatter", () => {
      const formattedMeta = [
        {
          field: "name",
          type: String,
          formatter: (val: any) => `[${val}]`,
          header: "Name",
          export: true,
          row: 0, rowSpan: 1, colSpan: 1,
        },
      ];
      const result = transform(data, formattedMeta, columns, _, {
        separator: ",",
        ignoreHeader: true,
        ignoreFooter: true,
      });
      expect(result).toContain('"[Alice]"');
    });

    it("uses custom separator", () => {
      const result = transform(data, meta, columns, _, {
        separator: ";",
        ignoreHeader: false,
        ignoreFooter: true,
      });
      expect(result).toContain(";");
    });

    it("includes footer when ignoreFooter=false and footer exists", () => {
      const metaWithFooter = [
        {
          field: "id",
          type: String,
          header: "ID",
          export: true,
          footer: "Total",
          row: 0, rowSpan: 1, colSpan: 1,
        },
      ];
      const result = transform(data, metaWithFooter, columns, _, {
        separator: ",",
        ignoreHeader: false,
        ignoreFooter: false,
      });
      expect(result).toContain('"Total"');
    });

    it("calls function footer with column data", () => {
      const footerFn = jest.fn().mockReturnValue("Computed");
      const metaWithFnFooter = [
        {
          field: "id",
          type: Number,
          header: "ID",
          export: true,
          footer: footerFn,
          row: 0, rowSpan: 1, colSpan: 1,
        },
      ];
      transform(data, metaWithFnFooter, [{ dataField: "id", text: "ID" }], _, {
        separator: ",",
        ignoreHeader: false,
        ignoreFooter: false,
      });
      expect(footerFn).toHaveBeenCalled();
    });

    it("calls footerFormatter when provided", () => {
      const footerFormatter = jest.fn().mockReturnValue("FormattedFooter");
      const metaWithFooterFormatter = [
        {
          field: "id",
          type: Number,
          header: "ID",
          export: true,
          footerFormatter,
          footer: undefined,
          row: 0, rowSpan: 1, colSpan: 1,
        },
      ];
      const result = transform(data, metaWithFooterFormatter, [{ dataField: "id", text: "ID" }], _, {
        separator: ",",
        ignoreHeader: false,
        ignoreFooter: false,
      });
      expect(footerFormatter).toHaveBeenCalled();
      expect(result).toContain("FormattedFooter");
    });
  });

  describe("save", () => {
    it("calls FileSaver.saveAs with the correct parameters", () => {
      save("csv content", {
        noAutoBOM: false,
        fileName: "export.csv",
        blobType: "text/csv;charset=utf-8",
      });
      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        "export.csv",
        false
      );
    });
  });
});
