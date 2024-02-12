import https from "https"
import http from "http"
import fs from "fs"
import UserAgent from "./packages/user-agents.cjs"
// import { HttpsProxyAgent } from 'https-proxy-agent'
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
    if (!arr.length) return
    let sql = `INSERT OR IGNORE INTO ${tableName} VALUES (${Object.keys(arr[0]).map(e => `$${e}`).join()})`
    const DB = await this.initDB()
    arr.forEach(e => {
      const obj = {}
      Object.keys(e).forEach(k => {
        obj[`$${k}`] = e[k]
      })
      DB.exec(sql, obj)
    })
    const result = DB.export()
    const buffer = Buffer.from(result)
    fs.writeFileSync("./db/cl-crawler.sqlite", buffer)
    DB.close()
  }
  async update(tableName, data, condition) {
    let sql = `UPDATE ${tableName} SET ${Object.keys(data).map(e => `${e}=$${e}`).join()} where ${condition}`
    const DB = await this.initDB()
    const obj = {}
    Object.keys(data).forEach(k => {
      obj[`$${k}`] = data[k]
    })
    DB.exec(sql, obj)
    const result = DB.export()
    const buffer = Buffer.from(result)
    fs.writeFileSync("./db/cl-crawler.sqlite", buffer)
    DB.close()
  }
  async runSQL(sql, options) {
    const DB = await this.initDB()
    return new Promise((resolve, reject) => {
      const result = DB.exec(sql, options)
      const arr = DB.export()
      const buffer = Buffer.from(arr)
      fs.writeFileSync("./db/cl-crawler.sqlite", buffer)
      DB.close()
      resolve(result)
    })
  }
}

async function getProxyIp() {
  const res = await get(`http://demo.spiderpy.cn/get/?type=https`, { noProxy: true })
  console.log('res: ', res)
  if (JSON.parse(res.data).proxy) {
    writeUrlToFilePath(
      JSON.parse(res.data).proxy,
      `./urls/proxy.txt`
    )
  }
  return '140.249.88.236:80'
}

export const get = async (url, config) => {
  const requestConfig = {
    headers: {
      "user-agent": new UserAgent().toString(),
    }
  }
  // if (Boolean(config?.noProxy) === false) {
  //   const proxy = await getProxyIp()
  //   console.log('proxy: ', proxy)
  //   if (proxy) {
  //     requestConfig.agent = new HttpsProxyAgent(`http://${proxy}`)
  //   }
  // }
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
        requestConfig,
        (res) => {
          console.log('statusCode: ', res.statusCode)
          if (res.statusCode == '302') {
            console.log('res: ', res)
            resolve({ result: "error", data: res })
            // get(url, requestConfig)
          } else {
            let rawData = ""
            res.on("data", (d) => {
              rawData += d.toString()
            })
            res.on("end", () => {
              resolve({ result: "success", data: rawData })
            })
          }
        }
      )
      .on("error", (e) => {
        console.log("error", e)
        resolve({ result: "error", data: "" })
      })
  })
}

export const request = (options, data) => {
  const url = new URL(options.url)
  options.hostname = url.host
  options.path = url.pathname + url.search
  options.headers = {
    "Content-Type": "application/json",
    "content-length": Buffer.byteLength(data)
  }
  delete options.url
  return new Promise((resolve, reject) => {
    const protocol = url.protocol == 'https:' ? https : http
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
