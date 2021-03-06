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
    const search = await Product.find(filters)
      .populate("category")
      .populate("reviews");
    if (req.query.sort === "price.asc") {
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      search.sort({ price: -1 });
    }
    if (req.query.sort === "rating.asc") {
      search.sort({ averageRating: 1 });
    } else if (req.query.sort === "rating-desc") {
      search.sort({ averageRating: -1 });
    }
    //pagination
    if (req.query.page) {
      const limit = 3;
      const page = req.query.page;
      search.limit(limit).skip(limit * (page - 1));
    }
    res.json({
      count: search.length,
      products: search
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/* cRud --> Read one no need for me moment */
// router.get(`/product/:id`, async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

/* crUd --> Update one */

router.put("/product/:id/update", async (req, res) => {
  try {
    if (!req.params.id) res.send("missing id");
    else {
      const productToUpdate = await Product.findById(req.params.id);
      if (req.fields.title) productToUpdate.title = req.fields.title;
      if (req.fields.description)
        productToUpdate.description = req.fields.description;
      if (req.fields.price) productToUpdate.price = req.fields.price;
      if (req.fields.category) productToUpdate.category = req.fields.category;
      await productToUpdate.save();
      console.log(productToUpdate);
      const result = await Product.findById(req.params.id);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cruD --> Delete one */

router.delete(`/product/delete`, async (req, res) => {
  try {
    if (!req.params.id) res.send("missing id");
    else {
      const productToDelete = await Product.findById(req.params.id);
      productToDelete.remove();
      res.send("product removed");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
