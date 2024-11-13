// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) { // TODO
  if (req.method === 'POST') {
    // Simulate processing by calling a model or external service
    // Here we’ll mock the response for demo purposes

    const isLoginSuccessful = Math.random() > 0.5; // 50% chance of success

    if (isLoginSuccessful) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
