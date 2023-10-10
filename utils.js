import https from "https";
import http from "http";
import fs from "fs";
import { HEADERS } from "./constant.js";

export const request = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(
        url,
        {
          headers: HEADERS,
        },
        (res) => {
          let rawData = "";
          res.on("data", (d) => {
            rawData += d.toString();
          });
          res.on("end", () => {
            resolve(rawData);
          });
        }
      )
      .on("error", (e) => {
        reject(e);
      });
  });
};

export const sleep = (millSeconds = 3000) => {
  let now = new Date();
  const exitTime = now.getTime() + millSeconds;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) {
      return;
    }
  }
};

export const writeUrlToFilePath = (url, path) => {
  const urls = fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .filter((e) => e);
  if (urls.includes(url)) {
    console.log(`${url} 地址重复,跳过`);
  } else {
    urls.push(url);
    fs.writeFileSync(path, urls.join("\n"));
    console.log(`${url} 已写入`);
  }
};
