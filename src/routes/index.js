const express = require("express");
const locationRoutes = require("./location.route");
const prayerRoutes = require("./prayer.route");
// const prismaClient = require("../utils/prismaClient");

const router = express.Router();

const routers = [
  {
    path: "/",
    routes: (req, res) => {
      return res.send({ message: "ok" });
      // try {
      //   const province = await prismaClient.province.findMany();
      //   return res.json(province);
      // } catch (error) {
      //   return res.send({ message: "error" });
      // }
    },
  },
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
  if (path === "/") {
    router.get(path, routes);
  } else {
    router.use(path, routes);
  }
});

module.exports = router;
