const path = require('path');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/authapp',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_in_production',
  COOKIE_NAME: process.env.COOKIE_NAME || 'token',
  UPLOADS_DIR: path.join(__dirname, '..', '..', 'public', 'uploads'),
  isProd
};
