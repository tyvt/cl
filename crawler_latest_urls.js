import { get } from "./utils.js"
import fs from 'fs'
const suffix = ['x', 'y', 'x']
const allUrls = []
const validUrls = []
for (let index = 0; index < 9999; index++) {
  let temp = String(index)
  if (temp.length != 4) {
    temp = [...new Array(4 - temp.split('').length).fill(0), ...temp.split('')].join('')
  }
  suffix.forEach(e => {
    allUrls.push(`https://cl.${temp}${e}.xyz/index.php`)
  })
}
for await (const url of allUrls) {
  const { result, data } = await get(url)
  if (result != "error" && data.includes('歡迎新會員')) {
    validUrls.push(url)
  }
}

fs.writeFileSync('README.md', `<h1 align="center">1024社区域名列表</h1>\n\n${validUrls.map(e => `<${e}>`).join("\n")}`)