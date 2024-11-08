import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosFilePath = path.join(__dirname, "../data/videos.json");

// Function to read the videos in JSON
function readVideosFile() {
  try {
    const data = fs.readFileSync(videosFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading video files", error);
    return [];
  }
}

// Function to write data in JSON
function writeVideosFile(data) {
  try {
    fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("Error writing video file", error);
  }
}

// GET /videos route to get all videos
router.get("/", (req, res) => {
  const videos = readVideosFile();
  res.json(videos);
});

// GET /videos/:id route to get a specific video by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const videos = readVideosFile();
  const video = videos.find((video) => video.id === id);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }
  res.json(video);
});

// POST /videos route to add a new video
router.post("/", (req, res) => {
  const { title, description } = req.body;
  console.log("Received POST req wih data", req.body);

  if (!title || !description) {
    console.log("Validation failed!Title and description are required");
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }

  const newVideo = {
    id: uuidv4(),
    title,
    description,
    thumbnail: "server/public/images/Upload-video-preview.jpg",
    createdAt: new Date().toISOString(),
  };

  console.log("New video object created ;", newVideo);

  const videos = readVideosFile();
  videos.push(newVideo);
  console.log("Saving new video to JSON file");
  writeVideosFile(videos);

  console.log("Video successfully added!");
  res
    .status(201)
    .json({ message: "Video added successfully", video: newVideo });
});

export default router;
