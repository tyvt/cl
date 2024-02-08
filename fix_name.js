import { get, DBHelper } from "./utils.js"
import { CL_DOMAIN, DETAIL_PAGE_PREFIX } from "./constant.js"

const DB = new DBHelper()
DB.runSQL('SELECT * FROM t_topic tt WHERE tt.name LIKE \'%�%\' LIMIT 10').then(async result => {
  const data = result[0].values || []
  for await (const topic of data) {
    console.log('topic: ', topic)
    const url = `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${topic[2]}.html`
    console.log('url: ', url)
    const { data } = await get(url)
    const name = data.match(/(?<=<h4 class="f16">).*?(?=<\/h4>)/)[0].replace(/<.*>\s/, '')
    console.log('name: ', name)
    await DB.update('t_topic',
      {
        name: name,
      },
      `url = "${topic[2]}"`
    )
  }
})