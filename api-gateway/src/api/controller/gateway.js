
import axios from 'axios';
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
    await loadCommonViews();
    const content = await fetchView(`${process.env.HOME_SERVICE_URL}/home`);
    res.render("layout", { cachedHeader, content, cachedFooter,"title"  :"Home Page","description":"This is the home page description" });
}

const contact =async (req,res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.HOME_SERVICE_URL}/contact`);
    res.render("layout", { cachedHeader, content, cachedFooter ,"title"  :"Contact Page","description":"This is the contact page description"});
}

const products =async (req,res) => {
    let filters = req.query || {};
    await loadCommonViews();
    const content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/list?`+new URLSearchParams(filters).toString());
    res.render("layout", { cachedHeader, content, cachedFooter , "title"  :"Products Page","description":"This is the products page description"});
 
}
const productdetails =async (req,res) => {
    await loadCommonViews();
    const content = await fetchView(`${process.env.PRODUCT_SERVICE_URL}/detail/${req.params.id}`);
    res.render("layout", { cachedHeader, content, cachedFooter, "title"  :"Product Detail Page","description":"This is the product detail page description"});
}
const GatewayController = {
home,
contact,
products,
productdetails
};
export default GatewayController;