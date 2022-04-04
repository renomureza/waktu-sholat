const locationService = require("../services/location.service");
const catchAsync = require("../utils/catchAsync");

const getNearestLocation = catchAsync(async (req, res) => {
  const location = await locationService.getNearestLocation(
    req.query.latitude,
    req.query.longitude
  );
  return res.send(location);
});

module.exports = { getNearestLocation };
