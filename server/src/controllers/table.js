const fs = require("fs");
const path = require("path");
const sqllite = require("sqlite3").verbose();

const getTableList = async (req, res) => {
  try {
    const { database } = req.params;
    const {search} = req.body;
    const searchQuery = (search && search !== "") ? `AND name LIKE '%${search}%'` : '';
    const db = new sqllite.Database(`./databases/${database}`);
    db.all("SELECT name FROM sqlite_master WHERE type='table'" + searchQuery, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!rows) {
        return res.status(404).json({ message: "No tables found" });
      }
      const tables = rows;
      // res.status(200).json(tables);
      const tablesWithAttributes = tables.map(async (table) => {
        const attributes = await new Promise((resolve, reject) => {
          db.all(`PRAGMA table_info(${table.name})`, (err, attributes) => {
            if (err) {
              reject(err);
            }
            resolve(attributes);
          });
        });

        const length = await new Promise((resolve, reject) => {
          db.all(`SELECT COUNT(*) FROM ${table.name}`, (err, length) => {
            if (err) {
              reject(err);
            }
            resolve(length);
          });
        });

        return { ...table, attributes: attributes.map((val) => val.name), length: length[0]["COUNT(*)"] };
      });
      Promise.all(tablesWithAttributes).then((data) => {
        res.status(200).json(data);
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTable = async (req, res) => {
  try {
    const { database } = req.params;
    const { name } = req.body;
    const db = new sqllite.Database(`./databases/${database}`);
    db.run(`CREATE TABLE ${name} (id integer primary key asc);`, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "Table created successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addColumn = async (req, res) => {
  try {
    const db_name = req.body.db;
    const table = req.body.table;
    const column_name = req.body.column_name;
    const column_type = req.body.column_type;

    if (!column_name || !column_type) {
      throw new Error("Invalid request");
    }

    console.log(
      `Adding ${column_name} (${column_type}) to ${db_name}/${table}`
    );

    const dbpath = `databases/${db_name}`;
    const db = new sqllite.Database(dbpath);

    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM sqlite_master WHERE type='table' AND name='${table}'`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    rows.forEach(async (row) => {
      const create = `${row.sql
        .substring(0, row.sql.length - 1)
        .replace(table, `${table}_tmp`)}, ${column_name} ${column_type});`;
      console.log(`Trying create: ${create}`);
      await new Promise((resolve, reject) => {
        db.run(create, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const rawColumnMetaData = row.sql
        .substring(0, row.sql.length - 1)
        .substring(1 + row.sql.indexOf("("));
      console.log(`Raw column meta data: ${rawColumnMetaData}`);
      const rawColumns = rawColumnMetaData.split(",");
      console.log(`Raw columns: ${rawColumns}`);
      let columns = rawColumns.map((rawColumn) => {
        const column = rawColumn.trim().substring(0, rawColumn.indexOf(" "));
        return column;
      });
      console.log(`Columns: ${columns}`);
      columns = columns.join(" ").replace(/,/g, "");
      console.log(`Columns without commas: ${columns}`);
      const insert = `INSERT INTO ${table}_tmp(${columns}) SELECT ${columns} FROM ${table};`;
      console.log(`Insert: ${insert}`);
      await new Promise((resolve, reject) => {
        db.run(insert, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const drop = `DROP TABLE ${table};`;
      console.log(`Drop: ${drop}`);
      await new Promise((resolve, reject) => {
        db.run(drop, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const rename = `ALTER TABLE ${table}_tmp RENAME TO ${table};`;
      console.log(`Rename: ${rename}`);
      await new Promise((resolve, reject) => {
        db.run(rename, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    // db.close();
    res.status(200).send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

const getAttributes = async (req, res) => {
  try {
    const db_name = req.params.database;
    const table = req.params.table;
    const dbpath = "databases/" + db_name;

    const db = await new Promise((resolve, reject) => {
      const db = new sqllite.Database(dbpath, (err) => {
        if (err) reject(err);
        resolve(db);
      });
    });

    const rows = await new Promise((resolve, reject) => {
      db.all(
        " select * from sqlite_master where type='table' and name='" +
          table +
          "' ",
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    let columnData = [];

    rows.forEach((row) => {
      const sql = row.sql
        .substring(0, row.sql.length - 1)
        .substring(1 + row.sql.indexOf("("));

      // Split the columns into an array
      const columns = sql.split(",");

      // Parse each column to extract the name and data type
      columnData = columns.map((column) => {
        const matches = column.trim().match(/^(\w+)\s+(\w+)/);
        const name = matches[1];
        const type = matches[2];
        return { name, type };
      });
    });

    const message =
      rows.length > 0
        ? "Editing " + db_name + "/" + table
        : "No table found named '" + table + "' in " + db_name;

    res.status(200).send({ message: message, columns: columnData });
    db.close();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getData = async (req, res) => {
  try {
    const { dbName, tableName, page, pageSize, searchArray } = req.body;
    const dbPath = `databases/${dbName}`;
    const db = await new sqllite.Database(dbPath);

    // Get the column names
    const columnsQuery = `PRAGMA table_info(${tableName});`;
    // const columnsResult = await db.all(columnsQuery);
    const columnsResult = await new Promise((resolve, reject) => {
      db.all(columnsQuery, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    const columns = columnsResult.map((column) => column.name);

    console.log("Columns", columns);

    // Calculate pagination offsets
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // Get the table data with pagination and search filter
    const searchTermQueryArray = searchArray.map(term => {
      if (term.column && term.search) {
        return `(${term.column} LIKE '%${term.search}%')`;
      }
      return null;
    }).filter(Boolean);
    
    const searchTermQueryStr = searchTermQueryArray.length > 0
      ? `WHERE ${searchTermQueryArray.join(" AND ")}`
      : "";
    const dataQuery = `SELECT * FROM ${tableName} ${searchTermQueryStr} LIMIT ${limit} OFFSET ${offset};`;
    const dataResult = await new Promise((resolve, reject) => {
      db.all(dataQuery, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    const data = dataResult.map((row) => {
      return columns.map((column) => row[column]);
    });

    console.log("Data", data);

    // Get the total number of rows for pagination
    const countQuery = `SELECT COUNT(*) as count FROM ${tableName} ${searchTermQueryStr};`;
    const countResult = await new Promise((resolve, reject) => {
      db.get(countQuery, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    const totalCount = countResult.count;

    console.log("Total Count", totalCount);
    await db.close();

    res.status(200).send({
      data,
      totalCount,
      columns,
      page,
      pageSize,
      searchArray,
      tableName,
      dbName,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getTableList,
  createTable,
  addColumn,
  getAttributes,
  getData,
};
