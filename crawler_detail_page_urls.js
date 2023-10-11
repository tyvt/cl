import { load } from "cheerio";
import { CL_DOMAIN, CATEGORIES, DETAIL_PAGE_PREFIX } from "./constant.js";
import { request, writeUrlToFilePath } from "./utils.js";
const TOTAL_PAGES = 100;
const APPROVAL_LIKE = 0;

const getUrlStart = async (category) => {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
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
  }
};

for await (const category of CATEGORIES) {
  console.log(`Fetch ${category.description} begin.`);
  await getUrlStart(category);
  console.log(`Fetch ${category.description} end.`);
}
