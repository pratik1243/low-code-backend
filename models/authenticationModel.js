const mongoose = require("mongoose");

const authenticationSchema = new mongoose.Schema({
  full_name: {
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

module.exports = new mongoose.model("users-data", authenticationSchema, "users-data");