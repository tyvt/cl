import { load } from "cheerio";
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js";
import { request, DBHelper, TimerHelper, sleep } from "./utils.js";
const TOTAL_PAGES = 100;

const getUrl = async (fid, page) => {
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
          create_time: Math.round(new Date().getTime() / 1000),
          update_time: Math.round(new Date().getTime() / 1000),
        });
      }
    }
  }
  return arr;
};

async function start() {
  const timerTotal = new TimerHelper();
  const DB = new DBHelper();
  await DB.runSQL(
    `select * from t_channel tc where  (strftime('%s','now') * 1000  - update_time) / 1000 / 60 / 60 / 24 > 7`
  ).then(async (result) => {
    const data = result?.[0].values.slice(0, 2) || [];
    for await (const category of data) {
      console.log(`Fetch ${category[0]} begin.`);
      for (let page = 1; page <= TOTAL_PAGES; page++) {
        const totalList = [];
        const list = (await getUrl(category[1], page)) || [];
        totalList.push(...list);
        await DB.insert("t_topic", totalList);
        sleep(2000);
      }
      await DB.runSQL(
        `update t_channel set update_time = "${Date.now()}" where fid = "${
          category[1]
        }"`
      );
      console.log(`Fetch ${category[0]} end.`);
    }
  });
  console.log(`${timerTotal.getDuration() / 1000 / 60} mins`);
}
start();

// const DB = new DBHelper();
// const fid = "22";
// for (let page = 97; page <= TOTAL_PAGES; page++) {
//   const totalList = [];
//   const list = (await getUrl(fid, page)) || [];
//   totalList.push(...list);
//   await DB.insert("t_topic", totalList);
//   sleep(2000);
// }
// await DB.runSQL(
//   `update t_channel set update_time = "${Math.round(new Date().getTime()/1000)}" where fid = "${fid}"`
// );
