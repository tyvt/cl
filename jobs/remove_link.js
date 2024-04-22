import { DBHelper } from "./utils.js"
const DB_DETAIL_2 = new DBHelper("./db/cl-detail-15.sqlite")
const str = "淘精网"
await DB_DETAIL_2.runSQL(`SELECT * from t_content tc WHERE content like "%${str}%"`).then(async res => {
  if (res.length !== 0) {
    for await (let [index, iterator] of res[0].values.entries()) {
      console.log(`${index + 1}/${res[0].values.length}`)
      await DB_DETAIL_2.update('t_content', {
        content: iterator[1].replace(/<img.*?(?=【影片名称代号)/, '')
      }, `url = "${iterator[0]}"`)
    }
  }
})