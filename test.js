import { get, DBHelper } from "./utils.js"
// https://bbs.bkv0.com/2048/read.php?tid=12702209
// https://www.version-carol.cn/documents/craw-shared
// https://cl.1538x.xyz/thread0806.php?fid=7&page=1
// get(`https://cl.1506x.xyz/thread0806.php?fid=7&page=1`).then(res => {
//   console.log('res: ', res)
// })
const DB = new DBHelper()
DB.runSQL(
  `SELECT * FROM t_content`
).then(async (res) => {
  const list = res?.[0].values || []
  for await (const iterator of list) {
    console.log('iterator: ',)
    await DB.runSQL(
      `update t_content set content = "${iterator[2].replace(/<h3>.*?<\/h3><br>/, '').replace(/\s/g, '')}" where url = "${iterator[1]}"`
    )
  }
})