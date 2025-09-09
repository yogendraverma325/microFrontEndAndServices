import { Kafka } from "kafkajs";
let kafka = null;
const connectKafaka= async () => {
  kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});;
}
const sendDataToCart = async (CART_ID,PRODUCT_ID,METHOD,QTY) => {
  const producer = kafka.producer();
    let CART_UPDATION_DATA={
        CART_ID,
        PRODUCT_ID,
        METHOD,
        QTY
    }
    await producer.connect();
    await producer.send({
      topic: process.env.CART_TOPIC,
      messages: [{value:JSON.stringify(CART_UPDATION_DATA),"key": METHOD}],
    });
    console.log("data sent from producer")
    await producer.disconnect();
}
export { sendDataToCart,kafka,connectKafaka };