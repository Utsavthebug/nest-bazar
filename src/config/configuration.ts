export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT) || 3001,
  HOST: process.env.POSTGRES_HOST,
  USERNAME: process.env.POSTGRES_USERNAME,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DATBASE: process.env.POSTGRES_DATABASE,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.EXPIRES_IN
  }
});
