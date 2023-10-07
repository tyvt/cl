import axios from "axios"
import { load } from "cheerio"
import fs from "fs"
import {
  HEADERS,
  MAGNET_PREFIX,
  RM_DOWN_DOMAIN,
} from "./constant.js"
import { sleep } from "./utils.js"
const SLEEP_TIME = 3000
const urls = fs.readFileSync("./outputs/url.txt", "utf-8").split('\n').filter(e => e)
const getRMdownUrl = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      headers: HEADERS,
    }).then((res) => {
      const $ = load(res.data)
      const linkTags = $('[id=conttpc]').find(`a:contains('${RM_DOWN_DOMAIN}')`)
      for (const iterator of linkTags) {
        resolve(iterator.attribs.href)
      }
    })
  })
}
const getMagnetUrl = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      headers: HEADERS,
    }).then((res) => {
      const hashCode = res.data.match(
        /(?<=Code:\s)(.*?)(?=<\/span>)/g
      )[0]
      resolve(`${MAGNET_PREFIX}${hashCode}`)
    })
  })
}
const start = async () => {
  let flag = false
  for (let index = urls.length - 1; index > 0; index--) {
    if (flag) return
    console.log(`抓取第${index + 1}条, ${urls[index]}`)
    const RMDownUrl = await getRMdownUrl(urls[index])
    const magnetUrl = await getMagnetUrl(RMDownUrl)
    const data = fs.readFileSync("./outputs/magnet.txt", "utf-8")
    if (data.includes(magnetUrl)) {
      flag = true
      console.log(`重复,已退出`)
    } else {
      fs.writeFileSync("./outputs/magnet.txt", `${data}\n${magnetUrl}`)
      console.log(`抓取成功,已写入`)
    }
    sleep(SLEEP_TIME)
  }
}
start()