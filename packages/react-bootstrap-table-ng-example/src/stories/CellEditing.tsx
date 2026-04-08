/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import { jobsGenerator1, productsGenerator } from "../utils/common";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

const SortManagement: React.FC = () => {
  const [field, setField] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);

  const handleSort = (f: string, o: string) => {
    setField(f);
    setOrder(o);
  };

  const handleSortById = () => {
    setField("id");
    setOrder("desc");
  };

  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      sort: true,
      onSort: handleSort,
    },
    {
      dataField: "name",
      text: "Product Name",
      sort: true,
      onSort: handleSort,
    },
    {
      dataField: "price",
      text: "Product Price",
    },
  ];
  const data = productsGenerator();
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';

  const SortManagement = () => {
    const [field, setField] = useState(null);
    const [order, setOrder] = useState(null);

    const handleSort = (f, o) => {
      setField(f);
      setOrder(o);
    };

    const handleSortById = () => {
      setField('id');
      setOrder('desc');
    };

    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      sort: true,
      onSort: handleSort
    }, {
      dataField: 'name',
      text: 'Product Name',
      sort: true,
      onSort: handleSort
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];
    return (
      <div>
        <button className="btn btn-danger" onClick={ handleSortById }>Sort By ID</button>
        <BootstrapTable
          keyField="id"
          data={ products }
          columns={ columns }
          sort={ {
            dataField: field,
            order: order
          } }
        />
        <Code>{ sourceCode }</Code>
      </div>
    );
  }
  `;

  return (
    <div>
      <button className="btn btn-danger" onClick={handleSortById}>
        Sort By ID
      </button>
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        sort={{
          dataField: field,
          order: order,
        }}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

const CustomSortValue: React.FC = () => {
  const [data, setData] = useState(jobsGenerator1(8));

  const handleClick = () => {
    setData(jobsGenerator1(21));
  };

  const types = [
    "Cloud Service",
    "Message Service",
    "Add Service",
    "Edit Service",
    "Money",
  ];
  const columns: any[] = [
    {
      dataField: "id",
      text: "Job ID",
    },
    {
      dataField: "name",
      text: "Job Name",
    },
    {
      dataField: "owner",
      text: "Job Owner",
    },
    {
      dataField: "type",
      text: "Job Type",
      sort: true,
      formatter: (cell: any, row: any) => types[cell],
      sortValue: (cell: any, row: any) => types[cell],
    },
  ];
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';

  const types = ['Cloud Service', 'Message Service', 'Add Service', 'Edit Service', 'Money'];

  const columns = [{
    dataField: 'id',
    text: 'Job ID'
  }, {
    dataField: 'name',
    text: 'Job Name'
  }, {
    dataField: 'owner',
    text: 'Job Owner'
  }, {
    dataField: 'type',
    text: 'Job Type',
    sort: true,
    formatter: (cell, row) => types[cell],
    sortValue: (cell, row) => types[cell]
  }];

  <BootstrapTable keyField='id' data={ products } columns={ columns } />
  `;

  return (
    <div>
      <button className="btn btn-default" onClick={handleClick}>
        Change Data
      </button>
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface CellEditingProps {
  mode?: any;
  header?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  sort?: any;
  cellEdit?: any;
  selectRow?: any;
}

const CellEditing: React.FC<CellEditingProps> = ({
  mode,
  header,
  data,
  columns,
  sourceCode,
  sort,
  cellEdit,
  selectRow,
}) => {
  switch (mode) {
    case "management":
      return <SortManagement />;
    case "configuration":
      return (
        <div>
          <h3>Reverse Sorting Table</h3>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            sort={sort}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
    case "custom":
      return <CustomSortValue />;
    default:
      return (
        <div>
          {header}
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            cellEdit={cellEdit}
            selectRow={selectRow}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};

export default CellEditing;
