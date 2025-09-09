import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import {connectionWithDB} from "./src/config/db.js";
import {appUiroutes } from './src/api/routes/route.js';
import {connectKafaka } from './src/kafka/producer.js';
import {consumeMessage} from "./src/kafka/consumer.js";
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
  startConsumeAndProducer(); // adding consumer and producer function call
  startServer(app);
}
const standardMiddleware = (app) => {
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));
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
  app.use('', appUiroutes());
}

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`cart service running on http://localhost:${PORT}`);
  });
}
const startConsumeAndProducer = async () => {
  await connectKafaka();
  await consumeMessage();
}

initilize();


