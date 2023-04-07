import React, { useEffect, useState } from "react";
import { Button, Col, Input, Menu, Row, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatabaseList } from "../redux/actions/databaseActions";
import { createDatabase } from "../redux/actions/databaseActions";
import { ImDatabase, ImTable } from "react-icons/im";
import swal from "sweetalert";

const Sidebar = () => {
  const [newdb, setNew] = useState(false);
  const [dbname, setDbName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { SubMenu } = Menu;
  const { databases } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchDatabaseList());
  }, []);
  const handleDbClick = (database) => {
    console.log(database);
  };
  const handleTableClick = (database, table) => {
    console.log(database, table);
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
  };
  return (
    <div className="sidebar-cont">
      <div className="sidebar-top">
        <span className="logo">API CRUD SQLITE</span>
      </div>
      <div className="menu">
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
            <span>Create new database</span>
            <Row justify="end" align="middle">
              <Col span={24}>
                <Input
                  placeholder="Enter database name"
                  onChange={handleDbName}
                  value={dbname}
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
        <Menu
          mode="inline"
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
        >
          {databases.map((database, index) => {
            console.log(database, index);
            return (
              <SubMenu
                key={index}
                title={database.name + database.extension}
                onTitleClick={() => handleDbClick(database)}
                icon={<ImDatabase />}
              >
                {database.tables.length > 0 ? (
                  database.tables.map((table, ind) => {
                    // console.log(table, ind +  'table');
                    return (
                      <Menu.Item
                        key={ind + 'table' + index}
                        onClick={() => handleTableClick(database, table)}
                        icon={<ImTable />}
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
    </div>
  );
};

export default Sidebar;
