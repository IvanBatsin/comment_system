import { PrismaClient } from '@prisma/client';
import { Response, Request, NextFunction } from 'express';
import { ApplicationCookies, IPost, ServerErrorMessages, ServerResponse } from '../../../client/src/types';

type ReturnPosts = Pick<IPost, 'id' | 'title'>;
type ReturnPostById = Pick<IPost, 'body' | 'title'>;

export class PostsController {
  static prismaClient: PrismaClient;

  static setPrismaClient(prismaClient: PrismaClient): void {
    if (!PostsController.prismaClient) {
      PostsController.prismaClient = prismaClient;
    }
  }

  async allPosts(req: Request, res: Response<ServerResponse<ReturnPosts[]>>, next: NextFunction): Promise<void | NextFunction> {
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
      return next(JSON.stringify(error));
    }
  }

  async getPostById(req: Request, res: Response<ServerResponse<ReturnPostById>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      if (!Object.keys(req.params).length) {
        res.status(405).json({success: false, message: ServerErrorMessages.METHOD_NOT_ALLOWED});
        return;
      }

      const postId = req.params.id;
      const post = await PostsController.prismaClient.post.findUnique({
        where: {id: postId},
        select: {
          body: true,
          title: true,
          comments: {
            orderBy: {
              createdAt: 'desc'
            },
            select: {
              id: true,
              parentId: true,
              message: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!post) {
        res.status(404).json({success: false, message: ServerErrorMessages.RESOURCE_NOT_FOUND});
        return;
      }

      res.status(200).json({success: true, data: post});
    } catch (error: any) {
      return next(JSON.stringify(error));
    }
  }

  async createComment(req: Request, res: Response<ServerResponse<any>>, next: NextFunction) {
    try {
      if (!req.body.message) {
        return res.status(405).json({success: false, message: ServerErrorMessages.METHOD_NOT_ALLOWED});
      }

      const createdComment = await PostsController.prismaClient.comment.create({
        data: {
          message: req.body.message,
          postId: req.params.id,
          userId: req.cookies[ApplicationCookies.USER_ID],
          parentId: req.body.parentId
        },
        select: {
          id: true,
          parentId: true,
          message: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(200).json({success: true, data: createdComment});
    } catch (error) {
      return next(JSON.stringify(error));
    }
  }
}

export const postsControllerInstance = new PostsController();