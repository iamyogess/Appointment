import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;



app.get("/", (req, res) => {
  res.send("hello");
});

app.listen( PORT, () => {
  console.log(`Server started! http://localhost:${PORT}`);
});
