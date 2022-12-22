import React from 'react';
import { IComment, ServerResponse } from '../types';
import { dateFormatter } from '../utils/dateFormatter';
import { IconButton } from './IconButton';
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { usePostsContext } from '../context/PostContext';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useAsyncFn } from '../hooks/useAsync';
import { CommentsService, CommentsCreatePayload } from '../services/commentsService';

interface CommentItemProps {
  comment: IComment
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
  const { postObj, getReplies, createCommentLocaly } = usePostsContext();
  const childrenCommenst = getReplies(comment.id);
  const [areChildrenHidden, setAreChildrenHiiden] = React.useState<boolean>(true);
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const createCommentFn = useAsyncFn<ServerResponse<IComment>, CommentsCreatePayload>(CommentsService.createComment);

  const handleCommentReplyFormSubmit = async (message: string): Promise<any> => {
    try {
      const newComment = await createCommentFn.execute({message, postId: postObj.id, parentId: comment.id});
      setIsReplying(false);
      createCommentLocaly(newComment.data!);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className='comment'>
        <div className='header'>
          <span className='name'>{comment.user.name}</span>
          <span className='date'>{dateFormatter().format(new Date(comment.createdAt))}</span>
        </div>
        <div className='message'>{comment.message}</div>
        <div className='footer'>
          <IconButton Icon={FaHeart} area-label="like">2</IconButton>
          <IconButton 
            Icon={FaReply} 
            area-label={`${isReplying ? "reply" : 'Cancel reply'}`}
            isActive={isReplying}
            onClick={() => setIsReplying(prevValue => !prevValue)} 
          />
          <IconButton Icon={FaEdit} area-label="edit"/>
          <IconButton Icon={FaTrash} color="danger" area-label="delete"/>
        </div>
      </div>
      {isReplying &&
        <div className='mt-1 ml-3'>
          <CommentForm
            autoFocus
            error={createCommentFn.error}
            loading={createCommentFn.loading}
            handleSubmit={handleCommentReplyFormSubmit}
          />
        </div>
      }
      {!!childrenCommenst?.length && 
        <>
          <div className={`nested-comments-stack ${areChildrenHidden ? 'hide' : ''}`.trim()}>
            <button className='collapse-line' aria-label='Hide replies' onClick={() => setAreChildrenHiiden(true)}/>
            <div className='nested-comments'>
              <CommentList comments={childrenCommenst}/> 
            </div>
          </div>
          <button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`.trim()} onClick={() => setAreChildrenHiiden(false)}>Show replies</button>
        </> 
      }
    </>
  )
}