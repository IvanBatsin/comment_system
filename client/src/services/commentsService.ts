import { ServerResponse } from "../types"
import { makeRequest } from "./makeRequest"

export interface CommentsCreatePayload {
  message: string,
  parentId?: string,
  postId: string
}

export class CommentsService {
  static createComment = ({message, parentId, postId}: CommentsCreatePayload): Promise<ServerResponse<any>> => {
    return makeRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      data: {message, parentId}
    });
  }
}