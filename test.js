import { insertData, runSQL } from "./utils.js";
import { CATEGORIES } from "./constant.js";
// const DB = await getDB();
// const data = await runSQL("select * from t_channel");
// console.log("data: ", data[0].values);
for await (const category of CATEGORIES) {
  await insertData("t_channel", {
    fid: category.fid,
    name: `'${category.description}'`,
    create_time: Date.now(),
    update_time: Date.now(),
    remark: `'remark'`,
  });
}
