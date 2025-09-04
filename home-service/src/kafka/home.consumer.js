import { Kafka } from "kafkajs";
import redisClient from "../redis/redisClient.js";
const kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});

const consumeMessage = async () => {
    const consumer = kafka.consumer({ groupId: process.env.PRODUCT_GROUP });
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.HOT_PRODUCTS_TOPIC, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            switch (message.key.toString()) {
                    case "hotProducts":
                       await handleHotProducts(message);
                    break;
                    case "newArrivals":
                        await handleNewArrivals(message);
                    break;
            }
        },
    });
}
const handleHotProducts = async (message) => {
    const hotProducts = JSON.parse(message.value.toString());
    await redisClient.set("hotProducts", hotProducts); // Cache for 1 hour
}
const handleNewArrivals = async (message) => {
    const newArrivals = JSON.parse(message.value.toString());
    await redisClient.set("newArrivals", newArrivals); // Cache for 1 hour
}
export { consumeMessage };
