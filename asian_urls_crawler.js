import fs from "fs"
import https from 'https'
import {
  CL_DOMAIN,
  HEADERS,
} from "./constant.js"
import { sleep } from "./utils.js"
const TOTAL_PAGES = 100 // 非会员最多抓100页
const APPROVAL_SIZE = 8
const SLEEP_TIME = 3000
const getCurrentPageURLs = (currentPage) => {
  const validURLs = []
  return new Promise((resolve, reject) => {
    https.get(`${CL_DOMAIN}/thread0806.php?fid=2&search=&page=${currentPage}`, {
      headers: HEADERS
    }, (res) => {
      let rawData = ''
      res.on('data', (d) => {
        rawData += d.toString()
      })
      res.on('end', () => {
        const rawArr = rawData.match(/<h3><a\shref="htm_data\/.*.html".*?>\[.*?\]/g)?.filter(e => {
          const size = e.match(/(?<=\/)([0-9]+(.[0-9]{0,})?)(?=\G)/g)
          return size && size.length && Number(size[0]) >= APPROVAL_SIZE
        }) || []
        rawArr.forEach(e => {
          const matchArr = e.match(/(?<=href=").*?(?=")/g) || []
          if (matchArr.length) {
            validURLs.push(`${CL_DOMAIN}/${matchArr[0]}`)
          }
        })
        resolve(validURLs)
      })
    })
  })
}

const start = async () => {
  let flag = false
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    if (flag) return
    console.log(`抓取第${page}页`)
    const urls = await getCurrentPageURLs(page)
    console.log(`抓取到${urls.length}条`)
    urls.forEach(link => {
      const data = fs.readFileSync("./outputs/url.txt", "utf-8")
      if (data.includes(link)) {
        flag = true
        console.log(`${link} 地址重复,跳过`)
      } else {
        fs.writeFileSync("./outputs/url.txt", `${data}\n${link}`)
        console.log(`${link} 抓取成功,已写入`)
      }
    })
    sleep(SLEEP_TIME)
  }
  console.log(`抓取完毕,已结束`)
}
start()
