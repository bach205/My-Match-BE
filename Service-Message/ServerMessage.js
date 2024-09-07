import express from "express";
import message from "./src/routes/message.js"

const app = express();
const port = 3002;

app.use("/message", message);

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})
