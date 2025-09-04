import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});

const consumeHotProducts = async () => {
    const consumer = kafka.consumer({ groupId: "test-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received: ${message.value.toString()}`);
        },
    });
}
export { consumeHotProducts };
