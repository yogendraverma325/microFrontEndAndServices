import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import { Uiroutes } from './src/api/routes/gateway.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import {genericStore} from './src/api/service/generic.js';
import {connectKafaka} from "./src/kafka/gateway-producer.js";
import { getSocketServer } from "./src/websocket/socketServer.js";
import http from "http";
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
  startKafka();
  startServer(app);
}
const standardMiddleware = (app) => {
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));
  app.use(express.urlencoded({ extended: true }));   // For form data
  app.use(express.json()); 
  app.use(cookieParser());
   // Flash middleware
   app.use(flash());
}
const dataMiddleware = (app) => {
  app.use(
    session({
      secret: 'babyGammingZoneDev',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false } // Use true only with HTTPS
    })
  );

  app.use(async (req, res, next) => {
    if(req.cookies?.userCart){
      genericStore.set("cart",'UserCart', req.cookies.userCart);
    }
    let flashData =req.flash('message') || null;
    res.locals.flashMessage =flashData
    console.log( "data ",flashData)
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
    const server = http.createServer(app);
    const socketServer =  getSocketServer(server);
    socketServer.init();
    server.listen(PORT, () => {
    console.log(`API Gateway service running on change http://localhost:${PORT}`);
  });
}
const startKafka = async () => {
  //await connectKafaka();
}

initilize();


