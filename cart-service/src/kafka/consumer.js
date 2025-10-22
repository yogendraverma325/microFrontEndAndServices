import { Kafka } from "kafkajs";
const kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});
import {appservice} from "../api/services/app.js";
const consumeMessage = async () => {
    const consumer = kafka.consumer({ groupId: process.env.CART_GROUP });
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.CART_TOPIC, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            switch (message.key.toString()) {
                    case "ADD":
                       await handleAddToCart(message);
                    break;
                    // case "newArrivals":
                    //     await handleNewArrivals(message);
                    // break;
            }
        },
    });
}
const handleAddToCart = async (message) => {
    // recevied")
    const data = JSON.parse(message.value.toString());
    await appservice.addToCart(data);
}

export { consumeMessage };
