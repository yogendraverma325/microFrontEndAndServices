import { CartSocketClient } from "../websocket/socketClient.js";
import {appservice} from "../api/services/app.js";
const WEB_SOCKET_URL = process.env.WEB_SOCKET_URL
const cartSocket = new CartSocketClient(WEB_SOCKET_URL);
export const consumeDataSocket = async () => {
    await cartSocket.start();
    cartSocket.onServiceEvent(async (data) => {
      switch (data.METHOD) {
        case "ADD":
           await handleAddToCart(data);
        break;
}
    });
  };

  const handleAddToCart = async (data) => {
      let out= await appservice.addToCart(data);
      cartSocket.emit("cart-action",out);
  }
