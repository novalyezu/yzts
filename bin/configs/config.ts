import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.ENV || 'development',
  hostname: process.env.HOST_NAME,
  port: process.env.PORT || 3000,
  secretKeyJwt: process.env.SECRET_KEY_JWT,
  secretKeyJwtRefresh: process.env.SECRET_KEY_JWT_REFRESH,
  baseUrl: process.env.BASE_URL,
  sentryDsn: process.env.SENTRY_DSN,
  mysql: {
    mysqlDb: process.env.MYSQL_DB_NAME,
    mysqlHost: process.env.MYSQL_HOST,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPassword: process.env.MYSQL_PASSWORD,
  },
  google: {
    googleCloudProjectId: process.env.GOOGLE_CLOUD_KEYFILE,
    googleApiKey: process.env.GOOGLE_API_KEY,
  },
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
};

export default config;
