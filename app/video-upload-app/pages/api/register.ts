// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Name is required' });
      return;
    }

    // Handle video files (for simplicity, we’ll just check the existence here)
    const videoKeys = Object.keys(req.body).filter((key) => key.startsWith('video_'));
    if (videoKeys.length === 0) {
      res.status(400).json({ success: false, message: 'At least one video is required' });
      return;
    }

    // Simulate successful processing and response
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
