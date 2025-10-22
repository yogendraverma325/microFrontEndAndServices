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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.APP_PORT || 3000;

const initilize = () => {
  const app = express();
  start(app);
};

const start = (app) => {
  standardMiddleware(app);
  securityMiddleware(app);
  dataMiddleware(app);
  configureProxy(app);
  routeMiddleware(app);
  startServer(app);
};

// ---------------- STANDARD MIDDLEWARE ----------------
const standardMiddleware = (app) => {
  // Set EJS view engine and static folder
  app.set("views", path.join(__dirname, "src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(process.cwd(), '/src/public')));

  // Important: body parsers (for form + JSON)
  //app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Cookies + flash messages
  app.use(cookieParser());
  app.use(flash());
};

// ---------------- SECURITY MIDDLEWARE ----------------
const securityMiddleware = (app) => {
  // Add any helmet/cors logic later if needed
};

// ---------------- DATA HANDLING MIDDLEWARE ----------------
const dataMiddleware = (app) => {
  app.use(session({
    secret: 'babyGammingZoneDev',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));

  app.use(async (req, res, next) => {
    // Store cart data globally (if exists)
    if (req.cookies?.userCart) {
      genericStore.set("cart", 'UserCart', req.cookies.userCart);
    }

    // Attach flash + user info to locals (for EJS)
    res.locals.flashMessage = req.flash('message') || null;
    res.locals.user = null;
    res.locals.cartList = [];

    next();
  });
};

// ---------------- PROXY MIDDLEWARE ----------------
const configureProxy = (app) => {
  const CART_URL = 'http://cart-service:4003';

  app.use('/cart', createProxyMiddleware({
    target: CART_URL,
    changeOrigin: true,
    pathRewrite: { '^/cart': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log("req.body",req.body)
  if (req.body && Object.keys(req.body).length) {
   const bodyData = JSON.stringify(req.body);
proxyReq.setHeader('Content-Type', 'application/json');
proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
proxyReq.write(bodyData);
proxyReq.end();
  }
}
  }));
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
