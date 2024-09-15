import express from "express";
import message from "./src/routes/message.js"
import http from "http"
import socketSetUp from "./src/config/socket.js";
import "dotenv/config";

const app = express();
const port = process.env.DEVELOPMENT_PORT;
const server = http.createServer(app);

app.use("/message", message);

socketSetUp(server);

server.listen(port, () => {
    console.log(`server is running on ${port}`)
});
