import https from "https";
import http from "http";
import fs from "fs";

export const request = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (res) => {
        let rawData = "";
        res.on("data", (d) => {
          rawData += d.toString();
        });
        res.on("end", () => {
          sleep();
          resolve(rawData);
        });
      })
      .on("error", (e) => {
        resolve("");
      });
  });
};

const randomNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sleep = () => {
  let now = new Date();
  const interval = randomNum(1200, 500);
  const exitTime = now.getTime() + interval;
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
    console.log(`${url} Duplicate url, skipped.`);
  } else {
    urls.push(url);
    fs.writeFileSync(path, urls.join("\n"));
    console.log(`${url} Recorded.`);
  }
};
