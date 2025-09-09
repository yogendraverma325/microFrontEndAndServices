import { Server } from "socket.io";

class SocketIOServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
      },
    });

    this.serviceMap = new Map();         // Map<serviceName, Set<Socket>>
    this.globalEventHandlers = new Map(); // Map<eventName, handler>
  }

  // Initialize the server and handle connections
  init() {
    this.io.on("connection", (socket) => {
      console.log("Microservice connected:", socket.id);

      // Register service
      socket.on("register-service", (serviceName) => {
        if (!this.serviceMap.has(serviceName)) {
          this.serviceMap.set(serviceName, new Set());
        }
        this.serviceMap.get(serviceName).add(socket);
        console.log(`${serviceName} registered`);
      });

      // Attach global event handlers to this socket
      for (const [eventName, handler] of this.globalEventHandlers.entries()) {
        socket.on(eventName, handler);
      }

      // Handle disconnect
      socket.on("disconnect", () => {
        for (const [name, socketSet] of this.serviceMap.entries()) {
          if (socketSet.has(socket)) {
            socketSet.delete(socket);
            console.log(`${name} disconnected`);

            if (socketSet.size === 0) {
              this.serviceMap.delete(name);
            }
            break;
          }
        }
      });
    });
  }

  // Emit to a specific service by name
  sendToService(serviceName, data) {
    const socketSet = this.serviceMap.get(serviceName);
    if (socketSet) {
      socketSet.forEach((socket) => socket.emit("service-event", data));
    } else {
      console.log(`Service "${serviceName}" not connected`);
    }
  }

  // Register a global handler for any event
  registerHandler(eventName, callback) {
    this.globalEventHandlers.set(eventName, callback);

    // Attach to all currently connected sockets
    for (const socketSet of this.serviceMap.values()) {
      socketSet.forEach((socket) => socket.on(eventName, callback));
    }
  }
}

// Singleton instance
let instance = null;
export const getSocketServer = (httpServer) => {
  if (!instance) {
    instance = new SocketIOServer(httpServer);
    instance.init();
  }
  return instance;
};
