import { CL_DOMAIN } from "./constant.js";
import { request, sleep, writeUrlToFilePath } from "./utils.js";
const TOTAL_PAGES = 10; // 非会员最多抓100页
const APPROVAL_SIZE = 20;
const getCurrentPageURLs = (currentPage) => {
  const validURLs = [];
  return new Promise((resolve, reject) => {
    request(`${CL_DOMAIN}/thread0806.php?fid=2&page=${currentPage}`).then(
      (res) => {
        const rawArr =
          res
            .match(/<h3><a\shref="htm_data\/.*.html".*?>\[.*?\]/g)
            ?.filter((e) => {
              const size = e.match(/(?<=\/)([0-9]+(.[0-9]{0,})?)(?=\G)/g);
              return size && size.length && Number(size[0]) >= APPROVAL_SIZE;
            }) || [];
        rawArr.forEach((e) => {
          const matchArr = e.match(/(?<=href=").*?(?=")/g) || [];
          if (matchArr.length) {
            validURLs.push(`${CL_DOMAIN}/${matchArr[0]}`);
          }
        });
        resolve(validURLs);
      }
    );
  });
};

const start = async () => {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`获取第${page}页`);
    const urls = await getCurrentPageURLs(page);
    console.log(`获取到${urls.length}条`);
    urls.forEach((link) => {
      writeUrlToFilePath(link, `./urls/fid2.txt`);
    });
    sleep();
  }
  console.log(`获取完毕,已结束`);
};
start();
