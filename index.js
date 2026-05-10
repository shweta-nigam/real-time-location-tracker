import http from "node:http";
import path from "node:path";

import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { kafkaClient } from "./kafka-client.js";

dotenv.config();

async function main() {
  const PORT = process.env.PORT ?? 8080;
  const BASE_URL = process.env.BASE_URL

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server);

  // ------------------ KAFKA SETUP ------------------

  const kafkaProducer = kafkaClient.producer();
  await kafkaProducer.connect();

  const kafkaConsumer = kafkaClient.consumer({
    groupId: `socket-server-${PORT}`,
  });

  await kafkaConsumer.connect();

  await kafkaConsumer.subscribe({
    topic: "location-updates",
    fromBeginning: false, // important
  });

  // ------------------ KAFKA CONSUMER ------------------

  kafkaConsumer.run({
    eachMessage: async ({ message, heartbeat }) => {
      try {
        const data = JSON.parse(message.value.toString());

        // safety check
        if (!data || !data.roomId) return;

        const { id, latitude, longitude, roomId } = data;

        console.log("Kafka received:", data);

        // send ONLY to room
        io.to(roomId).emit("server:location:update", {
          id,
          latitude,
          longitude,
        });

        await heartbeat();
      } catch (err) {
        console.error("Kafka parse error:", err);
      }
    },
  });

  // ------------------ SOCKET ------------------

  io.on("connection", (socket) => {
    console.log(`[Socket:${socket.id}] Connected`);

    // Join room
    socket.on("join:room", (roomId) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`[Socket:${socket.id}] joined room ${roomId}`);
    });

    // Receive location
    socket.on("client:location:update", async (data) => {
      try {
        const { latitude, longitude, roomId } = data;

        if (!roomId) return;

        await kafkaProducer.send({
          topic: "location-updates",
          messages: [
            {
              key: socket.id,
              value: JSON.stringify({
                id: socket.id,
                latitude,
                longitude,
                roomId,
              }),
            },
          ],
        });
      } catch (err) {
        console.error("Kafka send error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket:${socket.id}] Disconnected`);
    });
  });

  // ------------------ EXPRESS ------------------

  app.use(express.static(path.resolve("./public")));

  app.get("/health", (req, res) => {
    res.json({ healthy: true });
  });

app.use((req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

  // ------------------ START SERVER ------------------

  console.log("Kafka Broker:", process.env.KAFKA_BROKER);

  server.listen(PORT, () => {
    console.log(`Server running at ${BASE_URL}`);
  });
}

main();