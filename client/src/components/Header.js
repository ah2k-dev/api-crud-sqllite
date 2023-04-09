import React from "react";
import { useLocation } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const [path, setPath] = React.useState("");
  React.useEffect(() => {
    const path = location.pathname.split("/");
    setPath(path);
  }, [location]);

  return (
    <div className="header">
      <span>{'-> ' + path[2]} {path[3] && ' -> ' + path[3]}</span>
    </div>
  );
};

export default Header;
