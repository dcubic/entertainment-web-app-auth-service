import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/authRouter';

const app = express();
app.use(bodyParser.json());
app.use('/', authRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("Server started on port: ", port);
})