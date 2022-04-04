const { countDistance } = require("../utils/geolocation");
const prismaClient = require("../utils/prismaClient");
const { omit } = require("../utils/utility");

const getNearestLocation = async (
  latitude = -6.170088888888889,
  longitude = 106.83105
) => {
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
        province: omit(province, "cities"),
        city,
      });
    }
  }

  const { distance, ...nearestLocation } = locations.sort(
    (a, b) => a.distance - b.distance
  )[0];

  return nearestLocation;
};

module.exports = { getNearestLocation };
