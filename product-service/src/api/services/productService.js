import { returnDBConnection } from "../../config/db.js";
 class productService {
    db=null;
    constructor() {
    this.db = returnDBConnection();
    }
async hotProducts() {
    const hotProducts = await this.db.productSectionMapping.findAll({
        order: [["createdAt", "DESC"]],
        limit: 10,
        include: [
            {
                model: this.db.product,
                as: "sectionProducts",
                attributes: ["productAutoId", "name", "image","price","offerprice","rating","description","review"],
                where: {
                    isActive: 1
                }
            }
        ],
        where:{
            sectionId:1
        }
    });
    return hotProducts;
}
async newArrivals() {
    const newArrivals = await this.db.productSectionMapping.findAll({
        order: [["createdAt", "DESC"]],
        limit: 2,
        include: [
            {
                model: this.db.product,
                as: "sectionProducts",
                attributes: ["productAutoId", "name", "image","price","offerprice","rating","description","review"],
                where: {
                    isActive: 1
                }
            }
        ],
        where:{
            sectionId:2
        }
    });
    return newArrivals;
}
async productDetails(productId) {   
    let productDetails = await this.db.product.findOne({
		attributes: ["productAutoId", "name", "image","price","offerprice","description"],
		where: {
			productAutoId: productId,
			isActive: 1
		}
	});
	return productDetails;
}
async productList(filters) {  
console.log("filters",filters); 
    let list = await this.db.product.findOne({
		attributes: ["productAutoId", "name", "image","price","offerprice","description"],
		where: {
			isActive: 1
		},
        limit:1
	});
	return list;
}
}
export const productservice = new productService(); 