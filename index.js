require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
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
} = require("./controllers/controller");

app.post("/register", register);

app.post("/login", login);

app.post("/save-page", authenticateToken, createPage);

app.post("/pages-list", authenticateToken, pageList);

app.post("/get-icons", authenticateToken, getIcons);

app.get("/countries-list", authenticateToken, countriesList);

app.post("/edit-page", authenticateToken, editPage);

mongoose
  .connect("mongodb://127.0.0.1:27017/Low_Code_Portal", {
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
