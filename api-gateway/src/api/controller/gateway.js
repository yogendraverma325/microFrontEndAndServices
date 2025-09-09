
import axios from 'axios';
import {genericStore} from '../service/generic.js';
import {sendDataToCart} from "../../kafka/gateway-producer.js";
let cachedHeader = "";
let cachedFooter = "";
async function fetchView(url) {
    const res = await axios.get(url);
    return res.data;
  } 
async function loadCommonViews() {
  if (!cachedHeader) {
    cachedHeader = await fetchView(`${process.env.HOME_SERVICE_URL}/header`);
  }
  if (!cachedFooter) {
    cachedFooter = await fetchView(`${process.env.HOME_SERVICE_URL}/footer`);
  }
}

const home =async (req,res) => {
  let content=''
    try {
    await loadCommonViews();
    content = await fetchView(`${process.env.HOME_SERVICE_URL}/home`);
    }  catch (error) {
    content = '<p>Home service is currently unavailable.</p>';
    }
res.render("layout", { cachedHeader, content, cachedFooter,"title"  :"Home Page","description":"This is the home page description" });

}

const contact =async (req,res) => {
  let content=''
  try {
    await loadCommonViews();
     content = await fetchView(`${process.env.HOME_SERVICE_URL}/contact`);
  }  catch (error) {
    content = '<p>Home service is currently unavailable.</p>';
  }
  res.render("layout", { cachedHeader, content, cachedFooter ,"title"  :"Contact Page","description":"This is the contact page description"});
}

const products =async (req,res) => {
    let filters = req.query || {};
    let content =''
    try {
    await loadCommonViews();
      content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/list?`+new URLSearchParams(filters).toString());
      }  catch (error) {
        content = '<p>Home service is currently unavailable.</p>';
      }
      res.render("layout", { cachedHeader, content, cachedFooter , "title"  :"Products Page","description":"This is the products page description"});
 
}
const productdetails =async (req,res) => {
  let content=''
  try {
  console.log("Product ID:", req.params.id); // Log the product ID
    await loadCommonViews();
    content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/detail/${req.params.id}`);
   
  }  catch (error) {
    content = '<p>Home service is currently unavailable.</p>';
  }
  res.render("layout", { cachedHeader, content, cachedFooter, "title"  :"Product Detail Page","description":"This is the product detail page description"});
}
const addToCart = async (req, res) => {
  let CART_ID=genericStore.get('cart').UserCart || null;
  let PRODUCT_ID=req.body.productAutoId;
  let QTY=1;
  let METHOD='ADD'
  const backURL = req.get('referer') || '/'; // fallback to home page if referer is missing
  req.flash('message', JSON.stringify({ type: 'success', text: 'Item added!' }));
  await sendDataToCart(CART_ID,PRODUCT_ID,METHOD,QTY);
  //error, success
  //req.flash('message', JSON.stringify({ type: 'error', text: 'Failed to add item to cart!' }));
  res.redirect(backURL);

 
}

const GatewayController = {
home,
contact,
products,
productdetails,
addToCart
};
export default GatewayController;