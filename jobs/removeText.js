import { DBHelper } from "./utils.js"
const DB_DETAIL_7 = new DBHelper("./db/cl-detail-7.sqlite")
const DB_CATEGORY_7 = new DBHelper("./db/cl-category-7.sqlite")


await DB_DETAIL_7.runSQL('SELECT url from t_content tc WHERE tc.content NOT LIKE "%<img%"').then(async res => {
  for await (let [index, iterator] of res[0].values.entries()) {
    console.log(`${index}/${res[0].values.length}`)
    await DB_DETAIL_7.runSQL(`delete from t_content where url = "${iterator[0]}"`)
    await DB_CATEGORY_7.runSQL(`delete from t_topic where url = "${iterator[0]}"`)
  }
})