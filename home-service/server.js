import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import {connectionWithDB} from "./src/config/db.js";
import {categoryService} from "./src/api/services/categoryService.js";
import {thirdpartyservice} from "./src/api/services/thirdparty.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT;

const initilize = () => {
  connectionWithDB();
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
const routeMiddleware = (app) => {
  app.get("/header", (req, res) => {
    res.render("header");
  });

  app.get("/footer", (req, res) => {
    res.render("footer");
  });

  app.get("/home",async (req, res) => {
      let categories = await categoryService.returnCategories();
      let hotdata=await thirdpartyservice.gethotProducts();
      let newdata=await thirdpartyservice.getnewArrivals();
    let hotProducts = hotdata.data;
    let newArrivals = newdata.data;
    res.render("home", {
      categories,
      hotProducts,
      newArrivals
    });
  });
  app.get("/contact", (req, res) => {
    res.render("contact");
  });
}

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`Home service running on http://localhost:${PORT}`);
  });
}

initilize();


