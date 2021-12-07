const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const fs = require("fs/promises");
const path = require("path");

const app = express();
app.use(cors());
app.disable("x-powered-by");

app.get("/waktu-sholat", async (req, res) => {
  try {
    const { province, city } = req.query;
    const currentYear = new Date().getFullYear();
    const prayerTime = JSON.parse(
      await fs.readFile(
        path.resolve(`data-refactored/${province}/${city}/${currentYear}.json`),
        "utf-8"
      )
    );
    const prayerTimeCurrentMonth = prayerTime.time.filter((time) => {
      return new Date(time.date).getMonth() === new Date().getMonth();
    });
    return res.json(prayerTimeCurrentMonth);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.all("*", (req, res) => res.status(404).send({ message: "not found" }));

app.listen(config.PORT, () => {
  console.log(`server is running on port ${config.PORT}`);
});
