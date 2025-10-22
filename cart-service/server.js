import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import {connectionWithDB} from "./src/config/db.js";
import {appUiroutes } from './src/api/routes/route.js';
import {consumeDataSocket} from "./src/websocket/consumer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT;

const initilize = () => {
  connectionWithDB();
  const app = express();
  start(app);
};

const start = (app) => {
  standardMiddleware(app);
  routeMiddleware(app);
  startConsumeAndProducer();
  startServer(app);
};

const standardMiddleware = (app) => {
  // Views
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));

  // ✅ Must be before routes: parse form-data and JSON
   //app.use(express.urlencoded({ extended: true })); // for form-data
  app.use(express.json()); // for JSON
};

const routeMiddleware = (app) => {
  app.use('', appUiroutes());
};

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`✅ Cart Service running on http://localhost:${PORT}`);
  });
};

const startConsumeAndProducer = async () => {
  consumeDataSocket();
};

initilize();
