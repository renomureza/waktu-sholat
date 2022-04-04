const slugify = (x = "") => {
  return x
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const delay = (second = 2) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
};

const capitalizeFirstLetter = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
};

const isValidLatitude = (latitude) => latitude >= -90 && latitude <= 90;
const isValidLongitude = (longitude) => longitude >= -180 && longitude <= 180;

const filterObj = (obj, f) => {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => f(k)));
};
const pick = (obj, keys = []) => filterObj(obj, (k) => keys.includes(k));
const omit = (obj, keys = []) => filterObj(obj, (k) => !keys.includes(k));

module.exports = {
  slugify,
  delay,
  capitalizeFirstLetter,
  isValidLatitude,
  isValidLongitude,
  pick,
  omit,
};
