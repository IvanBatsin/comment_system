import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PostsList } from './Components/PostsList';

export const App: React.FC = () => {
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<PostsList/>}/>
        <Route path='/posts/:id' element={<h2>Hack</h2>}/>
      </Routes>
    </div>
  );
}