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

module.exports = {
  getDatabaseList,
  createDatabase,
};
