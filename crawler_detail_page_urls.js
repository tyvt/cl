import { load } from "cheerio";
import { CL_DOMAIN, CATEGORIES, DETAIL_PAGE_PREFIX } from "./constant.js";
import { request, DBHelper, TimerHelper } from "./utils.js";
const TOTAL_PAGES = 100;
const DB = new DBHelper();
await DB.initDB();

const getUrl = async (category, page) => {
  const { result, data } = await request(
    `${CL_DOMAIN}/thread0806.php?fid=${category.fid}&page=${page}`
  );
  if (result == "error") return;
  const $ = load(data);
  const domList = $("tr").children(".tal").children("h3").children("a");
  const arr = [];
  for (const iterator of domList) {
    if (iterator.children && iterator.children.length) {
      const name = iterator.children[0].data || "";
      if (iterator.attribs.href.endsWith(".html") && name) {
        arr.push(
          DB.prepareData("t_topic", {
            name: `"${name.replace(/\"/g, "'")}"`,
            fid: category.fid,
            url: `"${iterator.attribs.href
              .replace(`${DETAIL_PAGE_PREFIX}`, "")
              .replace(".html", "")}"`,
            create_time: Date.now(),
            update_time: Date.now(),
          })
        );
      }
    }
  }
  arr.forEach((state) => {
    state?.run();
  });
};

async function start() {
  for await (const category of CATEGORIES) {
    console.log(`Fetch ${category.description} begin.`);
    const timer = new TimerHelper();
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      await getUrl(category, page);
      if (timer.getDuration() / 1000 / 60 / 60 >= 5) {
        DB.setDB();
        return;
      }
    }
    DB.setDB();
    console.log(`Fetch ${category.description} end.`);
  }
}

start();
