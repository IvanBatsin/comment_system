import { ServerResponse } from "../types"
import { makeRequest } from "./makeRequest"

interface BasePayload {
  message: string,
  postId: string
}

export interface CommentsCreatePayload extends BasePayload {
  parentId?: string
}

export interface CommentUpdatePayload extends BasePayload {
  id: string
}

export interface CommentDeleteOrToggleLikePayload {
  postId: string,
  commentId: string
}

export class CommentsService {
  static createComment = ({message, parentId, postId}: CommentsCreatePayload): Promise<ServerResponse<any>> => {
    return makeRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      data: {message, parentId}
    });
  }

  static updateComment = ({id, message, postId}: CommentUpdatePayload): Promise<ServerResponse<any>> => {
    return makeRequest(`/posts/${postId}/comments/${id}`, {
      method: 'PUT',
      data: {message}
    });
  }

  static deleteComment = ({postId, commentId}: CommentDeleteOrToggleLikePayload): Promise<ServerResponse<any>> => {
    return makeRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    });
  }

  static toggleCommentLikeStatus = ({commentId, postId}: CommentDeleteOrToggleLikePayload): Promise<ServerResponse<any>> => {
    return makeRequest(`/posts/${postId}/comments/${commentId}/toggleLike`, {
      method: 'POST'
    });
  }
}