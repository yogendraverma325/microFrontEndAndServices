import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import querystring from 'querystring';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import "dotenv/config.js";
import { Uiroutes } from './src/api/routes/gateway.js';
import { genericStore } from './src/api/service/generic.js';
import http from "http";
import { getSocketServer } from "./src/websocket/socketServer.js";
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
///redis setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT || 3000;

const initilize = () => {
  const app = express();
  start(app);
};

const start = (app) => {
  dataMiddleware(app);

  configureProxy(app);
  securityMiddleware(app);
  standardMiddleware(app);
  routeMiddleware(app);
  startServer(app);
};

// ---------------- STANDARD MIDDLEWARE ----------------
const standardMiddleware = (app) => {
  // Set EJS view engine and static folder
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));
  app.use(express.urlencoded({ extended: true }));
  // Cookies + flash messages

  
};

// ---------------- SECURITY MIDDLEWARE ----------------
const securityMiddleware = (app) => {
  // Add any helmet/cors logic later if needed
};

// ---------------- DATA HANDLING MIDDLEWARE ----------------
const dataMiddleware = (app) => {
  app.use(session({
   store: new RedisStore({ client: redisClient }),
  secret: 'sharedSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 10 * 365 * 24 * 60 * 60 * 1000  } // 10 years
  }));
  app.use(flash());
  app.use(cookieParser());
  app.use(async (req, res, next) => {
    let cart=null;
    // Store cart data globally (if exists)
    if (req.cookies?.userCart) {
    cart= req.cookies.userCart;
    }
    // Attach flash + user info to locals (for EJS)
    res.locals.flashMessage = req.flash('message') || null;
    res.locals.user = null;
    res.locals.cartList = [];
    res.locals.cart = cart;
    next();
  });
};

// ---------------- PROXY MIDDLEWARE ----------------
const configureProxy = (app) => {
  const CART_URL = 'http://cart-service:4003';

  app.use(
  "/api/cart",
  createProxyMiddleware({
    target:CART_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/cart": "/cart/addToCart" },
  })
);
};

// ---------------- ROUTES ----------------
const routeMiddleware = (app) => {
  app.use('/', Uiroutes());
};

// ---------------- SERVER START ----------------
const startServer = (app) => {
  const server = http.createServer(app);
  const socketServer = getSocketServer(server);
  socketServer.init();

  server.listen(PORT, () => {
    console.log(`✅ API Gateway running on http://localhost:${PORT}`);
  });
};

initilize();
