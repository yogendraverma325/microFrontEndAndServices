import redisClient from "../../redis/redisClient.js";
class ThirdPartyService {
  async gethotProducts() {
    const cachedData = await redisClient.get("hotProducts");
    if (cachedData) {
      return cachedData;
    }
    return []
  }
  async getnewArrivals() {
    const cachedData = await redisClient.get("newArrivals");
    if (cachedData) {
      return cachedData;
    }
    return []
  }
}
export const thirdpartyservice = new ThirdPartyService(); 