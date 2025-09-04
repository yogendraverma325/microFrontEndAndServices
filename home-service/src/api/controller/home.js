import { categoryService } from "../services/categoryService.js";
import { thirdpartyservice } from "../services/thirdparty.js";


const header =async (req,res) => {
    res.render("header");
}
const footer =async (req,res) => {
    res.render("footer");
}
const home =async (req,res) => {
        let categories = await categoryService.returnCategories();
        let hotdata=await thirdpartyservice.gethotProducts();
        let newdata=await thirdpartyservice.getnewArrivals();
        let hotProducts = hotdata;
        let newArrivals = newdata;
  res.render("home", {
    categories,
    hotProducts,
    newArrivals
  });
}

const contact =async (req,res) => {
    res.render("contact");
}


const HomeController = {
header,
footer,
home,
contact,
};
export default HomeController;