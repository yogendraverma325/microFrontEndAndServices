
import {productservice} from '../services/productService.js';

const details =async (req,res) => {
const productDetails = await productservice.productDetails(req.params.id);
res.render('productDetails', {
  title: `Blog: productDetails`,
  description: `Read about productDetails.`,
  productDetails
  });
}

const list =async (req,res) => {
  let filters = req.query || {};
const productList = await productservice.productList(filters);
res.render('productList', {
title: `Blog:productList`,
description: `Read about productList.`,
productList
});
}


const ProductController = {
  details,
  list
};
export default ProductController;