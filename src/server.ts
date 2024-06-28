import dotenv from "dotenv";
import path from 'path';
import { createApp } from "./app/app";
import DatabaseConnector from "./database/DatabaseConnector";

const startServer = async () => {
  console.log("__dirname: ", __dirname);
  // console.log(path.resolve(__dirname, './.env'));
  // dotenv.config({ path: path.resolve(__dirname, './.env') });
  dotenv.config();
  console.log("process.env: ", process.env);
  console.log("JWT_SECRET: ", process.env.JWT_SECRET);

  const databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect();
  const app = await createApp(connection);
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log("Server started on port: ", port);
  });
}

startServer();

