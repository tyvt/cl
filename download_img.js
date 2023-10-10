import fs from "fs"
import https from 'https'
import {
  HEADERS,
} from "./constant.js"
import { sleep } from "./utils.js"
const SLEEP_TIME = 100
const urls = fs.readFileSync("./urls/imgUrl.txt", "utf-8").split('\n').filter(e => e)
const downloadImg = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: HEADERS
    }, (res) => {
      res.setEncoding('binary')
      let rawData = ''
      res.on('data', (d) => {
        rawData += d
      })
      res.on('end', () => {
        if (Number(rawData.length) / 1024 / 1024 >= 5) {
          const fileName = url.split('/').at(-1).replace(/\r/, '')
          fs.writeFileSync(`./images/${fileName}`, rawData, 'binary')
          resolve(true)
        } else {
          resolve(false)
        }

      })
    }).on('error', (e) => {
      resolve(false)
    })
  })
}
const start = async () => {
  for (let index = urls.length - 1; index > 0; index--) {
    const downloaded = fs.readFileSync("./urls/downloadedImg.txt", "utf-8")
    if (downloaded.includes(urls[index])) {
      const origin = fs.readFileSync("./urls/imgUrl.txt", "utf-8")
      fs.writeFileSync("./urls/imgUrl.txt", origin.replace(urls[index], '').replace(/\n/, ''))
      console.log(`地址重复,删除重复路径`)
    } else {
      console.log(`下载第${index + 1}张图片, ${urls[index]}`)
      const result = await downloadImg(urls[index])
      if (result) {
        fs.writeFileSync("./urls/downloadedImg.txt", `${downloaded}\n${urls[index]}`)
        const origin = fs.readFileSync("./urls/imgUrl.txt", "utf-8")
        fs.writeFileSync("./urls/imgUrl.txt", origin.replace(urls[index], '').replace(/\n/, ''))
        console.log(`下载完成,删除路径`)
      } else {
        const origin = fs.readFileSync("./urls/imgUrl.txt", "utf-8")
        fs.writeFileSync("./urls/imgUrl.txt", origin.replace(urls[index], '').replace(/\n/, ''))
        console.log(`删除无效路径`)
      }
    }
    sleep(SLEEP_TIME)
  }
  console.log(`全部下载完毕,已结束`)
}
start()