const Home = ({ username }: { username: string }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Home Page</h1>
      <p>
        Logged in as: <strong>{username}</strong>
      </p>
    </div>
  );
};

export default Home;
