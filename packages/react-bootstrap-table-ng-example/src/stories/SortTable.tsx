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

interface SortManagementState {
  field: string | null;
  order: string | null;
}

const SortManagement: React.FC = () => {
  const [field, setField] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);

  const handleSort = (newField: string, newOrder: string) => {
    setField(newField);
    setOrder(newOrder);
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
      const [field, setField] = React.useState(null);
      const [order, setOrder] = React.useState(null);

      const handleSort = (newField, newOrder) => {
        setField(newField);
        setOrder(newOrder);
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
    };
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
          dataField: field as any,
          order: order as any,
        }}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface CustomSortValueProps { }

interface CustomSortValueState {
  data: any[];
}

const CustomSortValue: React.FC<CustomSortValueProps> = () => {
  const [data, setData] = useState<any[]>(jobsGenerator1(8));

  const handleClick = () => {
    const newProducts = jobsGenerator1(21);
    setData(newProducts);
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

interface SortTableProps {
  mode?: any;
  header?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  defaultSorted?: any;
  defaultSortDirection?: any;
  sort?: any;
}

export default ({
  mode,
  header,
  data,
  columns,
  sourceCode,
  defaultSorted,
  defaultSortDirection,
  sort,
}: SortTableProps) => {
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
            defaultSorted={defaultSorted}
            defaultSortDirection={defaultSortDirection}
            sort={sort}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
