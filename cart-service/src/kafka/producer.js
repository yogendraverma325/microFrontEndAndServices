import { Kafka } from "kafkajs";
import {appservice} from "../api/services/app.js"; 
let kafka = null;
const connectKafaka= async () => {
  kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});;
}


export { kafka,connectKafaka };