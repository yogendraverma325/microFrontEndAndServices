import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config.js";
import {connectionWithDB} from "./src/config/db.js";
import {productUiroutes } from './src/api/routes/product.js';
import {connectKafaka, ProduceProducts } from './src/kafka/product.producer.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { sharedStore } from './src/api/services/sharedStore.js';
import flash from 'connect-flash';
///redis setup
import redis from 'redis';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { RedisStore } = require('connect-redis'); // Correct for v6+ CommonJS
const redisClient = redis.createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
  password: undefined, // or set if you have password
  database: 0,
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT;

const initilize = () => {
  connectionWithDB();
  const app = express();
  start(app);
}


const start = (app) => {
  dataMiddleware(app);
  standardMiddleware(app);
  //secutiryMiddleware(app);
  routeMiddleware(app);
 // startConsumeAndProducer(); // adding consumer and producer function call
  //connectWithRedis(); // connect with redis
  startServer(app);
}
const standardMiddleware = (app) => {
  // Views
   app.set("views", path.join(__dirname, "src", "views"));
   app.set("view engine", "ejs");
   app.use(express.static(path.join(process.cwd(), '/src/public')));
   // ✅ Must be before routes: parse form-data and JSON
   app.use(express.urlencoded({ extended: true })); // for form-data
}
const dataMiddleware = (app) => {
  app.use(cookieParser());
   app.use(session({
    store: new RedisStore({ client: redisClient }),
   secret: 'sharedSecret',
   resave: false,
   saveUninitialized: false,
  cookie: { secure: false, maxAge: 10 * 365 * 24 * 60 * 60 * 1000  } // 10 years
   }));
  app.use(flash());
  app.use(async (req, res, next) => {
    // Store cart data globally (if exists)
    if (req.cookies?.userCart) {
      console.log("hello")
    sharedStore.setCart('cart', req.cookies.userCart);
    }
    res.locals.cart = sharedStore.getCart('cart'); // for EJS/templates
    // Attach flash + user info to locals (for EJS)
    res.locals.flashMessage = req.flash('message') || null;
    res.locals.user = null;
    res.locals.cartList = [];
    next();
  });
}
const secutiryMiddleware = (app) => {

}
const routeMiddleware = (app) => {
  app.use('', productUiroutes());
}

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`Prodcut service running on http://localhost:${PORT}`, sharedStore.getCart('cart'));
  });
}
const startConsumeAndProducer = async () => {
  await connectKafaka();
  await ProduceProducts();
}

initilize();


