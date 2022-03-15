const express = require("express");
const locationRoutes = require("./location.route");
const prayerRoutes = require("./prayer.route");

const router = express.Router();

const routers = [
  {
    path: "/location",
    routes: locationRoutes,
  },
  {
    path: "/prayer",
    routes: prayerRoutes,
  },
];

routers.forEach(({ path, routes }) => {
  router.use(path, routes);
});

module.exports = router;
