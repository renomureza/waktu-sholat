const countDistance = (
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude,
  unit = "K"
) => {
  const radlat1 = (Math.PI * fromLatitude) / 180;
  const radlat2 = (Math.PI * toLatitude) / 180;
  const theta = fromLongitude - toLongitude;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;

  if (unit == "K") {
    dist = dist * 1.609344;
  }

  if (unit == "N") {
    dist = dist * 0.8684;
  }

  return dist;
};

const convertDMSToDD = (dms) => {
  const dmsToDD = (degrees, minutes, seconds, direction) => {
    const dd =
      Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    const directionUppercase = direction.toUpperCase();
    if (directionUppercase === "S" || directionUppercase === "W") {
      return dd * -1;
    }
    return dd;
  };

  const parts = dms.split(/[^\d\w\.]+/);
  return dmsToDD(...parts);
};

module.exports = { countDistance, convertDMSToDD };
