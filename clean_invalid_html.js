import fs from "fs";
const dir = `./pages/8/`;
const list = fs.readdirSync(dir);
const blackList = fs
  .readFileSync(`./urls/blackList.txt`, "utf-8")
  .split("\n")
  .filter((e) => e);
list.forEach((e) => {
  const html = fs.readFileSync(`${dir}${e}`, "utf-8");
  if (blackList.some((url) => html.includes(url))) {
    fs.unlinkSync(`${dir}${e}`);
  }
});
