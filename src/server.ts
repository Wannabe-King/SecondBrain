import express from "express";
import { userRouter } from "./routes/user";
import mongoose from "mongoose";
import "dotenv/config";
import { contentRouter } from "./routes/content";
import { shareRouter } from "./routes/share";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", shareRouter);

mongoose.connect(process.env.MONGO_URL!).then(() => console.log("Connected!"));

app.listen(5000, () => console.log("Server running"));
