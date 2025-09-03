import axios from 'axios';
class ThirdPartyService {
  apiUrl = process.env.PRODUCT_SERVICE_URL;;
  async gethotProducts() {
    const response = await axios.get(`${this.apiUrl}/api/products/hot`);
    return response.data;
  }
  async getnewArrivals() {
    const response = await axios.get(`${this.apiUrl}/api/products/new`);
    return response.data;
  }
}
export const thirdpartyservice = new ThirdPartyService(); 