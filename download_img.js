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
      resolve({ result: "fail", message: `Blocked domain, skipped.` });
    } else {
      request(url)
        .then((res) => {
          if (Number(res.length) / 1024 / 1024 >= 5) {
            const fileName = url.split("/").at(-1).replace(/\r/, "");
            fs.writeFileSync(`./images/${fileName}`, res, "binary");
            resolve({ result: "success", message: `Downloaded.` });
          } else {
            resolve({
              result: "fail",
              message: `Image size unsatisfied, skipped.`,
            });
          }
        })
        .catch(() => {
          writeUrlToFilePath(new URL(url).origin, `./urls/blackList.txt`);
          resolve({
            result: "fail",
            message: `Can not access ${url}, blocked.`,
          });
        });
    }
  });
};
const start = async () => {
  for (let index = urls.length - 1; index > 0; index--) {
    const downloaded = fs.readFileSync("./urls/downloadedImg.txt", "utf-8");
    if (downloaded.includes(urls[index])) {
      console.log(`Downloaded, skipped.`);
    } else {
      console.log(`Download image${index + 1}, ${urls[index]}`);
      const result = await downloadImg(urls[index]);
      console.log(result.message);
    }
  }
  console.log(`Finished.`);
};
start();
