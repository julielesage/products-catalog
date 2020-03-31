const express = require(`express`);
const router = express.Router();
const Category = require(`../models/Category`);

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
router.get(`/category/:id`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* crUd --> Update one */
router.put(`/category/:id/update`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* cruD --> Delete one */
router.delete(`/category/delete`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
