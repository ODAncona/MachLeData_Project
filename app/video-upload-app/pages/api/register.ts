// pages/api/register.ts
/*import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

// Configure multer storage (store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize next-connect
const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ success: false, message: Sorry something happened! ${error.message} });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ success: false, message: Method '${req.method}' Not Allowed });
  },
});

// Handle multipart/form-data
apiRoute.use(upload.array('videos', 10)); // Accept up to 10 files

apiRoute.post(async (req: NextApiRequest & { files: any[] }, res: NextApiResponse) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Name is required' });
      return;
    }

    if (!req.files || req.files.length === 0) {
      res.status(400).json({ success: false, message: 'At least one video is required' });
      return;
    }

    const storage = new Storage();
    const bucket = storage.bucket('bucket-video-storage');

    for (const file of req.files) {
      const videoBuffer = file.buffer;
      const originalName = file.originalname;
      const tempInputPath = /tmp/${Date.now()}-${originalName};
      fs.writeFileSync(tempInputPath, videoBuffer);

      // Convert to MP4 if necessary
      let tempOutputPath = tempInputPath;
      if (path.extname(originalName).toLowerCase() !== '.mp4') {
        tempOutputPath = /tmp/${Date.now()}-converted.mp4;
        await new Promise((resolve, reject) => {
          ffmpeg(tempInputPath)
            .outputOptions([
              '-map 0:v:0',
              '-map 0:a:0',
              '-c:v libx264',
              '-crf 23',
              '-preset medium',
              '-c:a aac',
              '-strict experimental',
            ])
            .save(tempOutputPath)
            .on('end', resolve)
            .on('error', reject);
        });
        fs.unlinkSync(tempInputPath); // Remove the original file
      }

      // Upload to GCS
      const blob = bucket.file(`${name}/${path.basename(tempOutputPath)}`);
      await bucket.upload(tempOutputPath, {
        destination: blob,
      });

      fs.unlinkSync(tempOutputPath); // Clean up the converted file
    }

    res.status(200).json({ success: true, message: 'Files uploaded and converted successfully.' });
  } catch (error) {
    console.error('Error during file upload and conversion:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
*/