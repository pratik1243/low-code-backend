require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const authenticateToken = require("./middleware/auth");
app.use(express.json());
app.use(cors());

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

// mongoose.connect(process.env.PROD_MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("connected succesfully to mongodb");
// })
// .catch(() => {
//   console.log("failed connection to mongodb");
// });

let isConnected = false;

async function connecLowCodeDB() {
  try {
    await mongoose.connect(process.env.PROD_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("connected succesfully to mongodb");
  } catch (error) {
    console.log("failed connection to mongodb");
  }
}

app.use((req, res, next) => {
  if (isConnected) {
    connecLowCodeDB();
  }
  next();
});

module.exports = app;

// app.listen(process.env.PORT, () => {
//   console.log(`server started at ${process.env.PORT}`);
// });
