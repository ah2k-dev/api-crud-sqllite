import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../redux/actions/databaseActions";
import { useParams } from "react-router-dom";

const TableData = () => {
  const [filter, setFilter] = useState({
    search: "",
    column: "",
  });
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.database);
  const { database, table } = useParams();
  const [page, setPage] = useState(data.page);
  const [limit, setLimit] = useState(data.limit);
  const [total, setTotal] = useState(data.total);
  const [loading, setLoading] = useState(false);
  const fetch = async () => {
    setLoading(true);
    const res = await dispatch(
      getData({
        dbName: database,
        tableName: table,
        page: page || 1,
        pageSize: limit || 10,
        searchTerm: {
          column: filter.column == "" ? null : filter.column,
          search: filter.search == "" ? null : filter.search,
        },
      })
    );
    if (res) {
    //   setTotal(res.total);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, [filter.search, database, table, page, limit]);
  useEffect(() => {
    setPage(data.page);
    setLimit(data.limit);
    setTotal(data.total);
    console.log(data,data.total, "data");
  }, [data]);
  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination) {
      console.log(pagination);
      setPage(pagination.current);
      setLimit(pagination.pageSize);
    }
  };

  const pagination = {
    current: page || 1,
    pageSize: limit || 10,
    total: total,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: 'top'
  };
  return (
    <div className="table-data-cont">
      {console.log(total, page, limit, data, "total")}
      <div className="top">
        <span>Table Data</span>
        <div>
          <Button type="primary">
            {filter.search.length > 0 ? "Reset Filter" : "Apply Filter"}
          </Button>
        </div>
      </div>
      <div className="table">
        <Table
          dataSource={data.tableData}
          columns={data.tableCol}
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default TableData;
