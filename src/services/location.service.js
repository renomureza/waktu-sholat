const ApiError = require("../utils/ApiError");
const { countDistance } = require("../utils/geolocation");
const httpStatusCode = require("../utils/httpStatusCode");
const prismaClient = require("../utils/prismaClient");

const getProvinces = () => {
  return prismaClient.province.findMany();
};

const getProvince = (provinceSlug) => {
  return prismaClient.province.findUnique({
    where: {
      slug: provinceSlug,
    },
    include: {
      cities: true,
    },
  });
};

const getCity = async (provinceSlug, citySlug) => {
  const province = await getProvince(provinceSlug);

  if (!province) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "Province not found");
  }

  return prismaClient.city.findUnique({
    where: {
      slug: citySlug,
    },
  });
};

const findNearestLocation = async (latitude, longitude) => {
  const provinces = await getProvinces();

  const locations = [];

  for (const province of provinces) {
    for (const city of province.cities) {
      const distance = countDistance(
        latitude,
        longitude,
        city.coordinate.latitude,
        city.coordinate.longitude
      );
      locations.push({ distance, province: province.slug, city: city.slug });
    }
  }

  const { distance, ...nearestLocation } = locations.sort(
    (a, b) => a.distance - b.distance
  )[0];

  return nearestLocation;
};

module.exports = { getProvinces, getCity, getProvince, findNearestLocation };
