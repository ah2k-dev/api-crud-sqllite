const router = require("express").Router();
const database = require("../controllers/database");

router.route("/list").get(database.getDatabaseList);
router.route("/create").post(database.createDatabase);
router.route("/upload").post(database.uploadDatabase);

module.exports = router;
