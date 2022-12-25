import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { GetPostByIdData, PostsService } from '../services/postsService';
import { IComment, RootCommentType } from '../types';

interface ContextParams {
  postObj: {id: string, post: GetPostByIdData},
  rootComments: IComment[],
  createCommentLocally: (comment: IComment) => void,
  getReplies: (parentId: string) => IComment[] | undefined,
  updateCommentLocally: (commentId: string, message: string) => void,
  deleteCommentLocally: (commentId: string) => void,
  toggleLikeLocally: (commentId: string, addLke: boolean) => void
}

interface CommentsGroup {
  [parentId: string]: IComment[]
}

const Context = React.createContext<ContextParams>({} as ContextParams);

export const PostsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { id } = useParams();
  const { loading, error, value: serverRespose } = useAsync(() => PostsService.getPostById(id!), [id]);
  const [comments, setComments] = React.useState<IComment[]>([]);

  const commentsByParentId = React.useMemo(() => {
    if (!comments) return {};
    
    const group: CommentsGroup = {};
    comments.forEach(comment => {
      const parentId = comment.parentId || RootCommentType;
      group[parentId] ||= [];
      group[parentId].push(comment);
    });
    return group;
  }, [serverRespose?.data?.comments, comments]);

  const getReplies = (parentId: string): IComment[] | undefined => {
    return commentsByParentId[parentId];
  }

  const createCommentLocally = (comment: IComment): void => {
    setComments(prevComments => [comment, ...prevComments]);
  }

  const updateCommentLocally = (commentId: string, message: string): void => {
    setComments(prevComments => prevComments.map(comment => comment.id === commentId ? {...comment, message} : comment));
  }

  const deleteCommentLocally = (commentId: string): void => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  }

  const toggleLikeLocally = (commentId: string, addLike: boolean): void => {
    setComments(prevComments => prevComments.map(comment => {
      if (comment.id === commentId) {
        addLike ? 
        comment = {...comment, likedByMe: true, likesCount: comment.likesCount + 1} : 
        comment = {...comment, likedByMe: false, likesCount: comment.likesCount - 1}
      }

      return comment;
    }));
  }

  React.useEffect(() => {
    if (serverRespose?.data?.comments) {
      setComments(serverRespose.data.comments);
    }
  }, [serverRespose?.data?.comments]);

  return (
    <Context.Provider value={{
        postObj: {id: id!, post: serverRespose?.data!}, 
        rootComments: commentsByParentId[RootCommentType],
        createCommentLocally,
        getReplies,
        updateCommentLocally,
        deleteCommentLocally,
        toggleLikeLocally
      }}>
      {loading ? <h2>Loading...</h2> : error ? <h1 className='error-msg'>{error}</h1> : children}
    </Context.Provider>
  )
}

export const usePostsContext = () => React.useContext(Context);