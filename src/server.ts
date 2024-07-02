import dotenv from "dotenv";
import { createApp } from "./app/app";
import DatabaseConnector from "./database/DatabaseConnector";

const startServer = async () => {
  dotenv.config();
  console.log(process.env.JWT_SECRET);

  const databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect();
  const app = await createApp(connection);
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log("Server started on port: ", port);
  });
}

startServer();

