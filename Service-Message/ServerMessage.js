import express from "express";
import message from "./src/routes/message.js"
import http from "http"
import socketSetUp from "./src/config/socket.js";
import "dotenv/config";
import { client } from './src/config/mongoDB.js'

const app = express();
const port = process.env.DEVELOPMENT_PORT;
const server = http.createServer(app);

app.use("/message", message);

socketSetUp(server);

server.listen(port, () => {
    console.log(`server is running on ${port}`)
});

process.on('SIGINT', async () => {
    try {
        console.log('SIGINT received. Closing connections...');
        await client.close(); // Đóng kết nối MongoDB
        process.exit(0);
    } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        console.log('SIGTERM received. Closing connections...');
        await client.close(); // Đóng kết nối MongoDB
        process.exit(0);
    } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
    }
});