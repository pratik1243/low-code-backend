const mongoose = require("mongoose");

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
  break_point: {
    type: String,
    require: true,
  },
  request_user_id: {
    type: String,
    require: true,
  },
});

module.exports = new mongoose.model("Create_Page", pageSchema, "Create_Page");