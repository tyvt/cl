import { get, DBHelper, TimerHelper, sleep } from "./utils.js"
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "../constant.js"

const fixTitle = async (fid) => {
  const DB = new DBHelper(`./db/cl-category-${fid}.sqlite`)
  await DB.runSQL('SELECT * FROM t_topic tt WHERE tt.name LIKE \'%�%\' LIMIT 30').then(async result => {
    const data = result?.[0]?.values || []
    for await (const topic of data) {
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${topic[1]}.html`
      const { data } = await get(url)
      const matched = data.match(/(?<=<h4 class="f16">).*?(?=<\/h4>)/)
      const name = matched && matched.length && matched[0].replace(/<.*>\s/, '')
      console.log('name: ', name)
      await DB.update('t_topic',
        {
          name: name,
        },
        `url = "${topic[1]}"`
      )
      sleep(2500)
    }
  })
}

const fixContent = async (fid) => {
  const DB = new DBHelper(`./db/cl-detail-${fid}.sqlite`)
  await DB.runSQL('SELECT * FROM t_content tt WHERE tt.content LIKE \'%�%\' LIMIT 80').then(async result => {
    const data = result?.[0]?.values || []
    for await (const topic of data) {
      const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${topic[0]}.html`
      const { data } = await get(url)
      const matched = data.match(
        /<div\sclass="tpc_content do_not_catch"\sid="conttpc">.*/
      )
      const html = matched && matched.length && `${matched[0]
        .replace(/ess-data/g, "src")
        .replace(/&nbsp;/g, "")
        .replace(/\siyl-data='http:\/\/a.d\/adblo_ck.jpg'/g, "")
        .replace(/\sdata-link='.*?'/g, "")
        .replaceAll(`class="tpc_content do_not_catch" id="conttpc"`, "").replace(/\"/g, "'").replace(/\s+/g, ' ')}
        </div><br>`
      await DB.update('t_content',
        {
          content: html,
        },
        `url = "${topic[0]}"`
      )
      sleep(2500)
    }
  })
}

async function main() {
  const timerTotal = new TimerHelper()
  const DB = new DBHelper("./db/cl-main.sqlite")
  await DB.runSQL(
    `select * from t_channel tc`
  ).then(async (result) => {
    const data = result?.[0]?.values || []
    for await (const category of data) {
      console.log(`Fetch ${category[0]} begin.`)
      // await fixTitle(category[1])
      await fixContent(category[1])
      console.log(`Fetch ${category[0]} end.`)
    }
  })
  console.log(`${timerTotal.getDuration() / 1000 / 60} mins`)
}

main()
