import { get } from "./utils.js"
import fs from 'fs'
const suffix = ['x', 'y', 'x']
const allUrls = []
const validUrls = []
for (let index = 1000; index < 9999; index++) {
  let temp = String(index)
  if (temp.length != 4) {
    temp = [...new Array(4 - temp.split('').length).fill(0), ...temp.split('')].join('')
  }
  suffix.forEach(e => {
    allUrls.push(`https://cl.${temp}${e}.xyz/mobile.php?ismobile=yes`)
  })
}
for await (const url of allUrls) {
  const { result, data, statusCode } = await get(url)
  if (statusCode == '200') {
    validUrls.push(url)
  }
}

fs.writeFileSync('README.md', `<h1 align="center">1024</h1>\n\n${validUrls.map(e => `<${e}>`).join("\n")}`)
fs.writeFileSync('../urls/cl.js', `export default [${validUrls}]`)