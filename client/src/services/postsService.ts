import { makeRequest } from "./makeRequest";
import { ApplicationRoutes } from '../../../types';

export class PostsService {
  static getAllPosts = (): Promise<void> => {
    return makeRequest(ApplicationRoutes.POSTS);
  }
}