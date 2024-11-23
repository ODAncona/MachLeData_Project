import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle raw file streams
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const chunks: Buffer[] = []; // Buffer to store file data

    // Collect chunks of data as the request streams in
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const fileBuffer = Buffer.concat(chunks); // Combine all chunks into one buffer
        const maxFileSize = 50 * 1024 * 1024; // 50 MB file size limit

        if (fileBuffer.length > maxFileSize) {
          // Reject files that are too large
          return res.status(400).json({ success: false, message: 'File exceeds the size limit (50MB).' });
        }

        // Create an `uploads` directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save the file with a unique name
        const filePath = path.join(uploadDir, `uploaded-video-${Date.now()}.mp4`);
        fs.writeFileSync(filePath, fileBuffer);

        // Send a success response
        return res.status(200).json({ success: true, message: 'File uploaded successfully.', path: filePath });
      } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
      }
    });

    // Handle errors during the upload
    req.on('error', (error) => {
      console.error('Error during upload:', error);
      return res.status(500).json({ success: false, message: 'File upload error.' });
    });
  } else {
    // Reject non-POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
