import fs from "fs";
const dirs = ["8", "16"];

const start = () => {
  dirs.forEach((dir) => {
    const path = `./pages/${dir}/`;
    const list = fs.readdirSync(path);
    const blackList = fs
      .readFileSync(`./urls/blackList.txt`, "utf-8")
      .split("\n")
      .filter((e) => e);
    list.forEach((e) => {
      const html = fs.readFileSync(`${path}${e}`, "utf-8");
      if (blackList.some((url) => html.includes(url))) {
        fs.unlinkSync(`${path}${e}`);
      }
    });
  });
};
start();
