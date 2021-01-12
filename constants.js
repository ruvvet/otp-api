// CONSTANTS
require('dotenv').config();

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'openid', 'profile', 'email'];

function generateAuthUrl() {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: "consent",
    scope: scopes,
  });

  return url;
}

module.exports = { oauth2Client, scopes, generateAuthUrl };
