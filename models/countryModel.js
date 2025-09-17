const mongoose = require("mongoose");

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

module.exports = new mongoose.model("Countries_List", countrySchema, "Countries_List");