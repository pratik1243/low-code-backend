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
  origin: ["https://low-code-frontend-delta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  const response = await handler(event, context);
  response.headers = {
    ...response.headers,
    "Access-Control-Allow-Origin": "https://low-code-frontend-delta.vercel.app",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: response.headers,
      body: "",
    };
  }
  return response;
};
