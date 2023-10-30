import { DBHelper } from "./utils.js";
const url = "5987479";
const DB = new DBHelper();
await DB.runSQL(`delete from t_topic where url like "%${url}%"`);
