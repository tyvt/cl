import { head } from "./utils.js"
import fs from 'fs'
const suffix = ['x', 'y', 'x']
const allUrls = []
const validUrls = []
// for (let index = 3000; index < 9999; index++) {
//   let temp = String(index)
//   if (temp.length != 4) {
//     temp = [...new Array(4 - temp.split('').length).fill(0), ...temp.split('')].join('')
//   }
//   suffix.forEach(e => {
//     allUrls.push(`https://cl.${temp}${e}.xyz/index.php`)
//   })
// }
// for await (const url of allUrls) {
//   const { statusCode } = await head(url)
//   if (statusCode == '200') {
//     validUrls.push(url)
//   }
// }
const { statusCode } = await head('https://cl.3097x.xyz/index.php')


// fs.writeFileSync('README.md', `<h1 align="center">1024</h1>\n\n${validUrls.map(e => `<${e}>`).join("\n")}`)
// fs.writeFileSync('../urls/cl.js', `export default [${validUrls}]`)
