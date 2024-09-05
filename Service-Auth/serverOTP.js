import express from 'express'
import "dotenv/config"
import otp from './src/routes/authotp.js'
import db from "./src/config/db.js"
import { closePool } from './src/config/redis.js'

const app = express()
const port = process.env.DEVELOPMENT_PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", otp)

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})

process.on('SIGINT', async () => {
    try {
        console.log('SIGINT received. Closing connections...');
        await db.quit(); // Đóng kết nối Knex
        await closePool() // Đóng kết nối Redis
        process.exit(0);
    } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        console.log('SIGTERM received. Closing connections...');
        await db.quit(); // Đóng kết nối Knex
        await closePool(); // Đóng kết nối Redis
        process.exit(0);
    } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
    }
});