const router = require("express").Router();
const database = require("../controllers/database");

router.route("/list").get(database.getDatabaseList);
router.route("/create").post(database.createDatabase);

module.exports = router;
