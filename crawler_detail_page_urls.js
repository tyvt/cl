import { load } from "cheerio";
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js";
import { request, DBHelper, TimerHelper, sleep } from "./utils.js";
const TOTAL_PAGES = 100;

const getUrl = async (fid, page, DB) => {
  const { result, data } = await request(
    `${CL_DOMAIN}/thread0806.php?fid=${fid}&page=${page}`
  );
  if (result == "error") return false;
  const $ = load(data);
  const domList = $("tr").children(".tal").children("h3").children("a");
  const arr = [];
  for (const iterator of domList) {
    if (iterator.children && iterator.children.length) {
      const name = iterator.children[0].data || "";
      if (iterator.attribs.href.endsWith(".html") && name) {
        // console.log(name);
        arr.push({
          name: `"${name.replace(/\"/g, "'")}"`,
          fid: fid,
          url: `"${iterator.attribs.href
            .replace(`${DETAIL_PAGE_PREFIX}`, "")
            .replace(".html", "")}"`,
          create_time: Date.now(),
          update_time: Date.now(),
        });
      }
    }
  }
  return arr;
};

async function start() {
  const timerTotal = new TimerHelper();
  const DB = new DBHelper();
  await DB.initDB();
  const data =
    DB.runSQL(
      `select * from t_channel tc where  (strftime('%s','now') * 1000  - update_time) / 1000 / 60 / 60 / 24 > 7`
    )?.[0].values.slice(0, 2) || [];
  DB.closeDb();
  const totalList = [];
  for await (const category of data) {
    console.log(`Fetch ${category[0]} begin.`);
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      const list = (await getUrl(category[1], page, DB)) || [];
      totalList.push(...list);
      sleep(2000);
    }
    await DB.initDB();
    totalList.forEach((e) => {
      DB.prepareData("t_topic", e);
    });
    DB.runSQL(
      `update t_channel set update_time = "${Date.now()}" where fid = "${
        category[1]
      }"`
    );
    DB.closeDb();
    console.log(`Fetch ${category[0]} end.`);
  }
  console.log(`${timerTotal.getDuration() / 1000 / 60} mins`);
}
start();
