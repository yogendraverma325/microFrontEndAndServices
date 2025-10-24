
import {appservice} from '../services/app.js';
import { sharedStore } from '../services/sharedStore.js';
const addToCart = async (req, res) => {
 const cart = sharedStore.getCart('cart');
   const backURL = req.get('referer') || '/'; // fallback to home page if referer is missing
 if(cart){
  let CART_ID=cart;
  let PRODUCT_ID=req.body.productAutoId;
  let QTY=1;
  let METHOD='ADD'
  await appservice.addToCart({ CART_ID, PRODUCT_ID, METHOD, QTY });
req.flash('message', JSON.stringify({ type: 'success', text: 'Item added into the cart' }));
 }else{
req.flash('message', JSON.stringify({ type: 'error', text: 'Cart is not initialized' }));
 }
res.redirect(backURL);
}
const AppController = {
addToCart
};
export default AppController;