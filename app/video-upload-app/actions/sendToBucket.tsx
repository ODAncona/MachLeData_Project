'use server';

import { Storage } from '@google-cloud/storage';
const fs = require('fs');
const yaml = require('js-yaml');

// Load the YAML file
const config = yaml.load(fs.readFileSync('vars.yaml', 'utf8'));

// Extract the variables from the YAML file
const googleCredentialsPath = config.env.GOOGLE_APPLICATION_CREDENTIALS;
const googleCloudProject = config.env.GOOGLE_CLOUD_PROJECT;

export const UploadFile = async (form: FormData) =>{
    // Initialize the Google Cloud Storage client
    const storage = new Storage({
        projectId: googleCloudProject,
        keyFilename: googleCredentialsPath, // Use the path from the YAML file
    });

    try {
        const file = form.get('file') as File;
        if (!file) {
            throw new Error('No file found in the request');
        }
        if (!file.type.startsWith('video/')) {
            throw new Error('Only video files are allowed');
        }
        const videoBuffer = await file.arrayBuffer();
        await storage.bucket('bucket-video-storage').file(file.name).save(Buffer.from(videoBuffer));
    } catch(error){
        console.error('Error during file upload:', error);
    }
}