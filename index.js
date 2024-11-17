import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoute.js";
import connectDB from './configs/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// database 
connectDB();

// Register routes without immediately invoking the function
app.use("/api/user", userRoutes);

// Error handlers - ensure these are functions, so call them if needed
app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server started! http://localhost:${PORT}`);
});
