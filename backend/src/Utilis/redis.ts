import { createClient , RedisClientType } from "@redis/client";

class RedisConfig {
    private client: RedisClientType | null = null

    async getClient(): Promise<RedisClientType> {
        if(this.client?.isOpen) return this.client

        this.client = createClient({
            // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            url: "redis://redis:6379",
            // password: process.env.REDIS_PASSWORD || undefined,
            socket: {reconnectStrategy: (retries) => Math.min(retries * 100, 3000)}
        })

        this.client.on('connect' , () => console.log('Connected to Redis!'))
        this.client.on('error' , (err) => console.log('Redis error:' , err.message))
        this.client.on('reconnecting',() => console.log('Reconnecting to Redis!'))

        await this.client.connect()
        return this.client;
    }

    async disconnect(): Promise<void>{
        if(this.client?.isOpen){
            await this.client.disconnect();
            console.log('Disconnected from Redis!')
            this.client = null;
        }
    }
}


export const redisConfig = new RedisConfig();