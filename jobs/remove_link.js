{/* <a target='_blank' href='https://2023.redircdn.com/?https://3y______ag/&z'>（开云赌场）（华体会赌场）大额存款安排空降 游戏无限制</a> */ }

import { DBHelper } from "./utils.js"
const DB_DETAIL_15 = new DBHelper("./db/cl-detail-15.sqlite")
await DB_DETAIL_15.runSQL(`SELECT * from t_content tc WHERE content like "%华体会赌场%"`).then(async res => {
  if (res.length !== 0) {
    for await (let [index, iterator] of res[0].values.entries()) {
      console.log(`${index}/${res[0].values.length}`)
      await DB_DETAIL_15.update('t_content', {
        content: iterator[1].replace(/<a target='_blank' href='.*?'>（开云赌场）（华体会赌场）大额存款安排空降 游戏无限制<\/a>/g, '')
      }, `url = "${iterator[0]}"`)
    }
  }
})