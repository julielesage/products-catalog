const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

router.post("/department/create", async (req, res) => {
  try {
    if (!req.fields.title) {
      res.send("missing title");
    } else {
      const newDepartment = new Department({
        title: req.fields.title
      });

      await newDepartment.save();
      const result = await Department.find({ _id: newDepartment._id });

      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read all with all inside */

router.get("/departments/with-count", async (req, res) => {
  try {
    const departments = await Department.find();
    // voir pour double populate !
    if (departments.length === 0)
      res.json({ message: "There is no departments yet" });
    else
      for (let i = 0; i < departments.length; i++) {
        const categories = await Category.find({
          department: departments[i]._id
        });
        departments[i].categories = categories;
        for (let j = 0; j < categories.length; j++) {
          const products = await Product.find({ category: categories[j]._id });
          departments[i].categories[j].products = products;
        }
      }
    res.json({
      count: departments.length,
      departments: departments
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read one */
router.get("/department/:id", async (req, res) => {});

/* crUd --> Update one */

router.put("/department/:id/update", async (req, res) => {
  try {
    if (!req.params.id) res.json({ error: "missing id" });
    else if (!req.fields.title) res.json({ message: "missing title" });
    else {
      const departmentToUpdate = await Department.findById(req.params.id);
      departmentToUpdate.title = req.fields.title;
      await departmentToUpdate.save();
      const result = await Department.findById(req.params.id);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cruD --> Delete one */
router.delete("/department/:id/delete", async (req, res) => {
  try {
    if (!req.params.id) res.json({ error: "missing id" });
    else {
      const categories = await Category.find({ department: req.params.id });
      categories.forEach(async category => {
        await Product.remove({ category: category._id });
      });
      await Category.remove({ department: req.params.id });
      const departmentToDelete = await Department.findById(req.params.id);
      await departmentToDelete.remove();
      res.send("department and all deleted");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
