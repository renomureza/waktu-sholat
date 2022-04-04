const express = require("express");
const prayerController = require("../controllers/prayer.controller");

const router = express.Router();

router.get("/", prayerController.getPrayer);

module.exports = router;
