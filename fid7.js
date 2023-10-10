import { load } from 'cheerio'
import fs from "fs"
import https from 'https'
import {
  CL_DOMAIN,
  HEADERS,
} from "./constant.js"
import { sleep } from "./utils.js"
const TOTAL_PAGES = 100 // 非会员最多抓100页
const APPROVAL_LIKE = 300
const SLEEP_TIME = 3000
const getCurrentPageURLs = (currentPage) => {
  const validURLs = []
  return new Promise((resolve, reject) => {
    https.get(`${CL_DOMAIN}/thread0806.php?fid=7&page=${currentPage}`, {
      headers: HEADERS
    }, (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d.toString()
      })
      res.on('end', () => {
        const $ = load(rawData)
        const domList = $('tr').children('.tal').children('h3').children('a')
        for (const iterator of domList) {
          if (iterator.children && iterator.children.length) {
            const title = iterator.children[0].data || ''
            const matchedArr = title.match(/\[\d{1,}[p|P]\]/g) || []
            if (matchedArr.length) {
              if (Number($(`[id=${iterator.attribs.id}]`).parent().parent().prev().children('.s3').text()) > APPROVAL_LIKE) {
                validURLs.push(`${CL_DOMAIN}/${iterator.attribs.href}`)
              }
            }
          }
        }
        resolve(validURLs)
      })
    })
  })
}

const start = async () => {
  let flag = false
  for (let page = 10; page <= TOTAL_PAGES; page++) {
    if (flag) return
    console.log(`抓取第${page}页`)
    const urls = await getCurrentPageURLs(page)
    console.log(`抓取到${urls.length}条`)
    urls.forEach(link => {
      const data = fs.readFileSync("./urls/readUrl.txt", "utf-8")
      if (data.includes(link)) {
        flag = true
        console.log(`${link} 地址重复,跳过`)
      } else {
        fs.writeFileSync("./urls/readUrl.txt", `${data}\n${link}`)
        console.log(`${link} 抓取成功,已写入`)
      }
    })
    sleep(SLEEP_TIME)
  }
  console.log(`抓取完毕,已结束`)
}
start()
