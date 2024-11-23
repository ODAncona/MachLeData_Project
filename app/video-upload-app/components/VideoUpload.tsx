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

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useFileUpload } from '@/actions/uploadHook'; // Adjust the path if necessary

function FileUpload() {
  const [file, setFile] = useState<File | null>(null); // Declare file as File or null type
  const [status, setStatus] = useState<string>(''); // Status type is a string
  const fileUpload = useFileUpload(); // Calling the custom hook

  // Type the event parameter to be a ChangeEvent for an input of type 'file'
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  // Type the event parameter to be a FormEvent for a form submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus('Please select a file to upload');
      return;
    }

    // Start the upload process
    setStatus('Uploading...');
    const filename = file.name;
    const uploadSuccess = await fileUpload(filename, file);

    if (uploadSuccess) {
      setStatus('File uploaded successfully!');
    } else {
      setStatus('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Upload a Video</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default FileUpload;
