import { DBHelper, get, sleep, copyToClipboard } from "./utils.js"
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js"
import fs from "fs"
const start = async () => {
  const arr = []
  const DB = new DBHelper()
  DB.runSQL(
    `SELECT * FROM t_topic tt WHERE fid = "7" AND NOT EXISTS(SELECT * FROM t_content tc WHERE tt.url=tc.url) LIMIT 200`
  ).then(async (res) => {
    const list = res?.[0].values || []
    for await (const iterator of list) {
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${iterator[2]}.html`
      const { data } = await get(url)
      // copyToClipboard(data);
      if (data.includes(`無法找到頁面`)) {
        await DB.runSQL(`delete from t_topic where url = "${iterator[2]}"`)
        sleep(2000)
        continue
      }
      const matched = data.match(
        /<div\sclass="tpc_content do_not_catch"\sid="conttpc">.*/
      )
      if (!matched) {
        sleep(2000)
        continue
      }
      const html = `${matched[0]
        .replace(/ess-data/g, "src")
        .replace(/&nbsp;/g, "")
        .replace(/\siyl-data='http:\/\/a.d\/adblo_ck.jpg'/g, "")
        .replace(/\sdata-link='.*?'/g, "")
        .replaceAll(`class="tpc_content do_not_catch" id="conttpc"`, "").replace(/\"/g, "'").replace(/\s+/g, ' ')}
        </div><br>`
      arr.push({
        fid: `"${iterator[1]}"`,
        url: `"${iterator[2]}"`,
        content: `"${html}"`,
      })
      sleep(2000)
    }
    await DB.insert("t_content", arr)
  })
}

start()
