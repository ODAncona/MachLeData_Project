// components/VideoUpload.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface VideoUploadProps {
  setIsLoggedIn: (value: boolean) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ setIsLoggedIn }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Check if the file is a video
    if (file && !file.type.startsWith('video/')) {
      setUploadStatus('Error: Please upload a valid video file.');
      setVideoFile(null);
      return;
    }

    // Check if the file size is less than 1MB
    if (file && file.size > 1 * 1024 * 1024) { // 1MB = 1 * 1024 * 1024 bytes
      setUploadStatus('Error: File size should be less than 1MB.');
      setVideoFile(null);
      return;
    }

    // If validations pass, set the file and clear any previous error messages
    setVideoFile(file);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setUploadStatus('Error: Please select a valid video file.');
      return;
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        router.push('/'); // Redirect to Home
      } else {
        setUploadStatus('Login failed. Please try again.');
      }
    } catch (error) {
      setUploadStatus('An error occurred during upload. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>Upload and Submit</button>
      {uploadStatus && <p style={{ color: 'red', marginTop: '10px' }}>{uploadStatus}</p>}
    </div>
  );
};

export default VideoUpload;
