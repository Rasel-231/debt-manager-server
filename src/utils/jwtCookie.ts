import { CookieOptions, Response } from 'express';
import config from '../config';

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

const getCookieDomain = (): string | undefined => {
  if (config.env === 'development') {
    return 'localhost';
  }
  return undefined;
};

const baseCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: config.cookie.httpOnly,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  path: '/',
  maxAge,
  domain: getCookieDomain(),
});

export const setAuthCookies = (res: Response, tokens: IAuthTokens): void => {
  res.cookie(config.cookie.name, tokens.accessToken, baseCookieOptions(config.cookie.maxAge));
  res.cookie(
    config.cookie.refreshName,
    tokens.refreshToken,
    baseCookieOptions(config.cookie.refreshMaxAge)
  );
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(config.cookie.name, { path: '/', domain: getCookieDomain() });
  res.clearCookie(config.cookie.refreshName, { path: '/', domain: getCookieDomain() });
};
