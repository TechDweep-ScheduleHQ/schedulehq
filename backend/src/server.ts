import express from 'express';
import cors from 'cors';
import routes from './index';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { redisConfig } from './Utilis/redis';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors({
  // origin: "http://localhost:5173",  // or "*" for all origins
  origin:"*"
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // credentials: true,  // if using cookies/auth headers
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api',routes);

const server = app.listen(PORT, async () => {
  await redisConfig.getClient();
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  server.close(async () => {
    await redisConfig.disconnect();
    await prisma.$disconnect();
    console.log('Server shut down');
    process.exit(0);
  });
});

export {prisma};
