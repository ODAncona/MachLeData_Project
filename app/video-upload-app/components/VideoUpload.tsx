import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

type VideoUploadProps = {
  setIsLoggedIn: (loggedIn: boolean) => void;
};

const VideoUpload: React.FC<VideoUploadProps> = ({ setIsLoggedIn }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('/api/upload', formData, { // check avec danco pour comment ça marche
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        router.push('/home');
      } else {
        setIsLoggedIn(false);
        alert('Login failed based on model response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Submit</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default VideoUpload;
