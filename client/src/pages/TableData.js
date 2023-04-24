import { Button, Table, Dropdown, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../redux/actions/databaseActions";
import { useParams } from "react-router-dom";

const TableData = () => {
  const [filter, setFilter] = useState([
    {
      column: "",
      search: "",
    },
  ]);
  const resizeRef = React.useRef();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.database);
  const { database, table } = useParams();
  const [page, setPage] = useState(data.page);
  const [limit, setLimit] = useState(data.limit);
  const [total, setTotal] = useState(data.total);
  const [loading, setLoading] = useState(false);
  const [filterLength, setFilterLength] = useState(1);

  const fetch = async () => {
    setLoading(true);
    const res = await dispatch(
      getData({
        dbName: database,
        tableName: table,
        page: page || 1,
        pageSize: limit || 10,
        searchArray: [],
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
      setFilter([
        {
          column: "",
          search: "",
        },
      ]);
    };
  }, [database, table, page, limit]);

  useEffect(() => {
    setPage(data.page);
    setLimit(data.limit);
    setTotal(data.total);
    // setColLength(data.tableCol.length);
    // console.log(data, data.total, "data");
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
      // console.log(pagination);
      setPage(pagination.current);
      setLimit(pagination.pageSize);
    }
  };

  const handleSaveFilterClick = async () => {
    // Do something with the filter object
    console.log(filter);
    const cleanFilter = filter.filter((f) => f.column !== "" || f.search !== "");
    console.log(cleanFilter);
    setLoading(true);
    const res = await dispatch(
      getData({
        dbName: database,
        tableName: table,
        page: page || 1,
        pageSize: limit || 10,
        searchArray: cleanFilter,
      })
    );
    if (res) {
      //   setTotal(res.total);
      setLoading(false);
    }
  };

  const dropdownMenu = (
    <div style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
      {Array(filterLength)
        .fill()
        .map((_, i) => (
          <FilterComp
            key={i}
            setFilter={setFilter}
            data={data}
            filter={filter}
            index={i}
          />
        ))}
      <Button type="primary" onClick={handleSaveFilterClick}>
        Save
      </Button>
      {filterLength < data?.tableCol?.length && (
        <Button
          type="primary"
          onClick={() => {
            setFilterLength(filterLength + 1);
            setFilter([...filter, { column: "", search: ""}])
          }}
        >
          Add another filter
        </Button>
      )}
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
      {/* {console.log(total, page, limit, data, "total")} */}
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
            data.tableData.length == 0 && filter.length == 0
              ? true
              : false
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              if (filter[0].column != "" && filter[0].search != "") {
                setFilter([{ search: "", column: "" }]);
                setFilterLength(1);
                setLoading(true);
                const res = await dispatch(
                  getData({
                    dbName: database,
                    tableName: table,
                    page: page || 1,
                    pageSize: limit || 10,
                    searchArray : [],
                  })
                );
                if (res) {
                  //   setTotal(res.total);
                  setLoading(false);
                }
              }
            }}
          >
            {filter[0].column == "" && filter[0].search == "" ? (
              <span>Filter</span>
            ) : (
              <span>Clear Filter</span>
            )}
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
          scroll={{ x: "max-content", y: "calc(100vh - 200px)" }}
          style={{ position: "sticky", top: "0" }}
        />
      </div>
    </div>
  );
};

const FilterComp = ({ setFilter, data, filter, index }) => {
  const handleColumnChange = (value) => {
    setFilter(
      filter.map((item, i) => {
        if (i == index) {
          return {
            column: value,
            search: item.search,
          };
        } else {
          return item;
        }
      })
    )
  };

  const handleSearchTextChange = (e) => {
    setFilter(
      filter.map((item, i) => {
        if (i == index) {
          return {
            column: item.column,
            search: e.target.value,
          };
        } else {
          return item;
        }
      })
    )
  };
  return (
    <div>
      {console.log(filter, "filter")}
      <Select
        value={filter[index]?.column}
        onChange={handleColumnChange}
        style={{ marginBottom: "1rem", width: "100%" }}
        placeholder="Select Column"
      >
        <Select.Option key={""} value={""}>
          Select Column
        </Select.Option>
        {data.tableCol.map((column) => (
          <Select.Option key={column.title} value={column.title} disabled={filter.some((item) => item.column == column.title)}>
            {column.title}
          </Select.Option>
        ))}
      </Select>
      <Input
        placeholder="Search"
        value={filter[index]?.search}
        onChange={handleSearchTextChange}
        style={{ marginBottom: "1rem" }}
        disabled={ filter[index]?.column.length == 0 ? true : false}  
      />
    </div>
  );
};

export default TableData;
