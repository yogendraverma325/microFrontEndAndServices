import { returnDBConnection } from "../../config/db.js";
 class appService {
    db=null;
    constructor() {
    this.db = returnDBConnection();
    }

    async addToCart(data) {
         // data keys CART_ID, PRODUCT_ID,  METHOD, QTY
         console.log("data.CART_ID",data.CART_ID,"data.PRODUCT_ID",data.PRODUCT_ID);
        if(data.CART_ID && data.PRODUCT_ID){
            let isAlreadyInCart = await this.db.cart.findOne({
                where: {
                    userCookie: data.CART_ID,
                    productAutoId: data.PRODUCT_ID
                }
                });
                if(!isAlreadyInCart){
                    await this.db.cart.create({
                        userCookie: data.CART_ID,
                        productAutoId: data.PRODUCT_ID,
                        qty: 1
                    });
                }else{
                    await isAlreadyInCart.increment('qty', { by: 1 });
                }
        }
    console.log("data in app to cart service",data);
    }

}
export const appservice = new appService(); 