import { DBHelper, get, sleep, copyToClipboard, TimerHelper } from "./utils.js"
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "../constant.js"
import fs from "fs"
const detail = async (fid) => {
  const DB_CATEGORY = new DBHelper(`./db/cl-category-${fid}.sqlite`)
  await DB_CATEGORY.runSQL(
    `SELECT url FROM t_topic tt WHERE tt.post_time = '' OR tt.post_time ISNULL ORDER BY rowid DESC`
  ).then(async (res) => {
    const list = res?.[0]?.values || []
    for await (const iterator of list) {
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${iterator[0]}.html`
      const { data } = await get(url)
      // copyToClipboard(data);
      if (data.includes(`無法找到頁面`)) {
        await DB_CATEGORY.runSQL(`delete from t_topic where url = "${iterator[0]}"`)
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
      let post_time
      let matchedTime = data.match(/(?<=data-timestamp=").*?(?=")/)
      if (matchedTime?.[0]) {
        post_time = matchedTime?.[0]
      } else {
        matchedTime = data.match(/Posted:.*/)
        const matchDate = matchedTime?.[0].replace('Posted:', '')
        post_time = new Date(matchDate).valueOf() / 1000
      }
      console.log('post_time: ', post_time)
      if (post_time) {
        await DB_CATEGORY.update('t_topic', { 'post_time': post_time }, `url = "${iterator[0]}"`)
      }
      const html = `${matched[0]
        .replace(/ess-data/g, "src")
        .replace(/&nbsp;/g, "")
        .replace(/\siyl-data='http:\/\/a.d\/adblo_ck.jpg'/g, "")
        .replace(/\sdata-link='.*?'/g, "")
        .replace(/<script.*?>.*?<\/script>/g, "")
        .replace(/<link.*?>/g, "")
        .replaceAll(`class="tpc_content do_not_catch" id="conttpc"`, "").replace(/\"/g, "'").replace(/\s+/g, ' ')}
          </div><br>`
      const DB_DETAIL = new DBHelper(`./db/cl-detail-${fid}.sqlite`)
      await DB_DETAIL.insert("t_content", [{
        url: iterator[0],
        content: html,
      }])
      sleep(2200)
    }
    await count(fid)
  })
}

const count = async (fid) => {
  console.log("🚀 ~ count ~ fid:", fid)
  const DB_MAIN = new DBHelper("./db/cl-main.sqlite")
  let size = fs.statSync(`./db/cl-detail-${fid}.sqlite`).size
  const DB_DETAIL = new DBHelper(`./db/cl-detail-${fid}.sqlite`)
  console.log("🚀 ~ count ~ size:", size)
  if(size > 90000000) {
    const DB_CATEGORY = new DBHelper(`./db/cl-category-${fid}.sqlite`)
    await DB_CATEGORY.runSQL(`SELECT url FROM t_topic ORDER BY post_time ASC LIMIT 1000`).then(async categoryRes => {
      const list = categoryRes[0].values
      if(categoryRes[0].values) {
        for await (const iterator of list) {
          console.log("🚀 ~ forawait ~ iterator:", iterator[0])
          await DB_DETAIL.runSQL(`DELETE FROM t_content WHERE url = "${iterator[0]}"`)
          await DB_CATEGORY.runSQL(`DELETE FROM t_topic WHERE url = "${iterator[0]}"`)
        }
        await DB_DETAIL.runSQL(`VACUUM`)
        await DB_CATEGORY.runSQL(`VACUUM`)
        size = fs.statSync(`./db/cl-detail-${fid}.sqlite`).size
      }
    })
  }
  DB_DETAIL.runSQL(`SELECT COUNT(*) FROM t_content tc WHERE tc.url LIKE '%/' || ${fid} || '/%'`).then(async detailRes => {
    await DB_MAIN.update('t_channel', {
      count: detailRes[0].values[0][0],
      detail_size: size
    }, `fid = "${fid}"`)
  })
}

async function main() {
  const timerTotal = new TimerHelper()
  const DB = new DBHelper("./db/cl-main.sqlite")
  await DB.runSQL(
    `select * from t_channel tc`
  ).then(async (result) => {
    const data = result?.[0]?.values || []
    for await (const category of data) {
      console.log(`Fetch ${category[0]} begin.`)
      await detail(category[1])
      const { size } = fs.statSync(`./db/cl-category-${category[1]}.sqlite`)
      await DB.update('t_channel', {
        update_time: Math.round(new Date().getTime() / 1000),
        category_size: size
      }, `fid = "${category[1]}"`)
      console.log(`Fetch ${category[0]} end.`)
    }
  })
  console.log(`${timerTotal.getDuration() / 1000 / 60} mins`)
}

main()
