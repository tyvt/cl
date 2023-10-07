import axios from "axios"
import { load } from "cheerio"
import fs from "fs"
import {
  CL_DOMAIN,
  HEADERS,
} from "./constant.js"
import { sleep } from "./utils.js"
const TOTAL_PAGES = 100 // 非会员最多抓100页
const APPROVAL_SIZE = 8
const SLEEP_TIME = 3000
const getCurrentPageURLs = (currentPage) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: `${CL_DOMAIN}/thread0806.php?fid=2&search=&page=${currentPage}`,
      headers: HEADERS,
    }).then((res) => {
      const $ = load(res.data)
      // 有效节点，首页前三个节点无效
      const domList = currentPage == 1 ? $("h3").find("a").slice(3) : $("h3").find("a")
      const validURLs = []
      for (const iterator of domList) {
        const href = iterator.attribs.href
        // 节点标题
        const title = iterator.children[0].data || ''
        const size = title.match(/(?<=\/)([0-9]+(.[0-9]{0,})?)(?=\G)/g)
        if (size && size.length && Number(size[0]) >= APPROVAL_SIZE) {
          validURLs.push(`${CL_DOMAIN}/${href}`)
        }
      }
      resolve(validURLs)
    })
  })
}

const start = async () => {
  let flag = false
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    if (flag) return
    console.log(`抓取第${page}页`)
    const urls = await getCurrentPageURLs(page)
    const data = fs.readFileSync("./outputs/url.txt", "utf-8")
    urls.forEach(link => {
      if (data.includes(link)) {
        flag = true
        console.log(`${link} 重复,已退出`)
      } else {
        fs.writeFileSync("./outputs/url.txt", `${data}\n${link}`)
        console.log(`${link} 抓取成功,已写入`)
      }
    })
    sleep(SLEEP_TIME)
  }
}
start()
