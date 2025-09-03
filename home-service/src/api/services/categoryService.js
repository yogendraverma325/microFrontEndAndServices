import { returnDBConnection } from "../../config/db.js";
 class CategoryService {
    db=null;
    constructor() {
    this.db = returnDBConnection();
    }
async returnCategories() {
    const categories = await this.db.category.findAll({
        attributes: ["catAutoId", "categoryName", "image"],
        where: {
            isActive: 1
        }
    });
    return categories;
}
}
export const categoryService = new CategoryService(); 