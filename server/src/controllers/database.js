const path = require("path");
const fs = require("fs");
const sqllite = require("sqlite3").verbose();

const getDatabaseList = async (req, res) => {
  try {
    const files = await fs.promises.readdir("./databases");
    if (!files) {
      return res.status(404).json({ message: "No databases found" });
    }
    const databases = files.map((file) => {
      return {
        name: path.parse(file).name,
        extension: path.parse(file).ext,
      };
    });
    const tables2 = [];
    await Promise.all(
      databases.map(async (database) => {
        const db = new sqllite.Database(
          `./databases/${database.name}${database.extension}`
        );
        const tables = await new Promise((resolve, reject) => {
          db.all(
            "SELECT name FROM sqlite_master WHERE type='table'",
            (err, rows) => {
              if (err) {
                reject(err);
              }
              if (!rows) {
                resolve([]);
              }
              resolve(rows.map((row) => row.name));
            }
          );
        });
        db.close();
        // redTables are tables that do not have any data
        // greenTables are tables that have data
        const redTables = [];
        const greenTables = [];
        await Promise.all(
          tables.map(async (table) => {
            const db = new sqllite.Database(
              `./databases/${database.name}${database.extension}`
            );
            const rows = await new Promise((resolve, reject) => {
              db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                  reject(err);
                }
                if (!rows) {
                  resolve([]);
                }
                resolve(rows);
              });
            });
            db.close();
            if (rows.length === 0) {
              redTables.push(table);
            } else {
              greenTables.push(table);
            }
          })
        );
        database.redTables = redTables;
        database.greenTables = greenTables;
        database.tables = tables;
        console.log(database);
        return database;
      })
    )
      .then((databases) => {
        res.status(200).json(databases);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createDatabase = async (req, res) => {
  try {
    const { name } = req.body;
    const db = new sqllite.Database(`./databases/${name}.db`);
    db.close();
    res.status(200).json({ message: "Database created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadDatabase = async (req, res) => {
  try {
    const { file } = req.files;
    // save uploaded file in databases folder
    const savePath = `./databases/${file.name}`;
    file.mv(savePath, function (err) {
      if (err) {
        // Handle error
        console.error(err);
        res.status(500).send(err);
      } else {
        // File saved successfully
        res.send("File uploaded!");
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const runQuery = async (req, res) => {
  try {
    const { database, query } = req.body;
    const db = new sqllite.Database(`./databases/${database}`);

    db.all(query, (err, rows) => {
      if (err) {
        return res.status(200).json({ output: err.message });
      }
      if (!rows) {
        return res.status(200).json({ output: "No output" });
      }
      res.status(200).json({ output: rows });
    });

    db.close();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDatabaseList,
  createDatabase,
  uploadDatabase,
  runQuery,
};
