import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteRowButton from "../src/op/delete-row-button";
import InsertRowButton from "../src/op/insert-row-button";
import InsertModal from "../src/op/insert-modal";
import InsertModalToggle from "../src/op/insert-modal-toggle";

describe("DeleteRowButton", () => {
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the delete button", () => {
    render(<DeleteRowButton onDelete={onDelete} />);
    expect(screen.getByText("Delete Selected Rows")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<DeleteRowButton onDelete={onDelete}>Remove</DeleteRowButton>);
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("opens modal when clicked with no getSelections (defaults to 1 item)", () => {
    render(<DeleteRowButton onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure to delete 1 selected rows/)).toBeInTheDocument();
  });

  it("shows 'No row selected' modal when getSelections returns empty", () => {
    render(<DeleteRowButton onDelete={onDelete} getSelections={() => []} />);
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    expect(screen.getByText("No row selected to delete!")).toBeInTheDocument();
  });

  it("shows selection count when getSelections returns items", () => {
    render(
      <DeleteRowButton onDelete={onDelete} getSelections={() => [1, 2, 3]} />
    );
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    expect(screen.getByText(/Are you sure to delete 3 selected rows/)).toBeInTheDocument();
  });

  it("closes modal when Cancel is clicked", () => {
    render(<DeleteRowButton onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("calls onDelete and closes when Confirm is clicked", () => {
    render(<DeleteRowButton onDelete={onDelete} getSelections={() => [1]} />);
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("closes modal using X button", () => {
    render(<DeleteRowButton onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete Selected Rows"));
    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("applies custom className to button", () => {
    const { container } = render(
      <DeleteRowButton onDelete={onDelete} className="my-delete-btn" />
    );
    expect(container.querySelector(".my-delete-btn")).toBeInTheDocument();
  });
});

describe("InsertRowButton", () => {
  const onInsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders default 'New Row' text", () => {
    render(<InsertRowButton onInsert={onInsert} />);
    expect(screen.getByText("New Row")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<InsertRowButton onInsert={onInsert}>Add</InsertRowButton>);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("calls onInsert with empty row when no initRow", () => {
    render(<InsertRowButton onInsert={onInsert} />);
    fireEvent.click(screen.getByText("New Row"));
    expect(onInsert).toHaveBeenCalledWith({});
  });

  it("calls onInsert with spread of initRow when object", () => {
    const initRow = { id: 0, name: "" };
    render(<InsertRowButton onInsert={onInsert} initRow={initRow} />);
    fireEvent.click(screen.getByText("New Row"));
    expect(onInsert).toHaveBeenCalledWith({ id: 0, name: "" });
  });

  it("calls onInsert with result of initRow function", () => {
    const initRowFn = jest.fn().mockReturnValue({ id: 99 });
    render(<InsertRowButton onInsert={onInsert} initRow={initRowFn} />);
    fireEvent.click(screen.getByText("New Row"));
    expect(initRowFn).toHaveBeenCalled();
    expect(onInsert).toHaveBeenCalledWith({ id: 99 });
  });

  it("applies custom className", () => {
    const { container } = render(
      <InsertRowButton onInsert={onInsert} className="my-add-btn" />
    );
    expect(container.querySelector(".my-add-btn")).toBeInTheDocument();
  });
});

describe("InsertModal", () => {
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
    { dataField: "dummy", text: "Dummy", isDummyField: true },
  ];
  const onInsert = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders default header", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    expect(screen.getByText("Add Record")).toBeInTheDocument();
  });

  it("renders custom headerText", () => {
    render(
      <InsertModal
        columns={columns}
        onInsert={onInsert}
        onClose={onClose}
        headerText="Custom Header"
      />
    );
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("skips dummy fields", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    expect(screen.queryByLabelText("Dummy")).not.toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onInsert and onClose when Save is clicked", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    fireEvent.click(screen.getByText("Save"));
    expect(onInsert).toHaveBeenCalledWith({});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("includes field input values in save payload", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "42" } }); // id
    fireEvent.change(inputs[1], { target: { value: "Alice" } }); // name
    fireEvent.click(screen.getByText("Save"));
    expect(onInsert).toHaveBeenCalledWith({ id: "42", name: "Alice" });
  });

  it("closes modal using close X button", () => {
    render(<InsertModal columns={columns} onInsert={onInsert} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("InsertModalToggle", () => {
  const columns = [
    { dataField: "id", text: "ID" },
  ];
  const onInsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders default 'New Record' button", () => {
    render(<InsertModalToggle columns={columns} onInsert={onInsert} />);
    expect(screen.getByText("New Record")).toBeInTheDocument();
  });

  it("opens modal when button is clicked", () => {
    render(<InsertModalToggle columns={columns} onInsert={onInsert} />);
    fireEvent.click(screen.getByText("New Record"));
    expect(screen.getByText("Add Record")).toBeInTheDocument();
  });

  it("closes modal when modal onClose is triggered", () => {
    render(<InsertModalToggle columns={columns} onInsert={onInsert} />);
    fireEvent.click(screen.getByText("New Record"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add Record")).not.toBeInTheDocument();
  });
});
