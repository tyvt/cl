import fs from "fs";
import { request, writeUrlToFilePath } from "./utils.js";
const urls = fs
  .readFileSync("./urls/imgUrl.txt", "utf-8")
  .split("\n")
  .filter((e) => e);
const downloadImg = (url) => {
  return new Promise((resolve, reject) => {
    const blackList = fs.readFileSync("./urls/blackList.txt", "utf-8");
    if (blackList.includes(new URL(url).origin)) {
      resolve({ result: "fail", message: `域名在黑名单中, skipped.` });
    } else {
      request(url)
        .then((res) => {
          if (Number(res.length) / 1024 / 1024 >= 5) {
            const fileName = url.split("/").at(-1).replace(/\r/, "");
            fs.writeFileSync(`./images/${fileName}`, res, "binary");
            resolve({ result: "success", message: `下载完成` });
          } else {
            resolve({
              result: "fail",
              message: `图片大小不满足要求, skipped.`,
            });
          }
        })
        .catch(() => {
          writeUrlToFilePath(new URL(url).origin, `./urls/blackList.txt`);
          resolve({
            result: "fail",
            message: `${url}域名无法访问，加入黑名单`,
          });
        });
    }
  });
};
const start = async () => {
  for (let index = urls.length - 1; index > 0; index--) {
    const downloaded = fs.readFileSync("./urls/downloadedImg.txt", "utf-8");
    if (downloaded.includes(urls[index])) {
      console.log(`此地址已下载`);
    } else {
      console.log(`下载第${index + 1}张图片, ${urls[index]}`);
      const result = await downloadImg(urls[index]);
      console.log(result.message);
    }
  }
  console.log(`全部下载完毕,已结束`);
};
start();
