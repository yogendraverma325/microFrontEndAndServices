import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: [process.env.KAFKA_URL]});
const producer = kafka.producer();
const ProduceHotProducts = async () => {
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [{ value: "Hello Kafka!" }],
    });
    await producer.disconnect();
}
export { ProduceHotProducts };