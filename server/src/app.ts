import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { PrismaClient }  from '@prisma/client';
import { ApplicationRoutes, ServerResponse } from '../../types';
import { PostsController, postsControllerInstance } from './controllers/Posts';

dotenv.config({path: path.join(__dirname, '../', '.env')});

const app: Application = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

PostsController.setPrismaClient(prismaClient);

app.use(ApplicationRoutes.POSTS, postsControllerInstance.allPosts);

// Global Error Handler
app.use((error: any, req: Request, res: Response<ServerResponse<any>>, next: NextFunction) => {
  res.status(500).json({success: false, message: error.toString()});
});

app.listen(process.env.PORT || 5000, () => {
  console.log('application is running');
});