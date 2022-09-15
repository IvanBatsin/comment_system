import React from 'react';
import { usePostsContext } from '../context/PostContext';
import { CommentList } from './CommentList';

export const PostItem: React.FC = () => {
  const { postObj, rootComments } = usePostsContext();
  
  return (
    <div>
      <h1>{postObj.post.title}</h1>
      <article>{postObj.post.body}</article>
      <h3 className='comments-title'>Comments:</h3>
      <section>
        {!!rootComments?.length && 
          <div className='mt-4'>
            <CommentList comments={rootComments}/>
          </div>
        }
      </section>
    </div>
  )
}