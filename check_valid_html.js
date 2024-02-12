import fs from "fs";
const dir = `./pages/8/`;
const list = fs.readdirSync(dir);
const whiteList = fs
  .readFileSync(`./urls/whiteList.txt`, "utf-8")
  .split("\n")
  .filter((e) => e);
list.forEach((e) => {
  const html = fs.readFileSync(`${dir}${e}`, "utf-8");
  if (whiteList.every((url) => !html.includes(url))) {
    console.log(e);
  }
});
