import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

type Vars = {
  gcpCredentialsPath: string;
  bucketName: string;
};

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for streaming uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Load configuration
    const varsPath = path.resolve(process.cwd(), "vars.yaml");
    const vars = yaml.load(fs.readFileSync(varsPath, "utf8")) as Vars;

    if (!vars.gcpCredentialsPath || !vars.bucketName) {
      throw new Error("Missing required fields in vars.yaml");
    }

    const credentialsPath = path.resolve(process.cwd(), vars.gcpCredentialsPath);
    const bucketName = vars.bucketName;

    const storage = new Storage({ keyFilename: credentialsPath });
    const bucket = storage.bucket(bucketName);

    const username = req.body.username as string;
    const fileName = req.body.fileName as string;

    if (!username || !fileName) {
      return res.status(400).json({ error: "Missing username or fileName query parameter" });
    }

    // Construct storage path: username/videoname
    const storagePath = `${username}/${fileName}`;
    const file = bucket.file(storagePath);

    // Upload file
    const writeStream = file.createWriteStream({
      resumable: false,
      contentType: req.headers["content-type"] || undefined,
    });

    req.pipe(writeStream)
      .on("error", (err) => {
        console.error("Error during upload:", err);
        res.status(500).json({ error: "Upload failed", details: err.message });
      })
      .on("finish", () => {
        res.status(200).json({ message: "Upload successful", storagePath });
      });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error during file upload:", err.message);
      res.status(500).json({ error: "Upload failed", details: err.message });
    } else {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Upload failed", details: String(err) });
    }
  }
}
