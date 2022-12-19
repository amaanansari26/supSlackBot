const router = require("express").Router();
const report  = require("../controllers/report");

router.post("/", report.sendReport);


module.exports = router;
