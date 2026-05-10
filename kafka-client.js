import fs from "fs";
import path from "path"
import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.KAFKA_BROKER, "kafka ---------------------------------------------------")

// export const kafkaClient = new Kafka({
//   clientId: "my-app",
//   brokers: [process.env.KAFKA_BROKER],

//   // ssl: {
//   //   rejectUnauthorized: true,
//   //   ca: [fs.readFileSync("./certs/ca.pem", "utf-8")],
//   //   key: fs.readFileSync("./certs/client.key", "utf-8"),
//   //   cert: fs.readFileSync("./certs/client.crt", "utf-8"),
//   // },

//   // sasl: {
//   //   mechanism: "plain",
//   //   username: process.env.KAFKA_USERNAME,
//   //   password: process.env.KAFKA_PASSWORD,
//   // },
// });

const certPath = path.resolve("certs");

export const kafkaClient = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER],

  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(`${certPath}/ca.pem`, "utf-8")],
    key: fs.readFileSync(`${certPath}/client.key`, "utf-8"),
    cert: fs.readFileSync(`${certPath}/client.crt`, "utf-8"),
  },
});

console.log("CA:", fs.existsSync(path.resolve("certs/ca.pem")));
console.log("CRT:", fs.existsSync(path.resolve("certs/client.crt")));
console.log("KEY:", fs.existsSync(path.resolve("certs/client.key")));