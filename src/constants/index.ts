import dotenv from 'dotenv';
import DiscordOauth from 'discord-oauth2';

dotenv.config();

export const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  OAUTH_CALLBACK: process.env.OAUTH_CALLBACK,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  JWT_SECRET: process.env.JWT_SECRET!,
};

export const oauth = new DiscordOauth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.OAUTH_CALLBACK,
});
