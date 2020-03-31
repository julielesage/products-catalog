const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User");

/* Crud --> Create */

router.post("/user/create", async (req, res) => {
  try {
    const unique = await User.find({ email: req.fields.email });
    if (!(req.fields.username && req.fields.email))
      res.json({ message: "le formulaire n'est pas totalement rempli" });
    else if (unique.length !== 0)
      res.json({ message: "cet email est déjà utilisé" });
    else {
      const newUser = new User({
        email: req.fields.email,
        username: req.fields.username
      });
      await newUser.save();
      const result = await User.find({ _id: newUser._id });
      res.json(result);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

/* cRud : Read */

router.get("/user/:id", async (req, res) => {
  try {
    if (!req.params.id) res.json({ message: "missing id" });
    else {
      const userToGet = await User.findById(req.params.id);
      res.json(userToGet);
    }
  } catch (e) {
    res.json({ error: error.message });
  }
});

/* crUd : Update */

router.put("/user/:id/update", async (req, res) => {
  try {
    if (!req.params.id) res.send("missing id");
    else {
      const userToUpdate = await User.findById(req.params.id);
      if (req.fields.username) userToUpdate.username = req.fields.username;
      if (req.fields.email) userToUpdate.email = req.fields.email;
      await userToUpdate.save();
      const result = await User.findById(req.params.id);
      res.json(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("user/:id/delete", async (req, res) => {
  if (!req.params.id) res.send("missing id");
  else {
    const userToDelete = await User.findById(req.params.id);
    await userToDelete.remove();
    res.json("user deleted");
  }
});

module.exports = router;
