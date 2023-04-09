import { Button, Table, Dropdown, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../redux/actions/databaseActions";
import { useParams } from "react-router-dom";

const TableData = () => {
  const [filter, setFilter] = useState({
    search: "",
    column: "",
  });
  const resizeRef = React.useRef();
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
    return () => {
      console.log("Unmounted");
      setFilter({
        search: "",
        column: "",
      });
    };
  }, [database, table, page, limit]);

  useEffect(() => {
    setPage(data.page);
    setLimit(data.limit);
    setTotal(data.total);
    console.log(data, data.total, "data");
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      console.log("Resized");
    };

    resizeRef.current = handleResize;

    return () => {
      window.removeEventListener("resize", resizeRef.current);
    };
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination) {
      console.log(pagination);
      setPage(pagination.current);
      setLimit(pagination.pageSize);
    }
  };

  const handleColumnChange = (value) => {
    setFilter((prevFilter) => ({ ...prevFilter, search: "" }));
    setFilter((prevFilter) => ({ ...prevFilter, column: value }));
  };

  const handleSearchTextChange = (e) => {
    setFilter((prevFilter) => ({ ...prevFilter, search: e.target.value }));
  };

  const handleSaveFilterClick = async () => {
    // Do something with the filter object
    console.log(filter);
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

  const dropdownMenu = (
    <div style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
      <Select
        value={filter.column}
        onChange={handleColumnChange}
        style={{ marginBottom: "1rem", width: "100%" }}
        placeholder="Select Column"
      >
        <Select.Option key={""} value={""}>
          Select Column
        </Select.Option>
        {data.tableCol.map((column) => (
          <Select.Option key={column.title} value={column.title}>
            {column.title}
          </Select.Option>
        ))}
      </Select>
      <Input
        placeholder="Search"
        value={filter.search}
        onChange={handleSearchTextChange}
        style={{ marginBottom: "1rem" }}
        disabled={filter.column == "" ? true : false}
      />
      <Button type="primary" onClick={handleSaveFilterClick}>
        Save
      </Button>
    </div>
  );

  const pagination = {
    current: page || 1,
    pageSize: limit || 10,
    total: total,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: "top",
  };
  return (
    <div className="table-data-cont">
      {console.log(total, page, limit, data, "total")}
      <div className="top">
        <span>Table Data</span>
      </div>
      <div
        style={{
          // marginBottom: "1rem",
          marginLeft: "1.3rem",
        }}
      >
        <Dropdown
          overlay={dropdownMenu}
          getPopupContainer={() => document.body} // Add this line
          trigger={["click"]}
          onOpenChange={(visible) =>
            visible && window.addEventListener("resize", resizeRef.current)
          }
          disabled={
            data.tableData.length == 0 && filter.search.length == 0
              ? true
              : false
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              if (filter.search.length > 0) {
                setFilter({ search: "", column: "" });
                setLoading(true);
                const res = await dispatch(
                  getData({
                    dbName: database,
                    tableName: table,
                    page: page || 1,
                    pageSize: limit || 10,
                    searchTerm: {
                      column: null,
                      search: null,
                    },
                  })
                );
                if (res) {
                  //   setTotal(res.total);
                  setLoading(false);
                }
              }
            }}
          >
            {filter.search.length > 0 ? "Reset Filter" : "Apply Filter"}
          </Button>
        </Dropdown>
      </div>
      <div className="table">
        <Table
          dataSource={data.tableData}
          columns={data.tableCol}
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default TableData;
