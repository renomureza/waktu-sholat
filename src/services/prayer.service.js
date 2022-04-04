const { find: findTimeZone } = require("geo-tz");
const { isValidLongitude, isValidLatitude } = require("../utils/utility");
const ApiError = require("../utils/ApiError");
const httpStatusCode = require("../utils/httpStatusCode");
const locationService = require("./province.service");
const prismaClient = require("../utils/prismaClient");

const getPrayerByLocation = async (provinceId, cityId) => {
  const city = await locationService.getCity(provinceId, cityId);

  if (!city) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "City not found");
  }

  const [clientTextTimeZone] = findTimeZone(
    city.coordinate.latitude,
    city.coordinate.longitude
  );

  const clientDate = new Date().toLocaleString("en", {
    timeZone: clientTextTimeZone,
  });

  const [month, date, year] = clientDate.split(",")[0].split("/");

  const times = await prismaClient.city.findUnique({
    where: {
      id: cityId,
    },
    include: {
      province: true,
      prayers: {
        where: {
          date: {
            startsWith: `${year}-${month}`,
          },
        },
      },
    },
  });

  const sortedDate = times.prayers.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return { ...times, prayers: sortedDate };
};

const getPrayer = async ({
  latitude = "-6.170088888888889",
  longitude = "106.83105",
}) => {
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

  return getPrayerByLocation(
    nearestLocation.province.id,
    nearestLocation.city.id
  );
};

module.exports = { getPrayer };
