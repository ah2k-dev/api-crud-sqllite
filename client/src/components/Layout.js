import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.js";

const Layout = () => {
  return (
    <div style={{
        display: "flex",
    }}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Layout;
