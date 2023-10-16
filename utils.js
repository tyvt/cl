import https from "https";
import http from "http";
import fs from "fs";
import UserAgent from "user-agents";
import initSqlJs from "sql.js";

export class TimerHelper {
  constructor() {
    this.startTime = Date.now();
  }
  getDuration() {
    const endTime = Date.now();
    return endTime - this.startTime;
  }
}

export class DBHelper {
  constructor(DBPath = "./db/cl-crawler.sqlite") {
    this.DBBuffer = fs.readFileSync(DBPath);
    this.DB = null;
  }
  async initDB() {
    console.log("init DB");
    const SQL = await initSqlJs();
    this.DB = new SQL.Database(this.DBBuffer);
  }
  prepareData(tableName, obj) {
    if (this.DB) {
      const sql = `INSERT OR IGNORE INTO ${tableName} (${Object.keys(
        obj
      ).join()}) VALUES (${Object.values(obj).join()})`;
      return this.DB.prepare(sql);
    }
  }
  setDB = () => {
    if (this.DB) {
      const arr = this.DB.export();
      this.DB.close();
      const buffer = Buffer.from(arr);
      fs.writeFileSync("./db/cl-crawler.sqlite", buffer);
      console.log(`Write DB success.`);
    }
  };
  async runSQL(sql) {
    if (this.DB) {
      const result = this.DB.exec(sql);
      return result;
    }
  }
}

export const request = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    console.log(
      `Fetch ${url}, ${new Date(Date.now()).toLocaleDateString()} ${new Date(
        Date.now()
      ).toLocaleTimeString()}`
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
            if (rawData.includes("Forbidden")) {
              console.log(rawData);
              resolve({ result: "error", data: "403 Forbidden" });
            }
            resolve({ result: "success", data: rawData });
          });
        }
      )
      .on("error", (e) => {
        console.log("error", e);
        resolve({ result: "error", data: "" });
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
