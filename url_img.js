import fs from "fs"
import https from 'https'
import {
  HEADERS,
} from "./constant.js"
import { sleep } from "./utils.js"
const SLEEP_TIME = 3000
const urls = fs.readFileSync("./urls/readUrl.txt", "utf-8").split('\n').filter(e => e)
const getImgUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: HEADERS
    }, (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d.toString()
      })
      res.on('end', () => {
        const imgUrls = rawData.match(/(?<=ess-data=')(.*?)(?=')/g,)
        resolve(imgUrls?.slice(1) || [])
      })
    })
  })
}
const start = async () => {
  for (let index = 1153; index > 0; index--) {
    console.log(`抓取第${index + 1}条, ${urls[index]}`)
    const imgUrls = await getImgUrl(urls[index])
    imgUrls.forEach(element => {
      const data = fs.readFileSync("./urls/imgUrl.txt", "utf-8")
      if (data.includes(element)) {
        console.log(`地址重复`)
      } else {
        fs.writeFileSync("./urls/imgUrl.txt", `${data}\n${element}`)
        console.log(`${element} 抓取成功,已写入`)
      }
    })
    sleep(SLEEP_TIME)
  }
  console.log(`抓取完毕,已结束`)
}
start()