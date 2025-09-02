const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/header", (req, res) => {
  res.render("header");
});

app.get("/footer", (req, res) => {
  res.render("footer");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.listen(4001, () => console.log("Home service running on http://localhost:4001"));
