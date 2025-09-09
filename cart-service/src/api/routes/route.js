import AppController from '../controller/app.js';
import express from 'express';


const router = express.Router();

const  Uiroutes=() =>{
// router.get('/detail/:id', AppController.details);
// router.get('/list', AppController.list);
return router;
}

export {Uiroutes as appUiroutes};
