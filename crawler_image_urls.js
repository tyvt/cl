import fs from "fs";
import {
  CL_DOMAIN,
  CATEGORIES,
  DETAIL_PAGE_PREFIX,
  URL_REG,
  IMAGE_SUFFIX,
} from "./constant.js";
import { request, writeUrlToFilePath } from "./utils.js";

const getImageUrlStart = async (category) => {
  const urls = fs
    .readFileSync(`./urls/fid${category.fid}.txt`, "utf-8")
    .split("\n")
    .filter((e) => e);
  for (let index = urls.length - 1; index > 0; index--) {
    const res = await request(
      `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${urls[index]}.html`
    );
    const imgUrls = res.match(/(?<=ess-data=')(.*?)(?=')/g) || [];
    const blackList = fs.readFileSync("./urls/blackList.txt", "utf-8");
    imgUrls.forEach((url) => {
      const matchUrl = url.match(URL_REG) || [];
      if (matchUrl.length && blackList.includes(new URL(matchUrl[0]).origin)) {
        console.log(`Invalid domain, skipped.`);
      } else if (!IMAGE_SUFFIX.some((e) => url.endsWith(e))) {
        console.log(`Invalid format, skipped.`);
      } else {
        writeUrlToFilePath(url, `./urls/imgUrl.txt`);
      }
    });
  }
};

for await (const category of CATEGORIES) {
  console.log(`Fetch ${category.description} begin.`);
  await getImageUrlStart(category);
  console.log(`Fetch ${category.description} end.`);
}
