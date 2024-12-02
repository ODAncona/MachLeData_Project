// pages/index.tsx
import React, { useState } from 'react';
import Home from '../components/Home';
import VideoUpload from '../components/VideoUpload';
import Register from '../components/Register';

const IndexPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'register' | null>(null);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to Our App</h1>
      
      {view === null && (
        <div>
          <button onClick={() => setView('login')}>Log In</button>
          <button onClick={() => setView('register')}>Register</button>
        </div>
      )}

      {view === 'login' && (
        <>
          <VideoUpload />
          <button onClick={() => setView(null)} style={{ marginTop: '10px' }}>Back</button>
        </>
      )}

      {view === 'register' && (
        <>
          <Register />
          <button onClick={() => setView(null)} style={{ marginTop: '10px' }}>Back</button>
        </>
      )}
    </div>
  );
};

export default IndexPage;
