import ProductController from '../controller/product.js';
import express from 'express';


const router = express.Router();
const  routes=() =>{
    console.log("Product routes initialized");
router.get('/products/hot', ProductController.gethotProducts);
router.get('/products/new', ProductController.getnewArrivals);
return router;
}

export {routes as productRoutes};
