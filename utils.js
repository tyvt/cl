import https from "https"
import http from "http"
import fs from "fs"
import UserAgent from "./packages/user-agents.cjs"
import initSqlJs from "./packages/sql-wasm.cjs"
import { exec } from "child_process"
export function copyToClipboard(str) {
  exec("clip").stdin?.end(str)
}

export class TimerHelper {
  constructor() {
    this.startTime = Date.now()
  }
  getDuration() {
    const endTime = Date.now()
    return endTime - this.startTime
  }
}

export class DBHelper {
  constructor() { }
  async initDB() {
    this.DBBuffer = fs.readFileSync("./db/cl-crawler.sqlite")
    const SQL = await initSqlJs()
    return new SQL.Database(this.DBBuffer)
  }
  async insert(tableName, arr) {
    if (!Array.isArray(arr)) return
    let sql = `INSERT OR IGNORE INTO ${tableName} (${Object.keys(
      arr[0]
    ).join()}) VALUES `
    const sqlArr = arr.slice(0, 2).map((e) => {
      return `(${Object.values(e).join()})`
    })
    sql = sql.concat(`${sqlArr.join(",")}`)
    await this.runSQL(sql)
  }
  async runSQL(sql) {
    const DB = await this.initDB()
    return new Promise((resolve, reject) => {
      const result = DB.exec(sql)
      const arr = DB.export()
      const buffer = Buffer.from(arr)
      fs.writeFileSync("./db/cl-crawler.sqlite", buffer)
      DB.close()
      resolve(result)
    })
  }
}

export const request = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http
    console.log(
      `Fetch ${url}, ${new Date(Date.now()).toLocaleDateString()} ${new Date(
        Date.now()
      ).toLocaleTimeString()}`
    )
    protocol
      .get(
        url,
        { headers: { "User-Agent": new UserAgent().toString() } },
        (res) => {
          let rawData = ""
          res.on("data", (d) => {
            rawData += d.toString()
          })
          res.on("end", () => {
            resolve({ result: "success", data: rawData })
          })
        }
      )
      .on("error", (e) => {
        console.log("error", e)
        resolve({ result: "error", data: "" })
      })
  })
}

export const post = (options, data) => {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol == 'https:' ? https : http
    const req = protocol
      .request(
        options,
        (res) => {
          const chunks = []
          res.on("data", (chunk) => {
            chunks.push(chunk)
          })
          res.on("end", () => {
            const body = Buffer.concat(chunks)
            resolve({ result: "success", data: body.toString() })
          })
        }
      )
      .on("error", (e) => {
        console.log("error", e)
        resolve({ result: "error", data: "" })
      })
    req.write(data)
    req.end()
  })
}

const randomNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const sleep = (maxInterval) => {
  let now = new Date()
  const interval = randomNum(maxInterval, 1500)
  const exitTime = now.getTime() + interval
  while (true) {
    now = new Date()
    if (now.getTime() > exitTime) {
      return
    }
  }
}

export const writeUrlToFilePath = (url, path) => {
  const urls = fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .filter((e) => e)
  if (!urls.includes(url)) {
    urls.push(url)
    fs.writeFileSync(path, urls.join("\n"))
    console.log(`${url} Recorded.`)
  }
}
