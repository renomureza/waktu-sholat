const prayerService = require("../services/prayer.service");
const catchAsync = require("../utils/catchAsync");

const getPrayer = catchAsync(async (req, res) => {
  const prayer = await prayerService.getPrayer(req.query);
  return res.send(prayer);
});

module.exports = { getPrayer };
