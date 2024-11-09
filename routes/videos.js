import { timeStamp } from "console";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Set up paths using fileURLToPath for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store videos.json
const videosFilePath = path.join(__dirname, "../data/videos.json");

// Function to read the videos from the JSON file
function readVideosFile() {
  try {
    const data = fs.readFileSync(videosFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading video files", error);
    return [];
  }
}

// Function to write data into the JSON file
function writeVideosFile(data) {
  try {
    fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to video file", error);
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
  const { title, description, image } = req.body;
  console.log("Received POST request with data:", req.body);

  // Validate the required fields
  if (!title || !description) {
    console.log("Validation failed! Title and description are required.");
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }

  // Create the new video object
  const newVideo = {
    id: uuidv4(),
    title,
    description,
    channel: "Roshani Faleel", //adding a default channel without adding a extra input feild
    views: "0", // Default views count
    likes: "0", // Default likes count
    duration: "00:00", // Placeholder duration
    image: image || "/images/Upload-video-preview.jpg", // Default image if no image is provided
    video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  console.log("New video object created:", newVideo);

  // Read current videos, add the new video, and write it back to the file
  const videos = readVideosFile();
  videos.push(newVideo);
  console.log("Saving new video to JSON file...");
  writeVideosFile(videos);

  console.log("Video successfully added!");

  // Respond with the success message and the new video data
  res
    .status(201)
    .json({ message: "Video added successfully", video: newVideo });
});

//Adding new comments
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const name = "Anonymous"; //as we dont have a input feild for name
  const videos = readVideosFile();
  const video = videos.find((video) => video.id === id);

  if (!comment) {
    return res.status(400).json({ error: "Comment is required" });
  }

  //creating a new comment object
  const newComment = {
    id: uuidv4(),
    name,
    comment,
    likes: 0, //default
    timestamp: Date.now(),
  };
  console.log("New comment object created:", newComment);
  video.comments.push(newComment);

  writeVideosFile(videos);
  res
    .status(201)
    .json({ message: "Comment added successfully", comment: newComment });
});

//Deleting comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const { videoId, commentId } = req.params;
  console.log(
    "Received request to delete comment:",
    commentId,
    "for video:",
    videoId
  );
  const videos = readVideosFile();
  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found." });
  }

  //finding and removing comments by comment ID
  const commentIndex = video.comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) {
    return res.status(404).json({ error: "comment not found" });
  }

  // removing the comment
  video.comments.splice(commentIndex, 1);
  console.log("Comment deleted successfully");
  writeVideosFile(videos);
  res.status(200).json({ message: "Comment deleted successfully" });
});

//PUT Adding a like
router.put("/:videoId/likes", (req, res) => {
  const { videoId } = req.params;
  const videos = readVideosFile();

  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  video.likes += 1;
  writeVideosFile(videos);

  res.status(200).json(video);
});

export default router;
