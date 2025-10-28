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
  fontsList
} = require("./controllers/controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/register", register);

app.post("/login", login);

app.post("/save-page", authenticateToken, createPage);

app.post("/pages-list", authenticateToken, pageList);

app.post("/page-data", pageData);

app.post("/get-icons", authenticateToken, getIcons);

app.post("/get-fonts", authenticateToken, fontsList);

app.get("/countries-list", authenticateToken, countriesList);

app.post("/edit-page", authenticateToken, editPage);

app.post("/upload-image", authenticateToken, upload.single("image"), uploadImage);

app.get("/image/:id", getImageById);

app.get("/get-images", authenticateToken, getImages);

mongoose.connect(process.env.PROD_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("connected succesfully to mongodb");
})
.catch(() => {
  console.log("failed connection to mongodb");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
