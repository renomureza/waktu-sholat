const fs = require("fs/promises");
const path = require("path");
const { find: findTimeZone } = require("geo-tz");
const { isValidLongitude, isValidLatitude } = require("../utils/utility");
const ApiError = require("../utils/ApiError");
const httpStatusCode = require("../utils/httpStatusCode");
const locationService = require("./location.service");
const prismaClient = require("../utils/prismaClient");

const getPrayerByLocation = async (provinceSlug, citySlug) => {
  const city = await locationService.getCity(provinceSlug, citySlug);

  if (!city) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "City not found");
  }

  const timeZone = findTimeZone(
    city.coordinate.latitude,
    city.coordinate.longitude
  )[0];
  const date = new Date(new Date().toLocaleString("en", { timeZone }));

  // const pathToFile = path.resolve(
  //   "src/data/refactored",
  //   provinceSlug,
  //   citySlug,
  //   `${date.getFullYear()}.json`
  // );

  // const { times, ...province } = JSON.parse(await fs.readFile(pathToFile));

  const times = await prismaClient.prayer.findMany({
    where: {
      cityId: city.id,
      AND,
    },
  });

  const prayerTimesByMonthAndYear = times.filter((time) => {
    const prayerTime = new Date(time.date);
    return prayerTime.getMonth() === date.getMonth();
  });

  return {
    ...province,
    times: prayerTimesByMonthAndYear,
  };
};

const getPrayer = async ({
  latitude,
  longitude,
  city: citySlug = "kota-jakarta",
  province: provinceSlug = "dki-jakarta",
}) => {
  if (isNaN(Number(latitude)) && isNaN(Number(longitude))) {
    return getPrayerByLocation(provinceSlug, citySlug);
  }

  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    throw new ApiError(
      httpStatusCode.BAD_REQUEST,
      "Latitude must be >= -90 and <= 90 and longitude must be >= -180 and <= 180"
    );
  }

  const nearestLocation = await locationService.findNearestLocation(
    latitude,
    longitude
  );

  return getPrayerByLocation(nearestLocation.province, nearestLocation.city);
};

module.exports = { getPrayer };
