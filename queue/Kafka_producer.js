import { Kafka } from "kafkajs"

const kafka = new Kafka({
  clientId: 'my-node-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  console.log('Producer connected');

  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS!' },
    ],
  });

  console.log('Message sent successfully');
  await producer.disconnect();
};

runProducer().catch(console.error);
