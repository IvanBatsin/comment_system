import React from 'react';
import { usePostsContext } from '../context/PostContext';
import { useAsyncFn } from '../hooks/useAsync';
import { CommentsCreatePayload, CommentsService } from '../services/commentsService';
import { IComment, ServerResponse } from '../types';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

export const PostItem: React.FC = () => {
  const { postObj, rootComments, createCommentLocally } = usePostsContext();
  const { error, loading, execute: createCommentFn } = useAsyncFn<ServerResponse<IComment>, CommentsCreatePayload>(CommentsService.createComment);

  const handleSubmit = async (message: string): Promise<any> => {
    try {
      const comment = await createCommentFn({message, postId: postObj.id});
      createCommentLocally(comment.data!);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
      <h1>{postObj.post.title}</h1>
      <article>{postObj.post.body}</article>
      <h3 className='comments-title'>Comments:</h3>
      <section>
        <CommentForm 
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
        />
        {!!rootComments?.length && 
          <div className='mt-4'>
            <CommentList comments={rootComments}/>
          </div>
        }
      </section>
    </div>
  )
}