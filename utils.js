import https from "https";
import http from "http";
import fs from "fs";
import UserAgent from "user-agents";
export const request = (url, interval = 3000) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    console.log(
      `Fetch ${url}, time: ${new Date(
        Date.now()
      ).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()}`
    );
    protocol
      .get(
        url,
        { headers: { "User-Agent": new UserAgent().toString() } },
        (res) => {
          let rawData = "";
          res.on("data", (d) => {
            rawData += d.toString();
          });
          res.on("end", () => {
            if (rawData.includes("403")) {
              console.log(`IP restricted.`, rawData);
              resolve({ result: "error", data: "" });
            } else {
              sleep(interval);
              resolve({ result: "success", data: rawData });
            }
          });
        }
      )
      .on("error", (e) => {
        console.log("error", e);
        resolve("");
      });
  });
};

const randomNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = (maxInterval) => {
  let now = new Date();
  const interval = randomNum(maxInterval, 1500);
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
  if (!urls.includes(url)) {
    urls.push(url);
    fs.writeFileSync(path, urls.join("\n"));
    console.log(`${url} Recorded.`);
  }
};
