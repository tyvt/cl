import { DBHelper } from "./utils.js"
const DB7 = new DBHelper("./db/cl-detail-7.sqlite")
const DBMAIN = new DBHelper("./db/cl-main.sqlite")


DB7.runSQL('SELECT url from t_content tc WHERE tc.content NOT LIKE "%<img%"').then(async res => {
  for await (let [index, iterator] of res[0].values.entries()) {
    console.log(`${index}/${res[0].values.length}`)

    await DBMAIN.runSQL(`delete from t_topic where url = "${iterator[0]}"`)
  }
})