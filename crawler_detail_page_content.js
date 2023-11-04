import { DBHelper, request, sleep, copyToClipboard } from "./utils.js";
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js";
import fs from "fs";
const start = async () => {
  const DB = new DBHelper();
  DB.runSQL(
    `SELECT * FROM t_topic tt where create_time = update_time AND fid = "7"`
  ).then(async (res) => {
    const list = res?.[0].values || [];
    for await (const iterator of list) {
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${iterator[2]}.html`;
      const { data } = await request(url);
      // copyToClipboard(data);
      if (data.includes(`無法找到頁面`)) {
        await DB.runSQL(`delete from t_topic where url = "${iterator[2]}"`);
        sleep(2000);
        continue;
      }
      const matched = data.match(
        /<div\sclass="tpc_content do_not_catch"\sid="conttpc">.*/
      );
      if (!matched) {
        sleep(2000);
        continue;
      }
      const html = `<h3>${iterator[0]}</h3><br>${matched[0]
        .replace(/ess-data/g, "src")
        .replace(/&nbsp;/g, "")
        .replace(/\siyl-data='http:\/\/a.d\/adblo_ck.jpg'/g, "")
        .replace(/\sdata-link='.*?'/g, "")
        .replaceAll(`class="tpc_content do_not_catch" id="conttpc"`, "")}
        </div><br>`;
      fs.writeFileSync(
        `./pages/${iterator[1]}/${iterator[2].split("/").at(-1)}.html`,
        html
      );
      await DB.runSQL(
        `update t_topic set update_time = "${Math.round(
          new Date().getTime() / 1000
        )}" where url = "${iterator[2]}"`
      );
      sleep(2000);
    }
  });
};

start();
