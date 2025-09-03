
import {productservice} from '../services/productService.js';

const gethotProducts =async (req,res) => {
let data=await productservice.hotProducts();
res.status(200).json({ message: 'Hot Products', data });
}
const getnewArrivals =async (req,res) => {
let data=await productservice.newArrivals();
res.status(200).json({ message: 'New Arrivals', data });
}

const ProductController = {
  gethotProducts,
  getnewArrivals
};
export default ProductController;