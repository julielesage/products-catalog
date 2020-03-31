const express = require(`express`);
const router = express.Router();
const Category = require(`../models/Category`);
const Product = require("../models/Product");

/* Crud --> Create one */
router.post("/category/create", async (req, res) => {
  try {
    if (req.fields.title && req.fields.description && req.fields.department) {
      const newCategory = new Category({
        title: req.fields.title,
        description: req.fields.description,
        department: req.fields.department
      });
      await newCategory.save();
      const result = await Category.findById(newCategory._id);
      res.json(result);
    } else res.json({ error: "missing information" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read all */

router.get(`/categories/with-count`, async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.json({
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read one */
// router.get(`/category/:id`, async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

/* crUd --> Update one */
router.put(`/category/:id/update`, async (req, res) => {
  try {
    if (!req.params.id) res.send("missing id");
    else {
      const categoryToUpdate = await Category.findById(req.params.id);
      if (req.fields.title) categoryToUpdate.title = req.fields.title;
      if (req.fields.description)
        categoryToUpdate.description = req.fields.description;
      if (req.fields.department)
        categoryToUpdate.department = req.fields.department;
      await categoryToUpdate.save();
      const result = await Category.findById(req.params.id);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cruD --> Delete one */
router.delete(`/category/:id/delete`, async (req, res) => {
  try {
    if (!req.params.id) res.send("missing id");
    else {
      await Product.remove({ category: req.params.id });

      const categoryToDelete = await Category.findById(req.params.id);
      await categoryToDelete.remove();
      const products = await Product.find();
      res.send(products);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
