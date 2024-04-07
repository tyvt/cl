import { DBHelper } from "./utils.js"
const DB = new DBHelper("./db/cl-detail-15.sqlite")

async function removeClass() {
  console.log("removeClass")
  await DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%class=%"').then(async res => {
    if (res.length) {
      for await (let [index, iterator] of res[0].values.entries()) {
        console.log(`${index}/${res[0].values.length}`)

        await DB.update('t_content', {
          content: iterator[1].replace(/class='.*?'/g, '')
        }, `url = "${iterator[0]}"`)
      }
    }

  })
}

async function removeStyle() {
  console.log("removeStyle")
  await DB.runSQL('SELECT * FROM t_content tc WHERE tc.content LIKE "%style=%"').then(async res => {
    if (res.length) {
      for await (let [index, iterator] of res[0].values.entries()) {
        console.log(`${index}/${res[0].values.length}`)
        await DB.update('t_content', {
          content: iterator[1].replace(/style='.*?'/g, '')
        }, `url = "${iterator[0]}"`)
      }
    }
  })
}

async function removeScript() {
  console.log("removeScript")
  await DB.runSQL('SELECT * from t_content tc WHERE tc.content LIKE "%<script%"').then(async res => {
    if (res.length) {
      for await (let [index, iterator] of res[0].values.entries()) {
        console.log(`${index}/${res[0].values.length}`)
        await DB.update('t_content', {
          content: iterator[1].replace(/<script.*?>.*?<\/script>/g, '')
        }, `url = "${iterator[0]}"`)
      }
    }
  })
}

async function removeLink() {
  console.log("removeLink")
  await DB.runSQL('SELECT * from t_content tc WHERE tc.content LIKE "%<link%"').then(async res => {
    if (res.length) {
      for await (let [index, iterator] of res[0].values.entries()) {
        console.log(`${index}/${res[0].values.length}`)
        await DB.update('t_content', {
          content: iterator[1].replace(/<link.*?>/g, '')
        }, `url = "${iterator[0]}"`)
      }
    }
  })
}
await removeScript()
await removeLink()
await removeStyle()
await removeClass()