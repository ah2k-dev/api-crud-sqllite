const http = require("http");
const app = require("./app");
const port = process.env.PORT || 5000;
const fs = require("fs");
const path = require("path");
const sqllite = require("sqlite3").verbose();

var server = http.createServer(app);

const func = async () => {
};
server.listen(port, () => {
  func();
  console.log(`Server running on port ${port}`);
});
