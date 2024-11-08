import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosFilePath = path.join(__dirname, "../data/videos.json");

//function to read the videos in json
function readVideosFile() {
  try {
    const data = fs.readFileSync(videosFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading video files", error);
    return [];
  }
}

//function to write data in json
function writeVideosFile() {
  try {
    fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2)); //the parameters after data control how the JSON is formatted when it’s turned into a string
  } catch (error) {
    console.log("Error writing video file", error);
  }
}
router
  .route("/")
  //GET route to get videos
  .get((req, res) => {
    const videos = readVideosFile();
    res.json(videos);
  })
  //POST route to add video
  .post((req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
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

    const videos = readVideosFile();
    videos.push(newVideo);
    writeVideosFile(videos);

    res
      .status(201)
      .json({ message: "Video added successfully", video: newVideo });
  });

export default router;
