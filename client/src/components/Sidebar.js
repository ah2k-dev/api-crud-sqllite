import React, { useEffect, useState } from "react";
import { Button, Col, Input, Menu, Row, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatabaseList } from "../redux/actions/databaseActions";

const Sidebar = () => {
  const [newdb, setNew] = useState(false);
  const [dbname, setDbName] = useState("");
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
  return (
    <div className="sidebar-cont">
      <div className="sidebar-top">
        <span className="logo">API CRUD SQLITE</span>
      </div>
      <div className="menu">
        <Row className="list-heading" align='middle' justify='space-between'> 
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
                />
              </Col>
              <Col span={12} className="btn-2comp">
                <Button type="primary" size="small">
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
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
        >
          {databases.map((database, index) => {
            return (
              <SubMenu
                key={index}
                title={database.name + database.extension}
                onTitleClick={() => handleDbClick(database)}
              >
                {database.tables.length > 0 ? (
                  database.tables.map((table, index) => {
                    return (
                      <Menu.Item
                        key={index}
                        onClick={() => handleTableClick(database, table)}
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
