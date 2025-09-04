import ProductController from '../controller/product.js';
import express from 'express';


const router = express.Router();

const  Uiroutes=() =>{
router.get('/detail/:id', ProductController.details);
router.get('/list', ProductController.list);
return router;
}

export {Uiroutes as productUiroutes};
