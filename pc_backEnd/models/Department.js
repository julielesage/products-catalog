const mongoose = require("mongoose");

const Department = mongoose.model("Department", {
  title: { type: String },
  categories: { type: Array }
});

module.exports = Department;
