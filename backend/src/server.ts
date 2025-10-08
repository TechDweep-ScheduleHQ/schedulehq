import express from 'express';
import cors from 'cors';
import routes from './index';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export {prisma};

