import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient }  from '@prisma/client';
import { ApplicationRoutes, ServerResponse } from '../../client/src/types';
import { PostsController, postsControllerInstance } from './controllers/Posts';
import { setCookieUserId } from './middlewares/setCookieUserId';

dotenv.config({path: path.join(__dirname, '../', '.env')});

const app: Application = express();
const prismaClient = new PrismaClient();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIR_SECRET));

PostsController.setPrismaClient(prismaClient);

const currentUserId = "50abf838-4232-45e6-94ce-2284534b6e2f";
// prismaClient.user.findFirst({where: {name: 'Ivan'}}).then(data => {
//   console.log('prisma user find - ', data);
//   currentUserId = data?.id;
// });
app.use(setCookieUserId(currentUserId));

app.post(`${ApplicationRoutes.POSTS}/:id/comments`, postsControllerInstance.createComment);
app.get(`${ApplicationRoutes.POSTS}/:id`, postsControllerInstance.getPostById);
app.get(ApplicationRoutes.POSTS, postsControllerInstance.allPosts);

// Global Error Handler
app.use((error: any, req: Request, res: Response<ServerResponse<any>>, next: NextFunction) => {
  res.status(500).json({success: false, message: error.toString()});
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`application is running at ${process.env.PORT || 5000}`);
});