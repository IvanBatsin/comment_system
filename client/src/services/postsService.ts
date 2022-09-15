import { IPost, ServerResponse } from "../types";
import { makeRequest } from "./makeRequest";

export type GetAllPostsData = Pick<IPost, 'title' | 'id'>;
export type GetPostByIdData = Pick<IPost, 'body' | 'title' | "comments">;

export class PostsService {
  static getAllPosts = (): Promise<ServerResponse<GetAllPostsData[]>> => {
    return makeRequest<GetAllPostsData[]>('/posts');
  }

  static getPostById = (postId: string): Promise<ServerResponse<GetPostByIdData>> => {
    return makeRequest(`/posts/${postId}`);
  } 
}