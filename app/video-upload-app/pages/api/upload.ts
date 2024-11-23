// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
/*
// Configure multer storage (store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Create a router instance
const router = createRouter<NextApiRequest, NextApiResponse>();

// Use multer middleware to handle file uploads
router.use(upload.single('video'));

// POST handler for uploading a single video
router.post(async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
  try {
    const videoBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    // Initialize Google Cloud Storage
    const storage = new Storage();
    const bucket = storage.bucket('bucket-video-storage');
    const blob = bucket.file(`login/${originalName}`);

    // Create a stream to upload the file
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading file to GCS:', err);
      res.status(500).json({ success: false, message: 'Error uploading file to GCS.' });
    });

    blobStream.on('finish', () => {
      res.status(200).json({ success: true, message: 'File uploaded successfully.' });
    });

    // End the stream by sending the buffer
    blobStream.end(videoBuffer);
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Internal Server Error');
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  },
});

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser
  },
};*/
