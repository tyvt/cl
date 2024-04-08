{/* <a target='_blank' href='https://2023.redircdn.com/?https://3y______ag/&z'>（开云赌场）（华体会赌场）大额存款安排空降 游戏无限制</a> */ }

import { DBHelper } from "./utils.js"
const DB_DETAIL_15 = new DBHelper("./db/cl-detail-15.sqlite")
const str = "<span ><a target='_blank'  href='https://2023.redircdn.com/?https://bbs______o04y______com/2048/&z'>最新最全面AV新片發布~2048部落格</a></span><br /><br /><img src='https://img.blr844.com/images/2023/09/15/760x90---1.jpg'><br /><span ><a target='_blank'  href='https://2023.redircdn.com/?https://m______av28______tv&z'>怡春院 英雄江湖撕殺 拼搏為了誰 ？終究還是為了插紅顏。想插嗎？</a></span><br /><br /><img src='https://cbu01.alicdn.com/img/ibank/2018/510/234/9439432015_1746120392.jpg'><br /><a target='_blank'  href='https://2023.redircdn.com/?https://www______dj134______com/daili07______htm&z'>【凤凰娱乐】 美女荷官在线发牌！网上最火爆的游戏平台、还有500万奖金等你来拿</a><br /><br /><span ><a target='_blank'  href='https://2023.redircdn.com/?http://www______337788______com&z'>【大發棋牌 337788.com】下載APP即送1888元 可提款！年度最佳火爆棋牌 万人在線火熱PK</a></span><br /><br /><img src='http://slong99.com/i/2023/12/18/pfs3hh.gif'><br /><a target='_blank'  href='https://2023.redircdn.com/?https://vip779888______cc/&z'>彩票投注，百家乐，棋牌游戏，手机捕鱼，体育投注 黃金甲体育</a><br /><br /><img src='https://img.blr844.com/images/2023/09/15/760x90---1.jpg'><br /><span >"
await DB_DETAIL_15.runSQL(`SELECT * from t_content tc WHERE content like "%${str}%"`).then(async res => {
  if (res.length !== 0) {
    for await (let [index, iterator] of res[0].values.entries()) {
      console.log(`${index + 1}/${res[0].values.length}`)
      await DB_DETAIL_15.update('t_content', {
        content: iterator[1].replace(str, '')
      }, `url = "${iterator[0]}"`)
    }
  }
})