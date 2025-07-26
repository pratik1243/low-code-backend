require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 8000;
app.use(cors());
app.use(express.json());

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
});

const PageSchemaData = new mongoose.model(
  "Create_Page",
  pageSchema,
  "Create_Page"
);

app.post("/save-page", async (req, res) => {
  try {
    const users = new PageSchemaData({
      page_id: req.body.page_id,
      page_name: req.body.page_name,
      page_route: req.body.page_route,
      page_data: req.body.page_data,
    });

    await users.save();
    return res.status(200).json({ message: "User added succesfully" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/pages-list", async (req, res) => {
  try {
    const filters = {};
    if (req.body.page_id) {
      filters.page_id = req.body.page_id;
    }
    if (req.body.page_route) {
      filters.page_route = req.body.page_route;
    }
    const users = await PageSchemaData.find(filters);
    return res.status(200).json({
      message: "Page Fetched Successfully",
      responseData: users,
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

app.post("/edit-page", async (req, res) => {
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
