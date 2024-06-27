import express from "express";
import bodyParser from "body-parser";
import AuthRouter from "../routes/AuthRouter";
import { createDatabaseConnection } from "../database/DatabaseConnector";
import UserDatabase from "../database/users/UserDatabase";

const databaseConnection = createDatabaseConnection().then((connection) => {
    const database = new UserDatabase(connection.Connection)
})
const database = new UserDatabase(databaseConnection.Connection);
const authRouter = new AuthRouter()

const app = express();
app.use(bodyParser.json());
app.use("/", authRouter);

export default app;
