import { load } from "cheerio";
import { CL_DOMAIN, CATEGORIES, DETAIL_PAGE_PREFIX } from "./constant.js";
import { request, insertData } from "./utils.js";
const TOTAL_PAGES = 100;

const getUrlStart = async (category) => {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const { result, data } = await request(
      `${CL_DOMAIN}/thread0806.php?fid=${category.fid}&page=${page}`
    );
    if (result == "error") return;
    const $ = load(data);
    const domList = $("tr").children(".tal").children("h3").children("a");
    for (const iterator of domList) {
      if (iterator.children && iterator.children.length) {
        const name = iterator.children[0].data || "";
        if (iterator.attribs.href.endsWith(".html") && name) {
          await insertData("t_topic", {
            name: `'${name}'`,
            fid: category.fid,
            url: `'${iterator.attribs.href
              .replace(`${DETAIL_PAGE_PREFIX}`, "")
              .replace(".html", "")}'`,
            create_time: Date.now(),
            update_time: Date.now(),
          });
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
