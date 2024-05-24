import { DBHelper } from "./utils.js"
import fs from 'fs'
const DB_DETAIL = new DBHelper(`./db/cl-detail-2.sqlite`)
const regex = /[0-9a-fA-F]{40}/;
const MAGNET_PREFIX = "magnet:?xt=urn:btih:"
await DB_DETAIL.runSQL(`SELECT * FROM t_content WHERE content like '%字幕%' ORDER BY ROWID ASC LIMIT 100`).then(async detailRes => {
  const list = detailRes[0].values
  for await (const iterator of list) {
    const matched = iterator[1].match(regex)
    if(matched) {
      let file = fs.readFileSync('./urls/magnets.txt', 'utf-8')
      file += `${MAGNET_PREFIX}${matched[0]}\n`
      fs.writeFileSync('./urls/magnets.txt', file, 'utf-8')
    }
  }
})