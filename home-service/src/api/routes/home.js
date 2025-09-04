import HomeController from '../controller/home.js';
import express from 'express';

const router = express.Router();

const  Uiroutes=() =>{
router.get('/header', HomeController.header);
router.get('/footer', HomeController.footer);
router.get('/home', HomeController.home);
router.get('/contact', HomeController.contact);
return router;
}

export {Uiroutes};
