// pages/index.tsx
import React, { useState } from 'react';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';

const IndexPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'register' | 'home' | null>(null);
  const [username, setUsername] = useState('');


  const handleLoginSuccess = (enteredUsername: string) => {
    setUsername(enteredUsername);
    setView('home');
  };

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
          <Login onLoginSuccess={handleLoginSuccess}/>
          <button onClick={() => setView(null)} style={{ marginTop: '10px' }}>Back</button>
        </>
      )}

      {view === 'register' && (
        <>
          <Register />
          <button onClick={() => setView(null)} style={{ marginTop: '10px' }}>Back</button>
        </>
      )}

      {view === 'home' && (
        <>
          <Home username={username} />
          <button onClick={() => setView(null)} style={{ marginTop: '10px' }}>Log out</button>
        </>
      )}
    </div>
  );
};

export default IndexPage;
