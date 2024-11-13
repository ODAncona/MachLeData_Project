// pages/index.tsx
import React, { useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import Login from '../components/Login';
import Home from '../components/Home';

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isLoggedIn ? (
        <Home />
      ) : (
        <>
          <Login />
          <VideoUpload setIsLoggedIn={setIsLoggedIn} />
        </>
      )}
    </div>
  );
};

export default HomePage;
