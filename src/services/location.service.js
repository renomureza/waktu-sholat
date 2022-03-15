const provinces = require("../data/refactored/list.json");
const ApiError = require("../utils/ApiError");
const { countDistance } = require("../utils/geolocation");
const httpStatusCode = require("../utils/httpStatusCode");

const getProvinces = () => {
  return provinces.map(({ cities, ...province }) => province);
};

const getProvince = (provinceSlug) => {
  return provinces.find((province) => province.slug === provinceSlug);
};

const getCity = (provinceSlug, citySlug) => {
  const province = getProvince(provinceSlug);

  if (!province) {
    throw new ApiError(httpStatusCode.NOT_FOUND, "Province not found");
  }

  return province.cities.find((city) => city.slug === citySlug);
};

const findNearestLocation = (latitude, longitude) => {
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
