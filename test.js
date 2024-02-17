import { get, DBHelper } from "./utils.js"
const DB = new DBHelper()
DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%class=%"').then(async res => {
  for await (const iterator of res[0].values) {
    await DB.update('t_content', {
      content: iterator[2].replace(/class='.*?'/g, '')
    }, `url = "${iterator[1]}"`)
  }
})