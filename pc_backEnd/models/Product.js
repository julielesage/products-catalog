const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = Product;
