import { kafkaClient } from "./kafka-client.js";

async function setup() {
  const admin = kafkaClient.admin();

  console.log(`kafka Admin connection...`);
  await admin.connect();
  console.log(`kafka admin connection success`);

  await admin.createTopics({
    topics: [{ topic: "location-updates", numPartitions: 2 }],
  });

  await admin.disconnect(); // Prevents memory leaks and Frees network resources
}

setup();


// note:
//1.  Admin is used for:
// Creating topics
// Deleting topics
// Managing Kafka configs
// Not for sending/receiving messages


// 2. A topic is like a channel / stream of messages