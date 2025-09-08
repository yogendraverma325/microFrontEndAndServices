import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import { Uiroutes } from './src/api/routes/gateway.js';
import cookieParser from 'cookie-parser';
import {genericStore} from './src/api/service/generic.js';

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
  app.use(express.urlencoded({ extended: true }));   // For form data
  app.use(express.json()); 
  app.use(cookieParser());
}
const dataMiddleware = (app) => {
  app.use(async (req, res, next) => {
    if(req.cookies?.userCart){
      genericStore.set("cart",'UserCart', req.cookies.userCart);
    }
    res.locals.user = null;
    res.locals.cartList = [];
    next();
  });;
}
const secutiryMiddleware = (app) => {

}
const routeMiddleware = (app) => {
  app.use('/', Uiroutes());
}

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`API service running on change http://localhost:${PORT}`);
  });
}

initilize();


