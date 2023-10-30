import { request } from "./utils.js";
import fs from "fs";
const html = fs.readFileSync("./pages/16/5988517.html", "utf-8");
const urlList = html.match(/(?<=src=').*?(?=')/g) || [];
urlList.slice(0, 1).forEach((e) => {
  request(e).then(({ result, data }) => {
    const base64 = Buffer.from(data, "binary").toString("base64");
    fs.writeFileSync(
      "./pages/16/5988517.html",
      html.replace(e, `data:image/png;base64,${base64.replace(/\s/g, "")}`)
    );
  });
});
