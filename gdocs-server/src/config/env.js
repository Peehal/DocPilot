import 'dotenv/config';

const required = ['MONGO_URI', 'CLERK_SECRET_KEY', 'CLIENT_URL'];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key} — set it in .env before running real features.`);
  }
}

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  liveblocksSecretKey: process.env.LIVEBLOCKS_SECRET_KEY,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
