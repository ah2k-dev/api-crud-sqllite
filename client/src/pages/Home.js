import React from "react";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div>
        <h1>Welcome to API CRUD SQLITE</h1>
        <h3>Select a database from the sidebar to get started!</h3>
      </div>
    </div>
  );
};

export default Home;
