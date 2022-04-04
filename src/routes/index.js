const express = require("express");
const provinceRoute = require("./province.route");
const prayerRoutes = require("./prayer.route");
const locationRoutes = require("./location.route");
const homeRoutes = require("./home.route");

const router = express.Router();

const routers = [
  {
    path: "/province",
    routes: provinceRoute,
  },
  {
    path: "/prayer",
    routes: prayerRoutes,
  },
  {
    path: "/location",
    routes: locationRoutes,
  },
  {
    path: "/",
    routes: homeRoutes,
  },
];

routers.forEach(({ path, routes }) => {
  router.use(path, routes);
});

module.exports = router;
