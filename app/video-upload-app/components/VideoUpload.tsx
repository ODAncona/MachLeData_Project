// components/VideoUpload.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface VideoUploadProps {
  setIsLoggedIn: (value: boolean) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ setIsLoggedIn }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Validate the form whenever `videoFile` changes
    if (videoFile && videoFile.type.startsWith('video/') && videoFile.size <= 1 * 1024 * 1024) {
      setIsFormValid(true);
      setUploadStatus(null);
    } else {
      setIsFormValid(false);
      if (!videoFile) {
        setUploadStatus('Error: Please select a video file.');
      } else if (!videoFile.type.startsWith('video/')) {
        setUploadStatus('Error: Only video files are allowed.');
      } else if (videoFile.size > 1 * 1024 * 1024) {
        setUploadStatus('Error: File size must be less than 1MB.');
      }
    }
  }, [videoFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!isFormValid || !videoFile) return;

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
      <button
        onClick={handleUpload}
        disabled={!isFormValid} // Disable button if form is invalid
        style={{
          marginTop: '10px',
          backgroundColor: isFormValid ? '#007bff' : '#ccc',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
        }}
      >
        Upload and Submit
      </button>
      {uploadStatus && <p style={{ color: 'red', marginTop: '10px' }}>{uploadStatus}</p>}
    </div>
  );
};

export default VideoUpload;
