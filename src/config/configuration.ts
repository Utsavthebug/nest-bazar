export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT) || 3001,
  HOST: process.env.POSTGRES_HOST,
  USERNAME: process.env.POSTGRES_USERNAME,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DATBASE: process.env.POSTGRES_DATABASE,
  jwt: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRY_TIME: process.env.JWT_ACCESS_EXPIRY_TIME,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRY_TIME: process.env.JWT_REFRESH_EXPIRY_TIME
  }
});
