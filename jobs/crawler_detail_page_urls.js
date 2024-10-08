import { CL_DOMAIN } from "../constant.js"
import { get, DBHelper, TimerHelper, sleep } from "./utils.js"
import fs from "fs"
const MAX_REPEAT = 2

const getUrl = async (fid, page) => {
  const { result, data } = await get(
    `${CL_DOMAIN}/thread0806.php?search=today&fid=${fid}&page=${page}`
  )
  if (result == "error") return false
  const list = data.match(/<a href="htm_data\/.*">.*?<\/a>/g) || []
  const arr = []
  list.forEach((element) => {
    const name = element.match(/(?<=<a href="htm_data\/.*">).*?(?=<\/a>)/)[0]
    const url = element.match(/(?<=href="htm_data)(.*?)(?=.html")/)[0]
    arr.push({
      name: `${name.replace(/\"/g, "'")}`,
      url: `${url}`,
      post_time: ''
    })
  })
  console.log("🚀 ~ getUrl ~ arr:", arr)
  return arr
}

async function start() {
  const timerTotal = new TimerHelper()
  const DB = new DBHelper("./db/cl-main.sqlite")
  await DB.runSQL(
    `select * from t_channel tc`
  ).then(async (result) => {
    if (!result.length) return
    const data = result?.[0]?.values || []
    for await (const category of data) {
      console.log(`Fetch ${category[0]} begin.`)
      let page = 1
      let count = 0
      while (true) {
        const totalList = []
        const list = (await getUrl(category[1], page)) || []
        totalList.push(...list)
        const DB_CATEGORY = new DBHelper(`./db/cl-category-${category[1]}.sqlite`)
        if (totalList.length) {
          let tempUrl = totalList[totalList.length - 1].url
          const searchResponse = await DB_CATEGORY.runSQL(`SELECT * FROM t_topic WHERE url = "${tempUrl}"`)
          const searchResult = searchResponse?.[0]?.values || []
          if (searchResult.length) {
            count++
            sleep(2000)
            if (count > MAX_REPEAT) break
          } else {
            await DB_CATEGORY.insert("t_topic", totalList)
          }
        } else {
          sleep(2000)
          break
        }
        page++
        sleep(2000)
      }
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
start()
