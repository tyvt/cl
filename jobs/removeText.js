import { DBHelper } from "./utils.js"
const DB_DETAIL_7 = new DBHelper("./db/cl-detail-7.sqlite")
const DB_CATEGORY_7 = new DBHelper("./db/cl-category-7.sqlite")
const keywords = ['百蓝志', '图说', '经济学人', '微视野', '微博谈', '微语报', '微语录', '微历史', '毁成语', '博海拾贝', '扒B福利社', '翻墙后看什么', '孙立平', '兲朝浮世绘', '大事记',
  '色漫', '涩漫追番', '漫画', '统计貼', '统计贴', '大千视界', '開盤', 'BBC', '新闻汇总', '知天下', '知晓天下事', '安卓', 'iOS', '东京老萧', '唯美图文', '乌克兰', '可乐庙', '俄罗斯', '中国', '美国', '三和大神日报',
  '钱兔影视', '简报', '特朗普', '新闻速递', '今日话题', 'ChatGPT', '票房', '读懂世界', '网站', '影视', '推文', '比亚迪', '外媒', '技术分享']
for await (const keyword of keywords) {
  await DB_CATEGORY_7.runSQL(`SELECT url from t_topic tc WHERE name like "%${keyword}%"`).then(async res => {
    if (res.length !== 0) {
      for await (let [index, iterator] of res[0].values.entries()) {
        console.log(`${index}/${res[0].values.length}`)
        await DB_DETAIL_7.runSQL(`delete from t_content where url = "${iterator[0]}"`)
        await DB_CATEGORY_7.runSQL(`delete from t_topic where url = "${iterator[0]}"`)
      }
    }
  })
}
