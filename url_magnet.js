import fs from "fs"
import https from 'https'
import http from 'http'
import {
  HEADERS,
  MAGNET_PREFIX,
  RM_DOWN_DOMAIN,
} from "./constant.js"
import { sleep } from "./utils.js"
const SLEEP_TIME = 3000
const urls = fs.readFileSync("./outputs/url.txt", "utf-8").split('\n').filter(e => e)
const regExp = new RegExp(`(?<=href=")${RM_DOWN_DOMAIN}\\?hash=.*?(?=")`, 'g')
const getRMdownUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: HEADERS
    }, (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d.toString()
      })
      res.on('end', () => {
        const resUrl = rawData.match(regExp)?.[0]
        resolve(resUrl)
      })
    })
  })
}
const getMagnetUrl = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, {
      headers: HEADERS
    }, (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d.toString()
      })
      res.on('end', () => {
        const hashCode = rawData.match(
          /(?<=Code:\s)(.*?)(?=<\/span>)/g
        )?.[0]
        resolve(`${MAGNET_PREFIX}${hashCode}`)
      })
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
    const downloaded = fs.readFileSync("./outputs/downloaded.txt", "utf-8")
    if (data.includes(magnetUrl)) {
      flag = true
      console.log(`地址重复,退出`)
    } else if (downloaded.includes(magnetUrl)) {
      flag = true
      console.log(`已下载,退出`)
    }
    else {
      fs.writeFileSync("./outputs/magnet.txt", `${data}\n${magnetUrl}`)
      console.log(`抓取成功,已写入`)
    }
    sleep(SLEEP_TIME)
  }
  console.log(`抓取完毕,已结束`)
}
start()