import React, { useState } from 'react';

const RegisterPage = () => {
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [username, setUsername] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedVideos(Array.from(e.target.files).slice(0, 10)); // Limit to 10 videos
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || selectedVideos.length === 0) {
      alert('Please fill out all fields and select videos.');
      return;
    }

    for (const video of selectedVideos) {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('username', username);

      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    }

    alert('Videos uploaded successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Register and Upload Videos</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Name:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          required
          style={{ display: 'block', marginBottom: '20px', padding: '8px' }}
        />
        
        <hr style={{ border: '1px solid #ccc', marginBottom: '20px' }} />

        <label htmlFor="videos">Select up to 10 videos:</label>
        <input
          type="file"
          id="videos"
          accept="video/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'block', marginBottom: '20px' }}
        />
        
        <hr style={{ border: '1px solid #ccc', marginBottom: '20px' }} />

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Upload Videos
        </button>
      </form>

      {selectedVideos.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Selected Videos:</h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {selectedVideos.map((video, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <video
                  src={URL.createObjectURL(video)}
                  controls
                  style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                />
                <p style={{ marginTop: '5px', fontSize: '12px' }}>{video.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
