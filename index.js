require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");
const port = 8000;
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const pageSchema = new mongoose.Schema({
  page_id: {
    type: String,
    require: true,
  },
  page_name: {
    type: String,
    require: true,
  },
  page_route: {
    type: String,
    require: true,
  },
  page_data: {
    type: Object,
    require: true,
  },
  request_user_id: {
    type: String,
    require: true,
  },
});

const countrySchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
  },
  value: {
    type: String,
    require: true,
  },
});

const authenticationSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  request_user_id: {
    type: String,
    require: true,
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const db = mongoose.connection;
const upload = multer({ storage: storage });
const PageSchemaData = new mongoose.model("Create_Page", pageSchema, "Create_Page");
const CountrySchemaData = new mongoose.model("Countries_List", countrySchema, "Countries_List");
const AuthenticationSchemaData = new mongoose.model("users-data", authenticationSchema, "users-data");

db.once("open", async () => {
  console.log("MongoDB connected");
});

app.post("/register", async (req, res) => {
  try {
    const users = new AuthenticationSchemaData({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      request_user_id: req.body.request_user_id,
    });

    AuthenticationSchemaData.findOne({
      email: req.body.email,
      password: req.body.password,
    }).then(async (userExist) => {
      if (userExist) {
        res.status(500).json({ message: "User email and password already exists" });
      } else {
        await users.save();
        return res.status(200).json({ message: "User added succesfully" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    AuthenticationSchemaData.findOne({
      email: req.body.email,
      password: req.body.password,
    }).then(async (userExist) => {
      if (userExist) {
        const jsonwebtoken = jwt.sign(
          { email: req.body.email, password: req.body.password },
           process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res.status(200).json({
          message: "User login succesfully",
          responseData: {
            token: jsonwebtoken,
            request_user_id: userExist?.request_user_id,
            user_name: `${userExist?.first_name} ${userExist?.last_name}`,
          },
        });
      } else {
        return res.status(500).json({ message: "User does not exist" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/save-page", authenticateToken, async (req, res) => {
  try {
    const users = new PageSchemaData({
      page_id: req.body.page_id,
      page_name: req.body.page_name,
      page_route: req.body.page_route,
      page_data: req.body.page_data,
      request_user_id: req.body.request_user_id,
    });

    await users.save();
    return res.status(200).json({ message: "User added succesfully" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/pages-list", authenticateToken, async (req, res) => {
  try {
    const filters = {};
    if (req.body.page_id) {
      filters.page_id = req.body.page_id;
    }
    if (req.body.page_route) {
      filters.page_route = req.body.page_route;
    }
    if (req.body.request_user_id) {
      filters.request_user_id = req.body.request_user_id;
    }
    const users = await PageSchemaData.find(filters);
    return res.status(200).json({
      message: "Page Fetched Successfully",
      responseData: users,
    });
  } catch (err) {
    console.log("errerr", err);
    return res.status(500).json({ error: "server error" });
  }
});

app.get("/countries-list", authenticateToken, async (req, res) => {
  try {
    const countries = await CountrySchemaData.find();
    return res.status(200).json({
      message: "Countries Fetched Successfully",
      responseData: countries,
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

app.post("/edit-page", authenticateToken, async (req, res) => {
  try {
    await PageSchemaData.updateOne(
      { _id: req.body.id },
      { $set: req.body.datas }
    );
    if (!req.body.id || !req.body.datas) {
      return res.status(400).json({ message: "Missing ID or data" });
    }
    return res.status(200).json({
      message: "Page Edited Successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

app.post("/upload-image", authenticateToken, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({ message: "File uploaded successfully", imageUrl });
  }
);

app.get("/collections/:name", authenticateToken, async (req, res) => {
  try {
    const collectionName = req.params.name;
    const collection = mongoose.connection.db.collection(collectionName);
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/create-collection", authenticateToken, async (req, res) => {
  try {
    const { collectionName } = req.body;
    const db = mongoose.connection.db;
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();
    if (!collectionName) {
      return res.status(500).json({ error: "collectionName is required" });
    }
    if (collections.length > 0) {
      return res.status(500).json({ error: `Collection '${collectionName}' already exists` });
    }
    await db.createCollection(collectionName);
    res.json({
      message: `Collection '${collectionName}' created successfully`,
    });
  } catch (err) {
    console.error("Error creating collection:", err);
    res.status(500).json({ error: err.message });
  }
});

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

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
