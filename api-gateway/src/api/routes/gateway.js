import GatewayController from '../controller/gateway.js';
import express from 'express';

const router = express.Router();

const  Uiroutes=() =>{
router.get('/', GatewayController.home);
router.get('/contact', GatewayController.contact);
router.get('/products', GatewayController.products);
router.get('/product-details/:id', GatewayController.productdetails);
return router;
}

export {Uiroutes};
