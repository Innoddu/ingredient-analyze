import type { NextApiRequest, NextApiResponse } from 'next';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
// Define interface for detected objects
interface DetectedObject {
  name: string;
  score: number;
}

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    try {
      // Initialize Google Cloud Vision API client with credentials
      const keyPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS || '');

      const client = new ImageAnnotatorClient({
        keyFilename: keyPath,  
      });


      // Convert Base64 image to a buffer
      const imageBase64 = req.body.image.split(',')[1]; // Extract image data from the Data URI format
      const imageBuffer = Buffer.from(imageBase64, 'base64');

      // Send request to the Vision API for object detection
      const [result] = await client.annotateImage({
        image: { content: imageBuffer },
        features: [{ type: 'OBJECT_LOCALIZATION' }], // Specify that we are performing object localization
      });

      // Log Vision API response for debugging
      console.log('Vision API result:', result);

      // Handle case where localizedObjectAnnotations is not null or undefined
      if (result.localizedObjectAnnotations && result.localizedObjectAnnotations.length > 0) {

        // Map the results into the DetectedObject array
        const detectedObjects: DetectedObject[] = result.localizedObjectAnnotations.map((obj: any) => ({
          name: obj.name,
          score: obj.score,
        }));

        // Return detected objects in the response
        return res.status(200).json({ detectedObjects });
      } else {

        // If no objects are detected, return an empty array
        return res.status(200).json({ detectedObjects: [] });
      }
    } catch (error) {

      // Log the error and return a 500 response with an error message
      console.error('Error during image analysis:', error);
      return res.status(500).json({ error: 'Error occurred during image analysis' });
    }
  } else {

    // Return a 405 response if the request method is not POST
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
