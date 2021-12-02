const querystring = require("querystring");
const fs = require("fs/promises");
const { curly } = require("node-libcurl");
const cheerio = require("cheerio");
const { slugify, delay } = require("./lib/utility");
const path = require("path");

const writeFile = async (to, data) => {
  return fs
    .mkdir(path.dirname(to), { recursive: true })
    .then(() => fs.writeFile(to, data));
};

const requestGet = (url = "") => {
  return curly.get(url, {
    cookieJar: "cookie.txt",
    cookieFile: "cookie.txt",
    followLocation: true,
    sslVerifyPeer: false,
    timeout: 30,
    connectTimeout: 30,
    maxRedirs: 30,
    sslVerifyHost: 2,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
  });
};

const requestPost = (url = "", body) => {
  return curly.post(url, {
    post: true,
    postFields: querystring.stringify(body),
    cookieJar: "cookie.txt",
    cookieFile: "cookie.txt",
    followLocation: true,
    sslVerifyPeer: false,
    timeout: 30,
    connectTimeout: 30,
    maxRedirs: 30,
    sslVerifyHost: 2,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
  });
};

const getPrayTimes = async (provinceKey, cityKey, month, year) => {
  try {
    const res = await requestPost(
      "https://bimasislam.kemenag.go.id/ajax/getShalatbln",
      { x: provinceKey, y: cityKey, bln: month, thn: year }
    );
    const { status, message, ...rest } = JSON.parse(res.data);
    return rest;
  } catch (error) {
    console.log(`ERROR: ${error.message ?? "Something went wrong"}`);
    console.log("TRYING...");
    await delay();
    return await getPrayTimes(provinceKey, cityKey, month, year);
  }
};

const getLocations = async () => {
  const result = await requestGet(
    "https://bimasislam.kemenag.go.id/jadwalshalat"
  );

  const $ = cheerio.load(result.data);

  const [, ...provinces] = $("#search_prov")
    .children()
    .map((i, option) => {
      return {
        key: $(option).attr("value"),
        name: $(option).text(),
        slug: slugify($(option).text()),
      };
    })
    .get();

  const provincesPromises = provinces.map(async (province) => {
    const { data } = await requestPost(
      "https://bimasislam.kemenag.go.id/ajax/getKabkoshalat",
      { x: province.key }
    );

    const cities = $(data)
      .map((i, option) => {
        return {
          key: $(option).attr("value"),
          name: $(option).text(),
          slug: slugify($(option).text()),
        };
      })
      .get();

    return {
      ...province,
      cities,
    };
  });

  return Promise.all(provincesPromises);
};

const main = async () => {
  const locations = await getLocations();
  // because we must sleep after Jawa Barat
  const splicedLocations = locations.slice(12);

  for (const province of splicedLocations) {
    console.log("PROVINSI: ", province.name);
    for (const city of province.cities) {
      console.log("CITY", city.name);
      for (let year = 2021; year <= 2030; year++) {
        const prayTimePerYear = {};
        for (let month = 1; month <= 12; month++) {
          const prayTime = await getPrayTimes(
            province.key,
            city.key,
            month,
            year
          );
          if (month === 1) {
            prayTimePerYear.procince = prayTime.prov;
            prayTimePerYear.city = prayTime.kabko;
            prayTimePerYear.latitude = prayTime.lintang;
            prayTimePerYear.longtitude = prayTime.bujur;
            prayTimePerYear.time = {
              [month]: Object.values(prayTime.data),
            };
          } else {
            prayTimePerYear.time[month] = Object.values(prayTime.data);
          }
        }
        await writeFile(
          `${process.cwd()}/data/${province.slug}/${city.slug}/${year}.json`,
          JSON.stringify(prayTimePerYear)
        );
      }
    }
  }
};

main();
