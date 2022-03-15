const locationService = require("../services/location.service");
const ApiError = require("../utils/ApiError");
const httpStatusCode = require("../utils/httpStatusCode");

const getProvinces = (req, res) => {
  const provinces = locationService.getProvinces();
  return res.send(provinces);
};

const getProvince = (req, res) => {
  const province = locationService.getProvince(req.params.province);

  if (!province) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "Province not found");
  }

  return res.send(province);
};

const getCity = (req, res) => {
  const city = locationService.getCity(req.params.province, req.params.city);

  if (!city) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "City not found");
  }

  return res.send(city);
};

module.exports = { getProvinces, getProvince, getCity };
