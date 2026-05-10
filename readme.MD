# Real-Time Location Sharing App

A real-time location sharing application built with Node.js, Express, Socket.IO, Kafka, and Leaflet.

## Features

- Real-time location updates using Socket.IO
- Interactive map with Leaflet.js
- Kafka-based event streaming
- Express server backend
- Live user marker updates
- Event-driven architecture

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Leaflet.js

### Backend
- Node.js
- Express.js
- Socket.IO

### Messaging Queue
- Apache Kafka
- KafkaJS

---


## Installation

### Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

KAFKA_BROKER=your_kafka_broker
KAFKA_USERNAME=your_username
KAFKA_PASSWORD=your_password
```

---

## Run the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
node index.js
```

---

## Application Flow

1. User opens the application
2. Browser requests location permission
3. Frontend captures user coordinates
4. Coordinates are sent using Socket.IO
5. Server publishes events to Kafka
6. Kafka consumer processes events
7. Server broadcasts updates to connected clients
8. Map updates in real time

---

## Event Flow

```text
User
  ↓
Socket.IO Client
  ↓
Express + Socket.IO Server
  ↓
Kafka Producer
  ↓
Kafka Topic
  ↓
Kafka Consumer
  ↓
Socket Broadcast
  ↓
Connected Clients
```
---
## Demo Video

[Watch Demo](https://www.youtube.com/watch?v=mHI2oxBj8ac)
---

## License

MIT License

