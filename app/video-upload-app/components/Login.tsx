import { useState } from 'react';

const Login = ({ onLoginSuccess }: { onLoginSuccess: (username: string) => void }) => {
  const [username, setUsername] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a video preview URL
      setVideoPreview(previewUrl);
    }
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username && videoPreview) {
      onLoginSuccess(username); // Notify parent of successful login
    } else {
      alert('Please fill out all fields!');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
      <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Video Upload</h1>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <button
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Log in
        </button>
      </form>

      {videoPreview && (
        <div style={{ marginTop: '20px' }}>
          <h2>Selected Video Preview:</h2>
          <video controls style={{ maxWidth: '100%' }}>
            <source src={videoPreview} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Login;
