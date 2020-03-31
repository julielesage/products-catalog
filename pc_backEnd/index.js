require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const server = express();
server.use(formidableMiddleware());

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const departmentsRoutes = require("./routes/departments");
server.use(departmentsRoutes);
const categoriesRoutes = require("./routes/categories");
server.use(categoriesRoutes);
const productsRoutes = require("./routes/products");
server.use(productsRoutes);

server.get("/", function(req, res) {
  res.send("welcome to Products Catalog");
});

server.all("*", res => {
  res.status(404).json({ error: "Oops, page not found :/" });
});

server.listen(4000, () => {
  console.log("server started");
});
