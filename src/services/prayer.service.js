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

  const localDate = new Date().toLocaleString("en", { timeZone });
  const date = new Date(localDate);
  const fromDate = new Date(new Date(date.setDate(1)).setHours(0, 0, 0, 0));
  const toDate = new Date(
    new Date(date.setMonth(date.getMonth() + 1)).setHours(0, 0, 0, 0)
  );

  const times = await prismaClient.prayer.findMany({
    orderBy: [
      {
        date: "asc",
      },
    ],
    where: {
      date: {
        gte: fromDate,
        lt: toDate,
      },
      city: {
        slug: citySlug,
      },
    },
  });

  const today = times.find(
    (time) =>
      time.date.getTime() ===
      new Date(new Date(localDate).setHours(0, 0, 0, 0)).getTime()
  );

  return times;
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
