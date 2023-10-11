import fs from "fs";
import {
  CL_DOMAIN,
  DETAIL_PAGE_PREFIX,
  MAGNET_PREFIX,
  RM_DOWN_DOMAIN,
} from "./constant.js";
import { request, writeUrlToFilePath } from "./utils.js";
const urls = fs
  .readFileSync("./urls/fid2.txt", "utf-8")
  .split("\n")
  .filter((e) => e);
const regExp = new RegExp(`(?<=href=")${RM_DOWN_DOMAIN}\\?hash=.*?(?=")`, "g");
const getRMdownUrl = (url) => {
  return new Promise((resolve, reject) => {
    request(url).then((res) => {
      const resUrl = res.match(regExp)?.[0];
      resolve(resUrl);
    });
  });
};
const getMagnetUrl = (url) => {
  return new Promise((resolve, reject) => {
    request(url).then((res) => {
      const hashCode = res.match(/(?<=Code:\s)(.*?)(?=<\/span>)/g)?.[0];
      resolve(`${MAGNET_PREFIX}${hashCode}`);
    });
  });
};
const start = async () => {
  for (let index = urls.length - 1; index >= 0; index--) {
    const RMDownUrl = await getRMdownUrl(
      `${CL_DOMAIN}/${DETAIL_PAGE_PREFIX}${urls[index]}.html`
    );
    const magnetUrl = await getMagnetUrl(RMDownUrl);
    writeUrlToFilePath(magnetUrl, `./urls/magnet.txt`);
  }
  console.log(`Finished.`);
};
start();
