import React, { useEffect } from "react";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDatabaseList } from "../redux/actions/databaseActions";

const Sidebar = () => {
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
  return (
    <div className="sidebar-cont">
      <div className="sidebar">
        <span className="logo">API CRUD SQLITE</span>
      </div>
      <div className="menu">
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
