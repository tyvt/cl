import { get } from "./utils.js"
// https://bbs.bkv0.com/2048/read.php?tid=12702209
// https://www.version-carol.cn/documents/craw-shared
// https://cl.1538x.xyz/thread0806.php?fid=7&page=1
get(`https://cl.1506x.xyz/thread0806.php?fid=7&page=1`).then(res => {
  console.log('res: ', res)
})