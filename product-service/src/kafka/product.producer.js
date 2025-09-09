import { Kafka } from "kafkajs";
import {productservice} from "../api/services/productService.js";
let kafka = null;
const connectKafaka= async () => {
  kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});;
}

const ProduceProducts = async () => {
  const producer = kafka.producer();
    let hotProductsdata=await productservice.hotProducts();
    let newArrivalsdata=await productservice.newArrivals();
    await producer.connect();
    await producer.send({
      topic: process.env.HOT_PRODUCTS_TOPIC,
      messages: [{value:JSON.stringify(hotProductsdata),"key": "hotProducts"}],
    });
    await producer.send({
      topic: process.env.NEW_ARRIVALS_TOPIC,
      messages: [{value:JSON.stringify(newArrivalsdata),"key": "newArrivals"}],
    });
    await producer.disconnect();
}
export { ProduceProducts,kafka,connectKafaka };