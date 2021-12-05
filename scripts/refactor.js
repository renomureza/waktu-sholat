const fs = require("fs/promises");
const path = require("path");

const capitalizeFirstLetter = (string) => {
  return string
    .toLowerCase()
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
};

const main = async () => {
  const provinces = await fs.readdir(path.resolve("data"));
  const provincesWithCitiesPromises = provinces.map(async (province) => {
    const cities = await fs.readdir(path.resolve(`data/${province}`));
    return {
      province,
      cities,
    };
  });
  const provincesWithCities = await Promise.all(provincesWithCitiesPromises);
  const provincesWithCitiesRefactoredPromises = provincesWithCities.map(
    async (province) => {
      const refactoredPromises = province.cities.map(async (city) => {
        const provInfo = await JSON.parse(
          await fs.readFile(
            path.resolve(`data/${province.province}/${city}/2021.json`)
          )
        );
        return {
          province: capitalizeFirstLetter(provInfo.procince),
          city: capitalizeFirstLetter(provInfo.city),
          latitude: provInfo.latitude,
          longtitude: provInfo.longtitude,
          slug: city,
        };
      });
      const result = await Promise.all(refactoredPromises);
      return {
        name: result[0].province,
        slug: province.province,
        cities: result.map(({ latitude, longtitude, slug, city }) => ({
          name: city,
          slug,
          latitude,
          longtitude,
        })),
      };
    }
  );
  const provincesWithCitiesRefactored = await Promise.all(
    provincesWithCitiesRefactoredPromises
  );

  provincesWithCitiesRefactored.forEach(async (province) => {
    await fs.mkdir(path.resolve(`data-refactored/${province.slug}`));

    province.cities.forEach(async (city) => {
      await fs.mkdir(
        path.resolve(`data-refactored/${province.slug}/${city.slug}`)
      );

      let times = {};
      for (let i = 2021; i <= 2030; i++) {
        const year = JSON.parse(
          await fs.readFile(
            path.resolve(`data/${province.slug}/${city.slug}/${i}.json`)
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
          `data-refactored/${province.slug}/${city.slug}/${year}.json`,
          JSON.stringify({ ...city, time: refactorTimes })
        );
      }
    });
  });

  const list = provincesWithCitiesRefactored.map((province) => {
    const cities = province.cities.map(({ name, slug, ...rest }) => {
      return { name, slug };
    });

    return {
      ...province,
      cities,
    };
  });

  await fs.writeFile(`data-refactored/list.json`, JSON.stringify(list));
};

main();
