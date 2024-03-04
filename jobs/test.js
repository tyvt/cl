import { get, DBHelper } from "../utils.js"
const DB = new DBHelper("./db/cl-detail-2.sqlite")

function removeClass() {
  DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%class=%"').then(async res => {
    for await (const iterator of res[0].values) {
      await DB.update('t_content', {
        content: iterator[1].replace(/class='.*?'/g, '')
      }, `url = "${iterator[0]}"`)
    }
  })
}

function removeStyle() {
  DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%style=%"').then(async res => {
    for await (const iterator of res[0].values) {
      await DB.update('t_content', {
        content: iterator[1].replace(/style='.*?'/g, '')
      }, `url = "${iterator[0]}"`)
    }
  })
}

removeStyle()