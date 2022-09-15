import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PostItem } from './Components/PostItem';
import { PostsList } from './Components/PostsList';
import { PostsProvider } from './context/PostContext';

export const App: React.FC = () => {
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<PostsList/>}/>
        <Route path='/posts/:id' element={
          <PostsProvider>
            <PostItem/>
          </PostsProvider>
        }/>
      </Routes>
    </div>
  );
}