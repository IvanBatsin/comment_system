import { IPost, ServerResponse } from "../types";
import { makeRequest } from "./makeRequest";

export type GetAllPostsData = Pick<IPost, 'title' | 'id'>

export class PostsService {
  static getAllPosts = (): Promise<ServerResponse<GetAllPostsData[]>> => {
    return makeRequest<GetAllPostsData[]>('/posts');
  }
}