require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const { model, Schema, connect } = require("mongoose");

const app = express();
app.use(cors());
app.disable("x-powered-by");

const provinceSchema = new Schema({
  name: String,
  slug: String,
  cities: [{ name: String, slug: String }],
});

const Province = model("Province", provinceSchema);

const prayerTimeSchema = new Schema({
  city: Schema.Types.ObjectId,
  times: [
    {
      date: Date,
      prayer: {
        imsak: String,
        subuh: String,
        terbit: String,
        dhuha: String,
        dzuhur: String,
        ashar: String,
        maghrib: String,
        isya: String,
      },
    },
  ],
});

const PrayerTime = model("PrayerTime", prayerTimeSchema);

app.get("/waktu-sholat", async (req, res) => {
  try {
    const { province, city } = req.query;
    const provinces = await Province.findOne({
      slug: province,
    });
    const cityTarget = provinces.cities.find((c) => c.slug === city);
    const prayerTimes = await PrayerTime.findOne({
      city: cityTarget._id,
    });

    const prayerTime = prayerTimes.times.filter(
      (time) =>
        new Date(time.date).getFullYear() === new Date().getFullYear() &&
        new Date(time.date).getMonth() === new Date().getMonth()
    );
    return res.json(prayerTime);
  } catch (error) {
    console.log(error);
    if (error?.code === "ENOENT") {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.all("*", (req, res) => res.status(404).send({ message: "not found" }));

app.listen(config.PORT, () => {
  console.log(`server is running on port ${config.PORT}`);
  connect(process.env.MONGO_URL_CONNECTION)
    .then((res) => {
      console.log("mongodb connected");
    })
    .catch(() => {
      console.log("mongodb failed");
    });
});
