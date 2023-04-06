const express = require("express");
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/database", require("./routes/database"));
app.use("/api/table", require("./routes/table"));
app.use("/api/data", require("./routes/data"));

// initial route
app.get("/", (req, res) => {
  res.send("api-crud-sqllite v1.0.0");
});

module.exports = app;