
import {appservice} from '../services/app.js';
const addToCart = async (req, res) => {
    console.log("req.body from cart service",req.body)
const backURL = req.get('referer') || '/'; // fallback to home page if referer is missing
res.redirect(backURL);

}
const AppController = {
addToCart
};
export default AppController;