const locationService = require("../services/location.service");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const httpStatusCode = require("../utils/httpStatusCode");

const getProvinces = catchAsync(async (req, res) => {
  const provinces = await locationService.getProvinces();
  return res.send(provinces);
});

const getProvince = catchAsync(async (req, res) => {
  const province = await locationService.getProvince(req.params.province);

  if (!province) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "Province not found");
  }

  return res.send(province);
});

const getCity = catchAsync(async (req, res) => {
  const city = await locationService.getCity(
    req.params.province,
    req.params.city
  );

  if (!city) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "City not found");
  }

  return res.send(city);
});

module.exports = { getProvinces, getProvince, getCity };
