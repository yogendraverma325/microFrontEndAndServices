import {sendDataToCart} from "../../kafka/gateway-producer.js";
import { getSocketServer } from "../../websocket/socketServer.js";
class Cart {
    constructor() {
     
    }
    addToCart(data) {
      let id=data.CART_ID;
      const socketServer = getSocketServer(); // reuse the singleton instance

      
      socketServer.sendToService("cart-service", data);
      socketServer.registerHandler("cart-action", (data) => {
        console.log("Cart action received", data);
      
        // Process the data as needed (update DB, trigger workflow, etc.)
      });
      // await sendDataToCart(CART_ID,PRODUCT_ID,METHOD,QTY); kafka
    }
 
  }
  
  export const cart = new Cart(); 