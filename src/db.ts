import mongoose from "mongoose";
import config from "./config";

async function initDB(): Promise<void> {
  const { user, password, host, port, db } = config.mongo;

  const url = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`;
  const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(url, options);
    console.log("Mongo connected");
  } catch (e) {
    console.log(e);
  }
}

export default initDB;
