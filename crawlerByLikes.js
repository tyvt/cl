import { load } from "cheerio";
import fs from "fs";
import {
  CL_DOMAIN,
  CATEGORIES,
  DETAIL_PAGE_PREFIX,
  URL_REG,
  IMAGE_SUFFIX,
} from "./constant.js";
import { request, writeUrlToFilePath, sleep } from "./utils.js";
const TOTAL_PAGES = 100; // 非会员最多抓100页
const APPROVAL_LIKE = 0;

const getUrlStart = async (category) => {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`获取第${page}页`);
    const html = await request(
      `${CL_DOMAIN}/thread0806.php?fid=${category.fid}&page=${page}`
    );
    const $ = load(html);
    const domList = $("tr").children(".tal").children("h3").children("a");
    for (const iterator of domList) {
      if (iterator.children && iterator.children.length) {
        // const title = iterator.children[0].data || "";
        // const matchedArr = title.match(/\[\d{1,}[p|P]\]/g) || [];
        const likes = Number(
          $(`[id=${iterator.attribs.id}]`)
            .parent()
            .parent()
            .prev()
            .children(".s3")
            .text()
        );
        if (iterator.attribs.href.endsWith(".html") && likes > APPROVAL_LIKE) {
          writeUrlToFilePath(
            `${iterator.attribs.href
              .replace(`${DETAIL_PAGE_PREFIX}`, "")
              .replace(".html", "")}`,
            `./urls/fid${category.fid}.txt`
          );
        }
      }
    }
    sleep();
  }
};
const getImageUrlStart = async (category) => {
  const urls = fs
    .readFileSync(`./urls/fid${category.fid}.txt`, "utf-8")
    .split("\n")
    .filter((e) => e);
  for (let index = urls.length - 1; index > 0; index--) {
    console.log(
      `获取第${index + 1}条, ${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${
        urls[index]
      }.html`
    );
    const res = await request(
      `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${urls[index]}.html`
    );
    const imgUrls = res.match(/(?<=ess-data=')(.*?)(?=')/g) || [];
    const blackList = fs.readFileSync("./urls/blackList.txt", "utf-8");
    imgUrls.forEach((url) => {
      const matchUrl = url.match(URL_REG) || [];
      if (matchUrl.length && blackList.includes(new URL(matchUrl[0]).origin)) {
        console.log(`域名在黑名单中, skipped.`);
      } else if (!IMAGE_SUFFIX.some((e) => url.endsWith(e))) {
        console.log(`格式不符合, skipped.`);
      } else {
        writeUrlToFilePath(url, `./urls/imgUrl.txt`);
      }
    });
    sleep();
  }
  console.log(`Finish.`);
};

for await (const category of CATEGORIES) {
  console.log(`获取 ${category.description} 详情页开始`);
  await getUrlStart(category);
  console.log(`获取 ${category.description} 详情页结束`);
}

for await (const category of CATEGORIES) {
  console.log(`获取 ${category.description} 图片地址开始`);
  await getImageUrlStart(category);
  console.log(`获取 ${category.description} 图片地址结束`);
}
