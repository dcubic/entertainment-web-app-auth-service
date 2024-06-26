import dotenv from "dotenv";
import app from "./app/app";

const port = process.env.PORT || 4000;
dotenv.config();

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
