const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");

let cachedHeader = "";
let cachedFooter = "";

async function loadCommonViews() {
  if (!cachedHeader) {
    cachedHeader = await fetchView("http://localhost:4001/header");
  }
  if (!cachedFooter) {
    cachedFooter = await fetchView("http://localhost:4001/footer");
  }
}

async function fetchView(url) {
  const res = await axios.get(url);
  return res.data;
}

// Layout middleware
app.get("/", async (req, res) => {
  await loadCommonViews();
  const content = await fetchView("http://localhost:4001/home");
  res.render("layout", { cachedHeader, content, cachedFooter });
});

app.get("/products", async (req, res) => {
  await loadCommonViews();
  const content = await fetchView("http://localhost:4002/list");
  res.render("layout", { cachedHeader, content, cachedFooter });
});

app.get("/products/:id", async (req, res) => {
  await loadCommonViews();
  const content = await fetchView(`http://localhost:4002/detail/${req.params.id}`);
  res.render("layout", { cachedHeader, content, cachedFooter });
});

app.get("/products/:id", async (req, res) => {
  await loadCommonViews();
  const content = await fetchView(`http://localhost:4002/detail/${req.params.id}`);

  res.render("layout", { cachedHeader, content, cachedFooter });
});

app.listen(3000, () => {
  console.log("API Gateway running on http://localhost:3000");
});
