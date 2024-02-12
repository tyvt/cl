import { get, DBHelper } from "./utils.js"
const DB = new DBHelper()
DB.update(
  `t_topic`,
  {
    name: '1',
  },
  `url = "/2310/2/5994922"`
).then(async (res) => {
  console.log('res: ', res)
})