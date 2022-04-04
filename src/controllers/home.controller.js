const package = require("../../package.json");
const { pick } = require("../utils/utility");

const overview = (req, res) => {
  const overviewFromPackage = pick(package, [
    "name",
    "license",
    "homepage",
    "repository",
    "author",
  ]);
  return res.send(overviewFromPackage);
};

module.exports = { overview };
