import cloudinary from '../../config/cloudinary.js';
import { env } from '../../config/env.js';

export function getSignature(req, res) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: 'gdocs-clone' };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.cloudinary.apiSecret
  );

  res.json({
    signature,
    timestamp,
    cloudName: env.cloudinary.cloudName,
    apiKey: env.cloudinary.apiKey,
    folder: paramsToSign.folder,
  });
}
