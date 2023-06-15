import React, { useEffect, useState } from "react";
import { Button, Col, Input, Menu, Row, Select, Table, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDatabaseList,
  runQuery,
  setGreenTables,
  setRedTables,
  uploadDatabase,
} from "../redux/actions/databaseActions";
import { createDatabase } from "../redux/actions/databaseActions";
import { ImDatabase, ImTable } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Sidebar = () => {
  const [newdb, setNew] = useState(false);
  const [dbname, setDbName] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [queryDB, setQueryDB] = useState(null);
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState();
  const [green, setGreen] = useState([]);
  const [red, setRed] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { SubMenu } = Menu;
  const { databases } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchDatabaseList());
  }, []);
  const handleDbClick = (database) => {
    navigate(`/database/${database.name}${database.extension}`);
  };
  const handleTableClick = (database, table) => {
    // console.log(database, table);
    navigate(`/database/${database.name}${database.extension}/${table}`);
  };
  const handleAddNew = () => {
    setNew(true);
  };
  const handleDbName = (e) => {
    setDbName(e.target.value);
  };
  const handleCancel = () => {
    setNew(false);
  };
  const saveDatabase = async () => {
    if (file) {
      setLoading(true);
      const res = await dispatch(uploadDatabase(file));
      setLoading(false);
      if (res) {
        setNew(false);
        setFile(null);
      }
    } else {
      if (dbname === "") {
        swal("Error", "Please enter database name", "error");
        return;
      }
      setLoading(true);
      const res = await dispatch(
        createDatabase({
          name: dbname,
        })
      );
      setLoading(false);
      if (res) {
        setNew(false);
        setDbName("");
      }
    }
  };
  const run = () => {
    // setLoading(true);
    dispatch(runQuery({ database: queryDB, query }))
      .then((res) => {
        // console.log(typeof res.output, "res");
        if (typeof res.output === "string") {
          setOutput(res.output);
        } else if (typeof res.output === "object") {
          if(query.toLowerCase().startsWith("select count(*) from")){
            let tableName = query.split(" ")[3];
            let count = res.output[0]["count(*)"];
            if(count > 0){
              setGreen([...green, tableName]);
              dispatch(setGreenTables(tableName))
            } else {
              setRed([...red, tableName]);
              dispatch(setRedTables(tableName))
            }
          }
          setOutput(res.output);
        } else {
          setOutput("Something went wrong");
        }
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err, "err");
        // setLoading(false);
      });
  };
  return (
    <div className="sidebar-cont">
      {console.log(green, red)}
      <div className="sidebar-top">
        <span className="logo">API CRUD SQLITE</span>
      </div>
      <div
        className="menu"
        style={{
          height: "40%",
          overflowY: "auto",
        }}
      >
        <Row className="list-heading" align="middle" justify="space-between">
          <Col span={18}>
            <span>Databases List</span>
          </Col>
          {!newdb && (
            <Col span={5}>
              <Button type="primary" size="small" onClick={handleAddNew}>
                + New
              </Button>
            </Col>
          )}
        </Row>
        {newdb && (
          <div className="new-database-comp">
            {/* {console.log(file)} */}
            <span>Create new database</span>

            <Row justify="end" align="middle">
              <Col span={24}>
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </Col>
              <Col span={24}>
                <Input
                  placeholder="Enter database name"
                  onChange={handleDbName}
                  value={dbname}
                  disabled={file ? true : false}
                />
              </Col>
              <Col span={12} className="btn-2comp">
                <Button
                  type="primary"
                  size="small"
                  loading={loading}
                  onClick={saveDatabase}
                >
                  Save
                </Button>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>
        )}
        <Menu mode="inline">
          {databases.map((database, index) => {
            return (
              <SubMenu
                key={index}
                title={database.name + database.extension}
                onTitleClick={() => handleDbClick(database)}
                icon={<ImDatabase />}
              >
                {database.tables.length > 0 ? (
                  database.tables.map((table, ind) => {
                    return (
                      <Menu.Item
                        key={ind + "table" + index}
                        onClick={() => handleTableClick(database, table)}
                        icon={<ImTable />}
                        style={{
                          color: green.includes(table) ? "green" : red.includes(table) ? "red" : "#000",
                          fontWeight: green.includes(table) ? "bold" : red.includes(table) ? "bold" : "normal",
                        }}
                      >
                        {table}
                      </Menu.Item>
                    );
                  })
                ) : (
                  <Menu.Item key={index} disabled={true}>
                    No tables
                  </Menu.Item>
                )}
              </SubMenu>
            );
          })}
        </Menu>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "320px",
          height: "48%",
          // backgroundColor: "#fff",
          borderTop: "1px solid #ccc",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Run Query</h3>
          <Select
            placeholder="Select database"
            style={{
              width: "50%",
            }}
            onChange={(value) => {
              setQueryDB(value);
            }}
            defaultValue={null}
          >
            <Select.Option value={null}>Select database</Select.Option>
            {databases.map((database, index) => {
              // console.log(database);
              return (
                <Select.Option
                  key={index}
                  value={database.name + database.extension}
                >
                  {database.name + database.extension}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
            padding: 10,
          }}
        >
          <Input.TextArea
            rows={5}
            placeholder="Write query"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            disabled={queryDB === null}
          />
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={run}
            loading={loading}
            disabled={queryDB === null || query === ""}
          >
            Run
          </Button>
          <div
            className="output"
            style={{
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              height: "auto",
              minHeight: 100,
              // maxHeight: 150,
              width: "100%",
              // overflow: "auto",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              marginTop: 20,
              padding: 10,
            }}
          >
            {output &&
              (typeof output === "string" ? (
                <span style={{ color: "red" }}>{output}</span>
              ) : (
                <>
                  <Table
                    dataSource={output}
                    columns={Object.keys(output[0]).map((key) => ({
                      title: key,
                      dataIndex: key,
                      width: 200,
                    }))}
                    loading={loading}
                    scroll={{ x: "max-content", y: "calc(100vh - 550px)" }}
                    style={{ position: "sticky", top: "0" }}
                  />
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
