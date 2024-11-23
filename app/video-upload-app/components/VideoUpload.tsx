// components/VideoUpload.tsx
/*import React, { useState, useEffect } from 'react';
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
    if (videoFile && videoFile.type.startsWith('video/')) {
      setIsFormValid(true);
      setUploadStatus(null);
    } else {
      setIsFormValid(false);
      if (!videoFile) {
        setUploadStatus('Error: Please select a video file.');
      } else if (!videoFile.type.startsWith('video/')) {
        setUploadStatus('Error: Only video files are allowed.');
      }
    }
  }, [videoFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!isFormValid || !videoFile) return;

    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity, // Allow large payloads
        maxContentLength: Infinity, // Allow large payloads
      });

      if (response.data.success) {
        setUploadStatus('Upload successful!');
        setIsLoggedIn(true);
        router.push('/'); // Redirect to Home
      } else {
        setUploadStatus('Upload failed. Please try again.');
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
        disabled={!isFormValid}
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

export default VideoUpload;*/

import { UploadFile } from '@/actions/sendToBucket';
import React from 'react';
function FileUpload(){
  return (
    <>
      <h1 >UPLOAD</h1>
      <form action={UploadFile}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </>
  );  
}
export default FileUpload;