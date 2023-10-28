import { CL_DOMAIN } from "./constant.js";
import { request, DBHelper, TimerHelper, sleep } from "./utils.js";
const TOTAL_PAGES = 100;

const getUrl = async (fid, page) => {
  const { result, data } = await request(
    `${CL_DOMAIN}/thread0806.php?fid=${fid}&page=${page}`
  );
  if (result == "error") return false;
  const list = data.match(/<a href="htm_data\/.*">.*?<\/a>/g);
  const arr = [];
  list.forEach((element) => {
    const name = element.match(/(?<=<a href="htm_data\/.*">).*?(?=<\/a>)/)[0];
    const url = element.match(/(?<=href="htm_data)(.*?)(?=.html")/)[0];
    arr.push({
      name: `"${name.replace(/\"/g, "'")}"`,
      fid: fid,
      url: url,
      create_time: Math.round(new Date().getTime() / 1000),
      update_time: Math.round(new Date().getTime() / 1000),
    });
  });
  return arr;
};

async function start() {
  const timerTotal = new TimerHelper();
  const DB = new DBHelper();
  await DB.runSQL(
    `select * from t_channel tc where  (strftime('%s','now') - update_time) / 60 / 60 / 24 > 7`
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
        `update t_channel set update_time = "${Math.round(
          new Date().getTime() / 1000
        )}" where fid = "${category[1]}"`
      );
      console.log(`Fetch ${category[0]} end.`);
    }
  });
  console.log(`${timerTotal.getDuration() / 1000 / 60} mins`);
}
start();

// const DB = new DBHelper();
// const fid = "26";
// for (let page = 1; page <= TOTAL_PAGES; page++) {
//   const totalList = [];
//   const list = (await getUrl(fid, page)) || [];
//   totalList.push(...list);
//   await DB.insert("t_topic", totalList);
//   sleep(2000);
// }
// await DB.runSQL(
//   `update t_channel set update_time = "${Math.round(
//     new Date().getTime() / 1000
//   )}" where fid = "${fid}"`
// );
