import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT;

const initilize = () => { 
  const app = express();
  start(app);
}


const start = (app) => {
  standardMiddleware(app);
  secutiryMiddleware(app);
  dataMiddleware(app);
  routeMiddleware(app);
  startServer(app);
}
const standardMiddleware = (app) => {
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));
  app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.cartList = []
    next();
  });
}
const dataMiddleware = (app) => {
  app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.cartList = []
    next();
  });
}
const secutiryMiddleware = (app) => {

}
let cachedHeader = "";
let cachedFooter = "";

async function loadCommonViews() {
  if (!cachedHeader) {
    cachedHeader = await fetchView(`${process.env.HOME_SERVICE_URL}/header`);
  }
  if (!cachedFooter) {
    cachedFooter = await fetchView(`${process.env.HOME_SERVICE_URL}/footer`);
  }
}

async function fetchView(url) {
  const res = await axios.get(url);
  return res.data;
}
const routeMiddleware = (app) => {
  app.get("/", async (req, res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.HOME_SERVICE_URL}/home`);
    res.render("layout", { cachedHeader, content, cachedFooter,"title"  :"Home Page","description":"This is the home page description" });
  });
  app.get("/contact", async (req, res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.HOME_SERVICE_URL}/contact`);
    res.render("layout", { cachedHeader, content, cachedFooter ,"title"  :"Contact Page","description":"This is the contact page description"});
  });
  
  app.get("/products", async (req, res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/list`);
    res.render("layout", { cachedHeader, content, cachedFooter , "title"  :"Products Page","description":"This is the products page description"});
  });
  
  app.get("/product-details/:id", async (req, res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/detail/${req.params.id}`);
    res.render("layout", { cachedHeader, content, cachedFooter, "title"  :"Product Detail Page","description":"This is the product detail page description"});
  });
}

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`API service running on http://localhost:${PORT}`);
  });
}

initilize();


