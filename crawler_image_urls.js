import fs from "fs";
import {
  CL_DOMAIN,
  CATEGORIES,
  DETAIL_PAGE_PREFIX,
  URL_REG,
  IMAGE_SUFFIX,
} from "./constant.js";
import { request, writeUrlToFilePath } from "./utils.js";
console.log(process.argv.slice(2));
const getImageUrlStart = async (category) => {
  const urls = fs
    .readFileSync(`./urls/fid${category.fid}.txt`, "utf-8")
    .split("\n")
    .filter((e) => e);
  for (let index = urls.length - 1; index > 0; index--) {
    const { result, data } = await request(
      `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${urls[index]}.html`
    );
    if (result == "error") return;
    const imgUrls = data.match(/(?<=ess-data=')(.*?)(?=')/g) || [];
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

const currentCategory = CATEGORIES[Number(process.argv.slice(2)[0])];

console.log(`Fetch ${currentCategory.description} begin.`);
await getImageUrlStart(currentCategory);
console.log(`Fetch ${currentCategory.description} end.`);
