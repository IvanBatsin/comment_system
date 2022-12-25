import { NextFunction, Response, Request } from "express";
import { ApplicationCookies, ServerErrorMessages, ServerResponse } from "../../../client/src/types";
import { BaseController } from "./BaseController";
import { Comment } from '@prisma/client';

type ReturnedDeletCommentType = Pick<Comment, 'id'>;
type ReturnedUpdateCommentType = Pick<Comment, 'message'>;
type ReturnderToggleLikeType = { addLike: boolean };

export class CommentsController extends BaseController {
  async createComment(req: Request, res: Response<ServerResponse<any>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      if (!req.body.message) {
        res.status(405).json({success: false, message: ServerErrorMessages.METHOD_NOT_ALLOWED});
        return;
      }

      const createdComment = await CommentsController.prismaClient.comment.create({
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

      res.status(200).json({success: true, data: {...createdComment, likesCount: 0, likedByMe: false}});
    } catch (error) {
      return next(JSON.stringify(error));
    }
  }

  async updateComment(req: Request, res: Response<ServerResponse<ReturnedUpdateCommentType>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      if (!req.body.message) {
        res.status(405).json({success: false, message: ServerErrorMessages.METHOD_NOT_ALLOWED});
        return;
      }

      const comment = await CommentsController.prismaClient.comment.findUnique({
        where: {id: req.params.commentId},
        select: {userId: true}
      });

      if (comment?.userId !== req.cookies[ApplicationCookies.USER_ID]) {
        res.status(400).json({success: false, message: ServerErrorMessages.UNAUTHORIZED});
        return;
      }

      const updatedMessage = await CommentsController.prismaClient.comment.update({
        where: {id: req.params.commentId},
        data: {message: req.body.message},
        select: {message: true}
      });

      res.status(200).json({success: true, data: updatedMessage});
    } catch (error) {
      return next(JSON.stringify(error));
    }
  }

  async deleteComment(req: Request, res: Response<ServerResponse<ReturnedDeletCommentType>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      const comment = await CommentsController.prismaClient.comment.findUnique({
        where: {id: req.params.commentId},
        select: {userId: true}
      });

      if (comment?.userId !== req.cookies[ApplicationCookies.USER_ID]) {
        res.status(400).json({success: false, message: ServerErrorMessages.UNAUTHORIZED});
        return;
      }

      const deletedCommentId = await CommentsController.prismaClient.comment.delete({
        where: {id: req.params.commentId},
        select: {id: true}
      });
      res.status(200).json({success: true, data: deletedCommentId});
    } catch (error) {
      return next(JSON.stringify(error));
    }
  }

  async toggleCommentLike(req: Request, res: Response<ServerResponse<ReturnderToggleLikeType>>, next: NextFunction): Promise<void | NextFunction> {
    try {
      const likeInfo = {
        commentId: req.params.commentId,
        userId: req.cookies[ApplicationCookies.USER_ID]
      };

      const like = await CommentsController.prismaClient.like.findUnique({
        where: { userId_commentId: likeInfo }
      });

      if (!like) {
        await CommentsController.prismaClient.like.create({
          data: likeInfo
        });
        res.status(200).json({success: true, data: {addLike: true}});
        return;
      }

      await CommentsController.prismaClient.like.delete({
        where: {
          userId_commentId: likeInfo
        }
      });

      res.status(200).json({success: true, data: {addLike: false}});
    } catch (error) {
      return next(JSON.stringify(error));
    }
  }
}

export const commentsControllerInstance = new CommentsController();