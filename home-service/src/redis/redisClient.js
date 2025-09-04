import { createClient } from "redis";

class RedisClient {
  constructor() {
    this.client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("✅ Redis connected");
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, JSON.stringify(value)); // Set with expiration time
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
    } catch (err) {
      console.error("Redis set error:", err);
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error("Redis get error:", err);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error("Redis delete error:", err);
    }
  }
}
const redisClient = new RedisClient();
export default redisClient;