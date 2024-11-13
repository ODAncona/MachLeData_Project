// components/Register.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [registerStatus, setRegisterStatus] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Validate the form whenever `name` or `videoFiles` changes
    if (name && videoFiles.length > 0 && videoFiles.length <= 10) {
      setIsFormValid(true);
      setRegisterStatus(null);
    } else {
      setIsFormValid(false);
      if (!name) setRegisterStatus('Error: Please enter your name.');
      else if (videoFiles.length > 10) setRegisterStatus('Error: You can upload up to 10 videos only.');
      else if (videoFiles.length === 0) setRegisterStatus('Error: Please select at least one video.');
    }
  }, [name, videoFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    // Only include valid video files and limit to 10 files
    const validVideos = files.filter((file) => file.type.startsWith('video/')).slice(0, 10);

    if (validVideos.length !== files.length) {
      setRegisterStatus('Error: All files must be valid video files.');
      setIsFormValid(false);
      return;
    }

    setVideoFiles(validVideos);
  };

  const handleRegister = async () => {
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append('name', name);
    videoFiles.forEach((video, index) => formData.append(`video_${index + 1}`, video));

    try {
      const response = await axios.post('/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setRegisterStatus('Registration successful!');
        setName('');
        setVideoFiles([]);
      } else {
        setRegisterStatus('Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterStatus('An error occurred during registration.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '10px', display: 'block', width: '100%' }}
      />
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      <button
        onClick={handleRegister}
        disabled={!isFormValid} // Disable button if form is invalid
        style={{
          marginTop: '10px',
          backgroundColor: isFormValid ? '#007bff' : '#ccc',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
        }}
      >
        Submit Registration
      </button>
      {registerStatus && <p style={{ color: 'red', marginTop: '10px' }}>{registerStatus}</p>}
    </div>
  );
};

export default Register;
