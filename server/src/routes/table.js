const router = require('express').Router();

const table = require('../controllers/table');

router.route('/list/:database').post(table.getTableList);
router.route('/create/:database').post(table.createTable);
router.route('/add-column').post(table.addColumn);
router.route('/get-attributes/:database/:table').get(table.getAttributes);
router.route('/get-data').post(table.getData);


module.exports = router;