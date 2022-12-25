import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient }  from '@prisma/client';
import { ApplicationRoutes, ServerResponse } from '../../client/src/types';
import { PostsController, postsControllerInstance } from './controllers/Posts';
import { setCookieUserId } from './middlewares/setCookieUserId';
import { CommentsController, commentsControllerInstance } from './controllers/Comments';
import { initializePrismaClient } from './helpers/initializePrismaClient';

dotenv.config({path: path.join(__dirname, '../', '.env')});

const app: Application = express();
const prismaClient = new PrismaClient();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIR_SECRET));

initializePrismaClient(prismaClient, [
  PostsController,
  CommentsController
]);

// Hardcode 
const currentUserId = "50abf838-4232-45e6-94ce-2284534b6e2f";
app.use(setCookieUserId(currentUserId));

app.get(`${ApplicationRoutes.POSTS}/:id`, postsControllerInstance.getPostById);
app.get(ApplicationRoutes.POSTS, postsControllerInstance.allPosts);

app.post(`${ApplicationRoutes.POSTS}/:id${ApplicationRoutes.COMMENTS}/:commentId/toggleLike`, commentsControllerInstance.toggleCommentLike);
app.post(`${ApplicationRoutes.POSTS}/:id${ApplicationRoutes.COMMENTS}`, commentsControllerInstance.createComment);

app.put(`${ApplicationRoutes.POSTS}/:id${ApplicationRoutes.COMMENTS}/:commentId`, commentsControllerInstance.updateComment);

app.delete(`${ApplicationRoutes.POSTS}/:id${ApplicationRoutes.COMMENTS}/:commentId`, commentsControllerInstance.deleteComment);

// Global Error Handler
app.use((error: any, req: Request, res: Response<ServerResponse<any>>, next: NextFunction) => {
  res.status(500).json({success: false, message: error.toString()});
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`application is running at ${process.env.PORT || 5000}`);
});