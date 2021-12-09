require("dotenv").config();
const { Schema, connect, model } = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const delay = (second) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });

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

const provincesToMongo = async () => {
  const provinces = JSON.parse(
    await fs.readFile(path.resolve("data-refactored/list.json"), "utf-8")
  );
  provinces.forEach(async (province) => {
    await delay();
    const newProvince = new Province(province);
    await newProvince.save();
  });
};

const main = async () => {
  // const provinces = await Province.find();
  // const oneProvince = provinces[0];
  // oneProvince.cities.forEach(async (city) => {
  //   const time = JSON.parse(
  //     await fs.readFile(
  //       path.resolve(
  //         `data-refactored/${oneProvince.slug}/${city.slug}/2021.json`
  //       )
  //     )
  //   );
  //   const prayerTime = new PrayerTime({ city: city._id, times: time.time });
  //   await delay(2);
  //   await prayerTime.save();
  // })

  const provinces = await Province.find();
  // provinces.forEach(async (province) => {
  for (let i = 0; i < provinces.length; i++) {
    // provinces[i].cities.forEach(async (city) => {
    const province = provinces[i];
    for (let j = 0; j < province.cities.length; j++) {
      const city = province.cities[j];

      const times = [];
      for (let year = 2021; year <= 2030; year++) {
        const time = JSON.parse(
          await fs.readFile(
            path.resolve(
              `data-refactored/${province.slug}/${city.slug}/${year}.json`
            ),
            "utf-8"
          )
        );
        times.push(time.time);
      }

      const prayerTime = new PrayerTime({
        city: city._id,
        times: times.flat(),
      });
      await prayerTime.save();
      console.log(`DONE! ${province.name} ${city.name}`);
    }
  }

  console.log("Everything is DONE!");
};

// const prayerTimesTestSchema = new Schema({
//   city: Types.ObjectId(),
//   times: [
//     {
//       date: Date,
//       prayer: {
//         imsak: String,
//         subuh: String,
//         terbit: String,
//         dhuha: String,
//         dzuhur: String,
//         ashar: String,
//         maghrib: String,
//         isya: String,
//       },
//     },
//   ],
// });

// const provinceTestSchema = new Schema({
//   _id: Types.ObjectId(),
//   name: String,
//   slug: String,
//   cities: [
//     {
//       _id: Types.ObjectId(),
//       name: String,
//       slug: String,
//     },
//   ],
// });

// const ProvinceTest = model("ProvinceTest", provinceTestSchema);
// const PrayerTimeTest = model("PrayerTimeTest", prayerTimesTestSchema);

// const provinceTestToMongo = async () => {
//   const provinces = JSON.parse(
//     await fs.readFile(path.resolve("data-refactored/list.json"), "utf-8")
//   );
//   const oneProvince = provinces[0];
//   oneProvince.cities.forEach(async (city) => {
//     let times = [];
//     for (let year = 2021; year <= 2030; year++) {
//       const dataRefactored = JSON.parse(
//         await fs.readFile(
//           path.resolve(
//             `data-refactored/${oneProvince.slug}/${city.slug}/${year}.json`
//           ),
//           "utf-8"
//         )
//       );
//       times.push(dataRefactored.time);
//     }
//     return { ...city, times: times.flat() };
//   });
//   const cities = await Promise.all(citiesPromises);
//   const ProvResult = new ProvinceTest({ ...oneProvince, cities });
//   await ProvResult.save();
// };

connect(process.env.MONGO_URL_CONNECTION)
  .then(() => {
    console.log("mongodb connected");
    // return provinceTestToMongo();
    // return provincesToMongo();
    return main();
  })
  .catch((err) => {
    console.log("mongodb connection fail");
    console.log(err);
  });
