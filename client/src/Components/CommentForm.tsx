import React from "react";
import { ServerResponse } from "../types";

interface CommentFormProps {
  loading: boolean,
  error: string | undefined,
  autoFocus?: boolean,
  initialValue?: string,
  handleSubmit: (message: string) => Promise<ServerResponse<any>>
}

export const CommentForm: React.FC<CommentFormProps> = ({loading, error, autoFocus = false, initialValue = '', handleSubmit}) => {
  const [message, setMessage] = React.useState<string>(initialValue);

  const handleFormChange = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleSubmit(message).then(() => setMessage(''));
  }
  
  return (
    <form onSubmit={handleFormChange}>
      <div className="comment-form-row">
        <textarea autoFocus={autoFocus} value={message} onChange={e => setMessage(e.currentTarget.value)} className="message-input"></textarea>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Loading" : 'Post'}</button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  )
}