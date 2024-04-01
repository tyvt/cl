import { DBHelper } from "./utils.js"
const DB = new DBHelper("./db/cl-detail-7.sqlite")

async function removeClass() {
  await DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%class=%"').then(async res => {

    for await (let [index, iterator] of res[0].values.entries()) {
      console.log(`${index}/${res[0].values.length}`)

      await DB.update('t_content', {
        content: iterator[1].replace(/class='.*?'/g, '')
      }, `url = "${iterator[0]}"`)
    }
  })
}

async function removeStyle() {
  await DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%style=%"').then(async res => {
    for await (let [index, iterator] of res[0].values.entries()) {
      console.log(`${index}/${res[0].values.length}`)
      await DB.update('t_content', {
        content: iterator[1].replace(/style='.*?'/g, '')
      }, `url = "${iterator[0]}"`)
    }
  })
}

await removeClass()
await removeStyle()