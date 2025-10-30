require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const serverless = require("serverless-http");
const authenticateToken = require("./middleware/auth");

app.use(express.json());
app.use(cors({
  origin: "https://low-code-frontend-delta.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const {
  createPage,
  getIcons,
  editPage,
  countriesList,
  login,
  register,
  pageList,
  uploadImage,
  getImageById,
  getImages,
  pageData,
  fontsList,
} = require("./controllers/controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/register", register);

app.post("/api/login", login);

app.post("/api/save-page", authenticateToken, createPage);

app.post("/api/pages-list", authenticateToken, pageList);

app.post("/api/page-data", pageData);

app.post("/api/get-icons", authenticateToken, getIcons);

app.post("/api/get-fonts", authenticateToken, fontsList);

app.get("/api/countries-list", authenticateToken, countriesList);

app.post("/api/edit-page", authenticateToken, editPage);

app.post("/api/upload-image", authenticateToken, upload.single("image"), uploadImage);

app.get("/api/image/:id", getImageById);

app.get("/api/get-images", authenticateToken, getImages);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.PROD_MONGO_URL);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
  }
}

connectDB();

module.exports.handler = serverless(app);
