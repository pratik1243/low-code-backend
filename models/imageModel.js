const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: String,
  img: Buffer,
  contentType: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users-data", required: true },
});

module.exports = mongoose.model("Images", imageSchema);
