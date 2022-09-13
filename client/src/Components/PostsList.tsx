import React from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { PostsService } from "../services/postsService";

export const PostsList: React.FC = () => {
  const { loading, error, value: serverData } = useAsync(PostsService.getAllPosts);

  error && console.log(error);

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    <h1 className="error-message">{error}</h1>
  }

  return (
    <>
      {serverData!.data!.map(post => {
        return <h1 key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h1>
      })}
    </>
  )
}