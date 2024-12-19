export const envConfig = {
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "secret",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "secret",
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRE || 60 * 60,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  // logger
  logLevel: process.env.LOG_LEVEL || "info",

  // cloudinary
  cloudinaryCloudName: process.env.CLOUD_NAME || "your-cloud-name",
  cloudinaryApiKey: process.env.CLOUD_API_KEY || "your-api-key",
  cloudinaryApiSecret: process.env.CLOUD_API_SECRET || "your-api-secret",

  //smtp nodemailer config
  smtpHost: process.env.SMTP_HOST || "smtp.example.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "your-email@example.com",
  smtpPass: process.env.SMTP_PASS || "your-email-password",
  fromName: process.env.FROM_NAME || "Your Name",
  fromEmail: process.env.FROM_EMAIL || "your-email@example.com",
};
