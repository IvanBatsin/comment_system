export interface ServerResponse<T> {
  success: boolean,
  message?: string,
  data?: T
}

export interface IPost {
  id: string,
  title: string,
  body: string,
  comments: IComment[]
}

export interface IUser {
  id: string,
  name: String,
  comments: IComment[],
  likes: ILike[]
}

export interface IComment {
  id: string,
  message: string
  createdAt: Date,
  updatedAt: Date,
  userId: string,
  postId: string,
  parent?: IComment,
  children: IComment[],
  parentId?: string,
  likes: ILike[],
  user: IUser,
  post: IPost
}

export interface ILike {
  id: string,
  user: IUser,
  userId: string,
  comment: IComment,
  commentId: string
}

export enum ServerErrorMessages {
  SERVER_ERROR = 'Server error',
  UNHANDLE_METHOD = 'Unhandle method',
  METHOD_NOT_ALLOWED = 'Method not allowed',
  PRISMA_IS_NOT_DEFINED = 'Prisma is not defined',
  RESOURCE_NOT_FOUND = 'Resource not found'
}

export enum ApplicationRoutes {
  POSTS = '/posts'
}

export const RootCommentType = 'root';