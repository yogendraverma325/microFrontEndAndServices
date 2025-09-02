const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const products = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Mobile", price: 200 }
];

app.get("/list", (req, res) => {
  res.render("list", { products });
});

app.get("/detail/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  res.render("detail", { product });
});

app.listen(4002, () => console.log("Product service running on http://localhost:4002"));
