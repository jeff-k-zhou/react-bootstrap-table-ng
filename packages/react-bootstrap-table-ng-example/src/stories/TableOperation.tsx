import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { DeleteRowButton, InsertRowButton, InsertModalToggle } from 'react-bootstrap-table-ng-toolkit';
import cellEditFactory from 'react-bootstrap-table-ng-editor';
import Code from "../components/common/code-block";

const TableOperation = ({ products, columns, mode, enableCellEdit, sourceCode }: any) => {
  const [data, setData] = useState(products);

  const handleInsertRow = (newRow: any) => {
    // Generate a quick random ID if not provided
    const newId = newRow.id || Math.floor(Math.random() * 10000);
    setData([...data, { ...newRow, id: newId }]);
  };

  const handleDeleteRow = (rowKeys: any[]) => {
    setData(data.filter((row: any) => !rowKeys.includes(row.id)));
  };

  return (
    <div>
    <ToolkitProvider
      keyField="id"
      data={data}
      columns={columns}
      insertRow={handleInsertRow}
      deleteRow={handleDeleteRow}
    >
      {(props: any) => (
        <div>
          <div className="btn-group mb-3 gap-2">
            {mode === 'inline' && (
              <InsertRowButton {...props.opProps} initRow={{ name: 'New Product', price: 0 }} />
            )}
            {mode === 'empty-inline' && (
              <InsertRowButton {...props.opProps} />
            )}
            {mode === 'modal' && (
              <InsertModalToggle {...props.opProps} columns={props.columnToggleProps.columns} />
            )}
            {mode === 'delete' && (
              <DeleteRowButton {...props.opProps} />
            )}
          </div>
          <BootstrapTable
            {...props.baseProps}
            selectRow={mode === 'delete' ? { mode: 'checkbox' } : undefined}
            cellEdit={enableCellEdit ? cellEditFactory({ mode: 'click' }) : undefined}
          />
        </div>
      )}
    </ToolkitProvider>
    <Code>{sourceCode}</Code>
    </div>
  );
};

export default TableOperation;
