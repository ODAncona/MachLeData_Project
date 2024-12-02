import React, { useState } from 'react';

const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>(''); // User's name
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file || !username.trim()) {
      setMessage('Please select a file and provide a username.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadUrl = `/api/upload?username=${encodeURIComponent(username)}&fileName=${encodeURIComponent(file.name)}`;
      console.log('Uploading to', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file, // Send the file in the request body
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Upload successful! Path: ${result.storagePath}`);
      } else {
        const error = await response.json();
        setMessage(`Upload failed: ${error.error}`);
      }
    } catch (error: any) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Video Upload</h1>
      <input 
        type="text" 
        placeholder="Enter username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={uploading}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleFileChange} 
        disabled={uploading} 
      />
      {file && <p>Selected file: {file.name}</p>}
      <button 
        onClick={handleUpload} 
        disabled={!file || !username.trim() || uploading} 
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p style={{ marginTop: '10px', color: uploading ? 'blue' : 'red' }}>{message}</p>}
    </div>
  );
};

export default VideoUpload;
