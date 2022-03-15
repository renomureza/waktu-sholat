const fs = require("fs/promises");
const path = require("path");
const { convertDMSToDD } = require("../utils/geolocation");
const { capitalizeFirstLetter } = require("../utils/utility");

// perbaiki kordinat yang tidak valid untuk beberapa kota
// sumber Google Maps
const coordinateFixed = {
  "kab-yapen-waropen": {
    latitude: -1.7469359,
    longitude: 136.1709012,
  },
  "pulau-tambelan-kab-bintan": {
    latitude: 1.0047486,
    longitude: 107.5564326,
  },
  "pulau-serasan-kab-natuna": {
    latitude: 2.5179058,
    longitude: 109.0512643,
  },
  "pulau-midai-kab-natuna": {
    latitude: 2.9978546,
    longitude: 107.775465,
  },
  "pulau-laut-kab-natuna": {
    latitude: 4.6980666,
    longitude: 107.9460961,
  },
  "pekajang-kab-lingga": {
    latitude: -0.1627686,
    longitude: 104.6354631,
  },
  "kota-singkawang": {
    latitude: 0.8836821,
    longitude: 108.8923556,
  },
  "kab-mempawah": {
    latitude: 0.359058,
    longitude: 108.963903,
  },
};

const pathToData = path.resolve("src/data");
const pathToDataOriginal = path.resolve(pathToData, "original");
const pathToDataRefactored = path.resolve(pathToData, "refactored");

const main = async () => {
  const provinces = await fs.readdir(pathToDataOriginal);

  const provincesWithCitiesPromises = provinces.map(async (province) => {
    const cities = await fs.readdir(path.resolve(pathToDataOriginal, province));
    return {
      province,
      cities,
    };
  });

  const provincesWithCities = await Promise.all(provincesWithCitiesPromises);

  const provincesWithCitiesRefactoredPromises = provincesWithCities.map(
    async (province) => {
      const refactoredCitiesPromises = province.cities.map(async (city) => {
        const provInfo = JSON.parse(
          await fs.readFile(
            path.resolve(
              pathToDataOriginal,
              province.province,
              city,
              "2021.json"
            )
          )
        );

        const coordinate = coordinateFixed[city] ?? {
          latitude: convertDMSToDD(provInfo.latitude),
          longitude: convertDMSToDD(provInfo.longtitude),
        };

        return {
          province: capitalizeFirstLetter(provInfo.procince),
          city: capitalizeFirstLetter(provInfo.city),
          slug: city,
          coordinate,
        };
      });

      const cities = await Promise.all(refactoredCitiesPromises);

      return {
        name: cities[0].province,
        slug: province.province,
        cities: cities.map(({ coordinate, slug, city: name }) => ({
          name,
          slug,
          coordinate,
        })),
      };
    }
  );

  const provincesWithCitiesRefactored = await Promise.all(
    provincesWithCitiesRefactoredPromises
  );

  provincesWithCitiesRefactored.forEach(async (province) => {
    province.cities.forEach(async (city) => {
      await fs.mkdir(
        path.resolve(pathToDataRefactored, province.slug, city.slug),
        { recursive: true }
      );

      let times = {};

      for (let i = 2021; i <= 2030; i++) {
        const year = JSON.parse(
          await fs.readFile(
            path.resolve(
              pathToDataOriginal,
              province.slug,
              city.slug,
              `${i}.json`
            )
          )
        );

        times[i] = year.time;
      }

      for (const year in times) {
        let refactorTimes = [];

        for (const month in times[year]) {
          times[year][month].forEach(({ tanggal, ...rest }, i) => {
            refactorTimes.push({
              date: new Date(`${month}/${i + 1}/${year}`).toLocaleDateString(),
              prayer: rest,
            });
          });
        }

        await fs.writeFile(
          path.resolve(
            pathToDataRefactored,
            province.slug,
            city.slug,
            `${year}.json`
          ),
          JSON.stringify({ ...city, times: refactorTimes })
        );
      }
    });
  });

  const list = provincesWithCitiesRefactored.map((province) => {
    const cities = province.cities.map(
      ({ name, slug, coordinate, ...rest }) => ({
        name,
        slug,
        coordinate,
      })
    );
    return {
      ...province,
      cities,
    };
  });

  await fs.writeFile(
    path.resolve(pathToDataRefactored, "list.json"),
    JSON.stringify(list)
  );
};

main();
