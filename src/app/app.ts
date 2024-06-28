import express from "express";
import bodyParser from "body-parser";
import AuthRouter from "../routes/AuthRouter";
import UserDatabase from "../database/users/UserDatabase";
import { Connection } from "mongoose";

export const createApp = async (databaseConnection: Connection) => {
    const app = express();
    const database = new UserDatabase(databaseConnection);
    const authRouter = new AuthRouter(database);

    app.use(bodyParser.json());
    app.use("/", authRouter.getRouter());

    return app;
}