import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//error handlers
app.use(errorResponseHandler);
app.use(invalidPathHandler);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server started! http://localhost:${PORT}`);
});
