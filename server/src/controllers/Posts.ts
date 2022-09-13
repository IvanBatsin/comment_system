import { PrismaClient } from '@prisma/client';
import { Response, Request, NextFunction } from 'express';
import { IPost, ServerErrorMessages, ServerResponse } from '../../../types';

type ReturnPost = Pick<IPost, 'id' | 'title'>;

export class PostsController {
  static prismaClient: PrismaClient;

  static setPrismaClient(prismaClient: PrismaClient): void {
    if (!PostsController.prismaClient) {
      PostsController.prismaClient = prismaClient;
    }
  }

  async allPosts(req: Request, res: Response<ServerResponse<ReturnPost[]>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      if (!PostsController.prismaClient) {
        return next(ServerErrorMessages.PRISMA_IS_NOT_DEFINED);
      }

      const posts = await PostsController.prismaClient.post.findMany({
        select: {
          id: true,
          title: true
        }
      });

      res.status(200).json({success: true, data: posts})
    } catch (error: any) {
      return next(error.toString());
    }
  }
}

export const postsControllerInstance = new PostsController();