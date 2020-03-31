const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");

/* Crud --> Create */

router.post("/review/create", async (req, res) => {
  try {
    if (
      !(
        req.fields.product &&
        req.fields.rating &&
        req.fields.comment &&
        req.fields.user
      )
    )
      res.send("info missing");
    else {
      const newReview = new Review({
        rating: req.fields.rating,
        comment: req.fields.comment,
        user: req.fields.user
      });
      await newReview.save();
      const productToUpdate = await Product.findById(req.fields.product);
      if (productToUpdate.reviews === undefined) {
        product.reviews = [];
      }
      productToUpdate.reviews.push(newReview);
      let averageRating = 0;
      if (productToUpdate.averageRating !== undefined)
        averageRating = productToUpdate.averageRating;
      averageRating =
        (averageRating * (productToUpdate.reviews.length - 1) +
          req.fields.rating) /
        productToUpdate.reviews.length;
      productToUpdate.averageRating = Math.round(averageRating);
      console.log(averageRating);

      await productToUpdate.save();

      const result = await Product.findById(req.fields.product);
      res.json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
