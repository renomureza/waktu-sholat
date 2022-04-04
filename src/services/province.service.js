const ApiError = require("../utils/ApiError");
const { countDistance } = require("../utils/geolocation");
const httpStatusCode = require("../utils/httpStatusCode");
const prismaClient = require("../utils/prismaClient");

const getProvinces = () =>
  prismaClient.province.findMany({
    include: {
      cities: true,
    },
  });

const getProvince = (provinceId) => {
  return prismaClient.province.findUnique({
    where: {
      id: provinceId,
    },
    include: {
      cities: true,
    },
  });
};

const getCities = async (provinceId) => {
  return prismaClient.city.findMany({
    where: {
      provinceId,
    },
  });
};

const getCity = async (provinceId, cityId) => {
  const province = await getProvince(provinceId);

  if (!province) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "Province not found");
  }

  return prismaClient.city.findUnique({
    where: {
      id: cityId,
    },
  });
};

const findNearestLocation = async (latitude, longitude) => {
  const provinces = await prismaClient.province.findMany({
    include: {
      cities: true,
    },
  });

  const locations = [];

  for (const province of provinces) {
    for (const city of province.cities) {
      const distance = countDistance(
        latitude,
        longitude,
        city.coordinate.latitude,
        city.coordinate.longitude
      );
      locations.push({
        distance,
        province: { id: province.id, slug: province.slug },
        city: { id: city.id, slug: city.slug },
      });
    }
  }

  const { distance, ...nearestLocation } = locations.sort(
    (a, b) => a.distance - b.distance
  )[0];

  return nearestLocation;
};

module.exports = {
  getProvinces,
  getCity,
  getProvince,
  findNearestLocation,
  getCities,
};
