/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";
import { productsGenerator } from "../utils/common";

interface SelectionManagmentProps { }

interface SelectionManagmentState {
  selected: number[];
}

const SelectionManagment: React.FC<SelectionManagmentProps> = () => {
  const [selected, setSelected] = useState<number[]>([0, 1]);

  const handleBtnClick = () => {
    if (!selected.includes(2)) {
      setSelected([...selected, 2]);
    } else {
      setSelected(selected.filter((x) => x !== 2));
    }
  };

  const handleOnSelect = (row: { id: number }, isSelect: boolean) => {
    if (isSelect) {
      setSelected([...selected, row.id]);
    } else {
      setSelected(selected.filter((x) => x !== row.id));
    }
  };

  const handleOnSelectAll = (isSelect: boolean, rows: { id: number }[]) => {
    const ids = rows.map((r) => r.id);
    if (isSelect) {
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const products = productsGenerator();
  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }, {
    dataField: 'price',
    text: 'Product Price'
  }];
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    selected: selected,
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
  };
  const sourceCode = `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const SelectionManagment = () => {
      const [selected, setSelected] = React.useState([0, 1]);

      const handleBtnClick = () => {
        if (!selected.includes(2)) {
          setSelected([...selected, 2]);
        } else {
          setSelected(selected.filter(x => x !== 2));
        }
      };

      const handleOnSelect = (row, isSelect) => {
        if (isSelect) {
          setSelected([...selected, row.id]);
        } else {
          setSelected(selected.filter(x => x !== row.id));
        }
      };

      const handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.id);
        if (isSelect) {
          setSelected(ids);
        } else {
          setSelected([]);
        }
      };

      const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        selected: selected,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
      };

      return (
        <div>
          <button className="btn btn-success" onClick={ handleBtnClick }>Select/UnSelect 3rd row</button>
          <BootstrapTable keyField="id" data={ products } columns={ columns } selectRow={ selectRow } />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `;

  return (
    <div>
      <button
        className="btn btn-success"
        onClick={handleBtnClick}
      >
        Select/UnSelect 3rd row
      </button>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        selectRow={selectRow as any}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface RowSelectionProps {
  mode?: any;
  header?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  sourceCode1?: any;
  sourceCode2?: any;
  selectRow?: any;
  selectRow1?: any;
  selectRow2?: any;
  expandRow?: any;
  cellEdit?: any;
  noDataIndication?: any;
}

export default ({
  mode,
  header,
  data,
  columns,
  sourceCode,
  sourceCode1,
  sourceCode2,
  selectRow,
  selectRow1,
  selectRow2,
  expandRow,
  cellEdit,
  noDataIndication,
}: RowSelectionProps) => {
  switch (mode) {
    case "management":
      return (
        <div>
          <SelectionManagment />
        </div>
      );
    case "style":
      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            selectRow={selectRow1}
          />
          <Code>{sourceCode1}</Code>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            selectRow={selectRow2}
          />
          <Code>{sourceCode2}</Code>
        </div>
      );
    default:
      return (
        <div>
          {header}
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            selectRow={selectRow}
            expandRow={expandRow}
            cellEdit={cellEdit}
            noDataIndication={noDataIndication}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
