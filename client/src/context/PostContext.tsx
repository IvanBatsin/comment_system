import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { GetPostByIdData, PostsService } from '../services/postsService';
import { IComment, RootCommentType } from '../types';

interface ContextParams {
  postObj: {id: string, post: GetPostByIdData},
  rootComments: IComment[],
  createCommentLocaly: (comment: IComment) => void,
  getReplies: (parentId: string) => IComment[] | undefined
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

  const createCommentLocaly = (comment: IComment): void => {
    setComments(prevComments => [comment, ...prevComments]);
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
        createCommentLocaly,
        getReplies
      }}>
      {loading ? <h2>Loading...</h2> : error ? <h1 className='error-msg'>{error}</h1> : children}
    </Context.Provider>
  )
}

export const usePostsContext = () => React.useContext(Context);