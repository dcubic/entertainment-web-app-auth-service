import express from "express";
import bodyParser from "body-parser";
import authRouter from "../routes/AuthRouter";

const app = express();
app.use(bodyParser.json());
app.use("/", authRouter);

export default app;
