const express = require(`express`);
const router = express.Router();
const Product = require(`../models/Product`);

/* Crud --> Create one */
router.post(`/product/create`, async (req, res) => {
  try {
    if (
      req.fields.title &&
      req.fields.description &&
      req.fields.price &&
      req.fields.category
    ) {
      const newProduct = new Product({
        title: req.fields.title,
        description: req.fields.description,
        price: req.fields.price,
        category: req.fields.category
      });
      await newProduct.save();
      const result = await Product.findById(newProduct._id);
      res.json(result);
    } else res.json({ error: "mising information" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read all */

const createFilters = req => {
  const filters = {};
  if (req.query.category) {
    filters.category = req.query.category;
  }
  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }
  if (req.query.priceMin) {
    filters.price = {};
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    if (filters.price === undefined) filters.price = {};
    filters.price.$lte = req.query.priceMax;
  }
  return filters;
};

router.get(`/products/with-count`, async (req, res) => {
  try {
    const filters = createFilters(req);
    const search = await Product.find(filters).populate("category");
    if (req.query.sort === "price.asc") {
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      search.sort({ price: -1 });
    }
    res.json({
      count: search.length,
      products: search
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* cRud --> Read one */
router.get(`/product/:id`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* crUd --> Update one */
router.put(`/product/:id/update`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* cruD --> Delete one */
router.delete(`/product/delete`, async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
