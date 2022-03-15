const express = require("express");
const locationController = require("../controllers/location.controller");

const router = express.Router({ mergeParams: true });

router.get("/", locationController.getProvinces);
router.get("/:province", locationController.getProvince);
router.get("/:province/:city", locationController.getCity);

module.exports = router;
