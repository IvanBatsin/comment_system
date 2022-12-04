import React from 'react';
import { IComment } from '../types';
import { dateFormatter } from '../utils/dateFormatter';
import { IconButton } from './IconButton';
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { usePostsContext } from '../context/PostContext';
import { CommentList } from './CommentList';

interface CommentItemProps {
  comment: IComment
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
  const { getReplies } = usePostsContext();
  const childrenCommenst = getReplies(comment.id);
  const [areChildrenHidden, setAreChildrenHiiden] = React.useState<boolean>(true);

  return (
    <>
      <div className='comment'>
        <div className='header'>
          <span className='name'>{comment.user.name}</span>
          <span className='date'>{dateFormatter().format(new Date(comment.createdAt))}</span>
        </div>
        <div className='message'>{comment.message}</div>
        <div className='footer'>
          <IconButton Icon={FaHeart}>2</IconButton>
          <IconButton Icon={FaReply}/>
          <IconButton Icon={FaEdit}/>
          <IconButton Icon={FaTrash} color="danger"/>
        </div>
      </div>

      {!!childrenCommenst?.length && 
        <>
          <div className={`nested-comment-stack ${areChildrenHidden ? 'hide' : ''}`}>
            <button className='collapse-line' aria-label='Hide replies' onClick={() => setAreChildrenHiiden(true)}/>
            <div className='nested-comments'>
              <CommentList comments={childrenCommenst}/> 
            </div>
          </div>
          <button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`} onClick={() => setAreChildrenHiiden(false)}>Show replies</button>
        </> 
      }
    </>
  )
}