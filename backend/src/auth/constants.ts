import * as crypto from 'crypto';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
};