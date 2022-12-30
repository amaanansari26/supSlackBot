const router = require("express").Router();
const reportController  = require("../controllers/report");
const oauthController = require("../controllers/oauth");

const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');


router.post("/", reportController.sendReport);
router.get("/", oauthController.auth);


module.exports = router;
