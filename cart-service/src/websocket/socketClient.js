import { io } from "socket.io-client";

export class CartSocketClient {
  constructor(apiGatewayUrl) {
    this.apiGatewayUrl = apiGatewayUrl;
    this.socket = null;
  }

  start() {
    return new Promise((resolve) => {
      this.socket = io(this.apiGatewayUrl, { transports: ["websocket"],reconnection: true });
  
      this.socket.on("connect", () => {
        this.socket.emit("register-service", "cart-service");
        //console.log("Cart Service connected to API Gateway:", this.socket.id);
        resolve(this);
      });
  
      this.socket.on("connect_error", (err) => {
        //console.error("Socket connection error:", err.message);
      });
  
      this.socket.on("reconnect_attempt", () => {
        //console.log("Trying to reconnect...");
      });
  
      this.socket.on("disconnect", () => {
        //console.log("Cart Service disconnected from API Gateway");
      });
    });
  }
  onServiceEvent(callback) {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call start() first.");
    }
    this.socket.on("service-event", callback);
  }

  emit(event, data) {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call start() first.");
    }
    this.socket.emit(event, data);
  }
}
