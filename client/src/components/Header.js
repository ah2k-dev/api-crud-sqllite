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
        {console.log(path)}
      <span>path</span>
    </div>
  );
};

export default Header;
