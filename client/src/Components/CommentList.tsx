import React from 'react';
import { IComment } from '../types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: IComment[]
}

export const CommentList: React.FC<CommentListProps> = ({comments}) => {
  return (
    <>
      {comments.map(comment => {
        return (
          <div key={comment.id} className='comment-stack'>
            <CommentItem comment={comment}/>
          </div>
        )
      })}
    </>
  )
}