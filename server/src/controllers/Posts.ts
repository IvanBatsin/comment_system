import { Response, Request, NextFunction } from 'express';
import { ApplicationCookies, ServerErrorMessages, ServerResponse } from '../../../client/src/types';
import { BaseController } from './BaseController';
import { Post } from '@prisma/client';

type ReturnPosts = Pick<Post, 'id' | 'title'>;

export class PostsController extends BaseController {
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

  async getPostById(req: Request, res: Response<ServerResponse<any>>, next: NextFunction): Promise<void | NextFunction> {
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
              },
              _count: {select: {likes: true}}
            }
          }
        }
      });

      const likes = await PostsController.prismaClient.like.findMany({
        where: {
          userId: req.cookies[ApplicationCookies.USER_ID],
          commentId: {in: post?.comments.map(comment => comment.id)}
        }
      });

      const resultData = {
        ...post,
        comments: post?.comments.map(comment => {
          const { _count, ...restFields} = comment;
          return {
            ...restFields,
            likedByMe: likes.find(like => like.commentId === comment.id),
            likesCount: _count.likes
          }
        })
      }

      if (!post) {
        res.status(404).json({success: false, message: ServerErrorMessages.RESOURCE_NOT_FOUND});
        return;
      }

      res.status(200).json({success: true, data: resultData});
    } catch (error: any) {
      return next(JSON.stringify(error));
    }
  }
}

export const postsControllerInstance = new PostsController();