import { DBHelper, get, sleep, copyToClipboard, TimerHelper } from "./utils.js"
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "../constant.js"
import fs from "fs"
const start = async () => {
  const DB_MAIN = new DBHelper("./db/cl-main.sqlite")
  DB_MAIN.runSQL(
    `SELECT url FROM t_topic tt WHERE tt.url NOT LIKE "%/20/%" AND tt.post_time IS NULL LIMIT 300`
  ).then(async (res) => {
    const list = res?.[0].values || []
    for await (const iterator of list) {
      const timerTotal = new TimerHelper()
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${iterator[0]}.html`
      const { data } = await get(url)
      // copyToClipboard(data);
      if (data.includes(`無法找到頁面`)) {
        await DB_MAIN.runSQL(`delete from t_topic where url = "${iterator[0]}"`)
        sleep(2200)
        continue
      }
      const matched = data.match(
        /<div\sclass="tpc_content do_not_catch"\sid="conttpc">.*/
      )
      if (!matched) {
        sleep(2200)
        continue
      }
      const matchedTime = data.match(/Posted:.*/)
      const matchDate = matchedTime?.[0].replace('Posted:', '')
      const post_time = new Date(matchDate).valueOf() / 1000
      console.log('post_time: ', post_time)
      if (post_time) {
        await DB_MAIN.update('t_topic', { 'post_time': post_time }, `url = "${iterator[0]}"`)
      }
      const html = `${matched[0]
        .replace(/ess-data/g, "src")
        .replace(/&nbsp;/g, "")
        .replace(/\siyl-data='http:\/\/a.d\/adblo_ck.jpg'/g, "")
        .replace(/\sdata-link='.*?'/g, "")
        .replaceAll(`class="tpc_content do_not_catch" id="conttpc"`, "").replace(/\"/g, "'").replace(/\s+/g, ' ')}
          </div><br>`
      const DB_DETAIL = new DBHelper(`./db/cl-detail-${iterator[0].split('/')[2]}.sqlite`)
      await DB_DETAIL.insert("t_content", [{
        url: iterator[0],
        content: html,
      }])
      sleep(2200)
    }
    await count()
  })
}

const count = async () => {
  const DB_MAIN = new DBHelper("./db/cl-main.sqlite")
  DB_MAIN.runSQL('SELECT fid FROM t_channel').then(async res => {
    for await (const iterator of res[0].values) {
      const DB_DETAIL = new DBHelper(`./db/cl-detail-${iterator[0]}.sqlite`)
      DB_DETAIL.runSQL(`SELECT COUNT(*) FROM t_content tc WHERE tc.url LIKE '%/' || ${iterator[0]} || '/%'`).then(async detailRes => {
        await DB_MAIN.update('t_channel', {
          count: detailRes[0].values[0][0]
        }, `fid = "${iterator[0]}"`)
      })
    }
  })
}

start()
