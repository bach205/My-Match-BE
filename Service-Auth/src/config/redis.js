import Redis from 'ioredis';
import genericPool from "generic-pool";
import "dotenv/config"

const redisPool = genericPool.createPool(
    {
        create: () => {
            const client = new Redis({
                username: "default",
                port: process.env.DEVELOPMENT_REDIS_PORT,
                host: process.env.DEVELOPMENT_REDIS_HOST,
                password: process.env.DEVELOPMENT_REDIS_PASSWORD,
                db: 0,
                family: 4,
                connectTimeout: 10000,
                retryStrategy: (times) => {
                    if (times > 4) {
                        return new Error('Redis connection failed.');
                    }
                    return Math.min(times * 1000, 3000); // Thời gian chờ tối đa 3 giây
                },
            });
            client.on('error', (err) => console.log('Redis Client Error', err))
            return client
        },
        destroy: () => {
            return client.quit()
        }
    },
    {
        min: 2,
        max: 10
    }
)

const closePool = async () => {
    await redisPool.drain()
    await redisPool.clear()
}

export {
    redisPool,
    closePool
}