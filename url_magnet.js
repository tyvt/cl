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
const data = fs.readFileSync("./url.txt", "utf-8")
const urls = data.split('\n').filter(e => e)
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
  for (let index = 50; index < urls.length; index++) {
    const RMDownUrl = await getRMdownUrl(urls[index])
    const magnetUrl = await getMagnetUrl(RMDownUrl)
    const data = fs.readFileSync("./magnet.txt", "utf-8")
    if (data.includes(magnetUrl)) {
      console.log(`重复`)
    } else {
      console.log(`第${index + 1}条抓取完毕`)
      fs.writeFileSync("./magnet.txt", `${data}\n${magnetUrl}`)
    }
    sleep(SLEEP_TIME)
  }
}
start()