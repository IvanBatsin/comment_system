import React from 'react';
import { IComment, ServerResponse } from '../types';
import { dateFormatter } from '../utils/dateFormatter';
import { IconButton } from './IconButton';
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa';
import { usePostsContext } from '../context/PostContext';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useAsyncFn } from '../hooks/useAsync';
import { CommentsService, CommentsCreatePayload, CommentUpdatePayload, CommentDeleteOrToggleLikePayload } from '../services/commentsService';
import { useUserId } from '../hooks/useUserId';

interface CommentItemProps {
  comment: IComment
}

export const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
  const { postObj, getReplies, createCommentLocally, updateCommentLocally, deleteCommentLocally, toggleLikeLocally } = usePostsContext();
  const childrenCommenst = getReplies(comment.id);
  const createCommentFn = useAsyncFn<ServerResponse<IComment>, CommentsCreatePayload>(CommentsService.createComment);
  const updateCommetFn = useAsyncFn<ServerResponse<{message: string}>, CommentUpdatePayload>(CommentsService.updateComment);
  const deleteCommentFn = useAsyncFn<ServerResponse<{id: string}>, CommentDeleteOrToggleLikePayload>(CommentsService.deleteComment); 
  const toggleLikeFn = useAsyncFn<ServerResponse<{addLike: boolean}>, CommentDeleteOrToggleLikePayload>(CommentsService.toggleCommentLikeStatus);
  const currentUser = useUserId();
  
  const [areChildrenHidden, setAreChildrenHiiden] = React.useState<boolean>(true);
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const handleCommentReplyFormSubmit = async (message: string): Promise<any> => {
    try {
      const newComment = await createCommentFn.execute({message, postId: postObj.id, parentId: comment.id});
      setIsReplying(false);
      createCommentLocally(newComment.data!);
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdateCommentFormSubmit = async (message: string): Promise<any> => {
    try {
      await updateCommetFn.execute({message, postId: postObj.id, id: comment.id});
      setIsEditing(false);
      updateCommentLocally(comment.id, message);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeletComment = async (): Promise<any> => {
    try {
      const result = await deleteCommentFn.execute({postId: postObj.id, commentId: comment.id});
      deleteCommentLocally(result.data!.id);
    } catch (error) {
      console.error(error);
    }
  }

  const handleToggleLike = async (): Promise<any> => {
    try {
      const result = await toggleLikeFn.execute({commentId: comment.id, postId: postObj.id});
      toggleLikeLocally(comment.id, result.data!.addLike);
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
        {isEditing ? 
          <CommentForm
            autoFocus
            initialValue={comment.message}
            loading={updateCommetFn.loading}
            error={updateCommetFn.error}
            handleSubmit={handleUpdateCommentFormSubmit}
          /> : 
          <div className='message'>{comment.message}</div>
        }
        <div className='footer'>
          <IconButton 
            Icon={comment.likedByMe ? FaHeart : FaRegHeart} 
            area-label={comment.likedByMe ? 'Unlike' : 'Like'}
            disabled={toggleLikeFn.loading}
            count={comment.likesCount}
            onClick={handleToggleLike}
          >{comment.likesCount}</IconButton>
          <IconButton 
            Icon={FaReply} 
            area-label={`${isReplying ? 'Reply' : 'Cancel reply'}`}
            isActive={isReplying}
            onClick={() => setIsReplying(prevValue => !prevValue)} 
          />
          {currentUser.id === comment.user.id &&
            <>
              <IconButton 
                Icon={FaEdit} 
                isActive={isEditing}
                area-label={`${isEditing ? 'Edit' : 'Cancel edit'}`}
                onClick={() => setIsEditing(prevValue => !prevValue)}
              />
              <IconButton 
                disabled={deleteCommentFn.loading}
                Icon={FaTrash} 
                color='danger' 
                area-label='Delete'
                onClick={handleDeletComment}
              />
            </>
          }
        </div>
        {deleteCommentFn.error && 
          <div className='error-msg mt-1'>{deleteCommentFn.error}</div>
        }
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