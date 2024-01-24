import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js"
import { get, writeUrlToFilePath } from "./utils.js"
const TOTAL_PAGES = 100
const APPROVAL_SIZE = 20
const getCurrentPageURLs = (currentPage) => {
  const validURLs = []
  return new Promise((resolve, reject) => {
    get(`${CL_DOMAIN}/thread0806.php?fid=2&page=${currentPage}`).then(
      ({ result, data }) => {
        const rawArr =
          data
            .match(/<h3><a\shref="htm_data\/.*.html".*?>\[.*?\]/g)
            ?.filter((e) => {
              const size = e.match(/(?<=\/)([0-9]+(.[0-9]{0,})?)(?=\G)/g)
              return size && size.length && Number(size[0]) >= APPROVAL_SIZE
            }) || []
        rawArr.forEach((e) => {
          const matchArr = e.match(/(?<=href=").*?(?=")/g) || []
          if (matchArr.length) {
            validURLs.push(`${matchArr[0]}`)
          }
        })
        resolve(validURLs)
      }
    )
  })
}

const start = async () => {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const urls = await getCurrentPageURLs(page)
    urls.forEach((link) => {
      writeUrlToFilePath(
        `${link.replace(`${DETAIL_PAGE_PREFIX}`, "").replace(".html", "")}`,
        `./urls/fid2.txt`
      )
    })
  }
  console.log(`Finish.`)
}
start()
