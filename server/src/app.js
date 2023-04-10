const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// routes
app.use("/api/database", require("./routes/database"));
app.use("/api/table", require("./routes/table"));
app.use("/api/data", require("./routes/data"));

// initial route
app.get("/", (req, res) => {
  res.send("api-crud-sqllite v1.0.0");
});

module.exports = app;
