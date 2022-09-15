import React from 'react';
import { IComment } from '../types';
import { dateFormatter } from '../utils/dateFormatter';

interface CommentItemProps {
  comment: IComment
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
  console.log('comment item - ', comment);
  return (
    <>
      <div className='comment'>
        <div className='header'>
          <span className='name'>{comment.user.name}</span>
          <span className='date'>{dateFormatter().format(new Date(comment.createdAt))}</span>
        </div>
      </div>
    </>
  )
}