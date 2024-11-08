import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));

import videosRoutes from "./routes/videos.js";
app.use("/videos", videosRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`Server is listening at ${BACKEND_URL}:${PORT}`);
});
