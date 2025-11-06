require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const serverless = require("serverless-http");
const authenticateToken = require("./middleware/auth");

const allowedOrigins = ["https://low-code-frontend-pi.vercel.app", "http://localhost:3000"];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

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

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.PROD_MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};
connectDB();

module.exports = app;
module.exports.handler = serverless(app);
