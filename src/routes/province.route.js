const express = require("express");
const provinceController = require("../controllers/province.controller");

const router = express.Router();

router.get("/", provinceController.getProvinces);
router.get("/:provinceId", provinceController.getProvince);
router.get("/:provinceId/city", provinceController.getCities);
router.get("/:provinceId/city/:cityId", provinceController.getCity);

module.exports = router;
