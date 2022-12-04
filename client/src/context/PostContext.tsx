import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { GetPostByIdData, PostsService } from '../services/postsService';
import { IComment, RootCommentType } from '../types';

interface ContextParams {
  postObj: {id: string, post: GetPostByIdData},
  rootComments: IComment[],
  getReplies: (parentId: string) => IComment[] | undefined
}

interface CommentsGroup {
  [parentId: string]: IComment[]
}

const Context = React.createContext<ContextParams>({} as ContextParams);

export const PostsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { id } = useParams();
  const { loading, error, value: serverRespose } = useAsync(() => PostsService.getPostById(id!), [id]);

  const post = serverRespose?.data;

  const commentsByParentId = React.useMemo(() => {
    if (!post?.comments) return {};
    
    const group: CommentsGroup = {};
    post?.comments.forEach(comment => {
      const parentId = comment.parentId || RootCommentType;
      group[parentId] ||= [];
      group[parentId].push(comment);
    });
    return group;
  }, [serverRespose?.data?.comments]);

  const getReplies = (parentId: string): IComment[] | undefined => {
    return commentsByParentId[parentId];
  }

  return (
    <Context.Provider value={{
        postObj: {id: id!, post: post!}, 
        rootComments: commentsByParentId[RootCommentType],
        getReplies
      }}>
      {loading ? <h2>Loading...</h2> : error ? <h1 className='error-msg'>{error}</h1> : children}
    </Context.Provider>
  )
}

export const usePostsContext = () => React.useContext(Context);