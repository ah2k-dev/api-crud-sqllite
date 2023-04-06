import React from "react";
import { Menu } from "antd";

const Sidebar = () => {
  const { SubMenu } = Menu;
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
          <SubMenu key="sub1" title="Folder 1">
            {/* <SubMenu
              key="sub2"
            
              title="Sub-Folder 1"
            > */}
              <Menu.Item key="1">Item 1</Menu.Item>
              <Menu.Item key="2">Item 2</Menu.Item>
            {/* </SubMenu> */}
            <SubMenu key="sub3" title="Sub-Folder 2">
              <Menu.ItemGroup key="g1" title="Group 1">
                <Menu.Item key="3">Item 3</Menu.Item>
                <Menu.Item key="4">Item 4</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup key="g2" title="Group 2">
                <Menu.Item key="5">Item 5</Menu.Item>
                <Menu.Item key="6">Item 6</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </SubMenu>
          <Menu.Item key="7" >
            Folder 2
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
