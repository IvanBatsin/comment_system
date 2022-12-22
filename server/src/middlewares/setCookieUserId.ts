import { Request, Response, NextFunction } from 'express';
import { ApplicationCookies } from '../../../client/src/types';

type setCookieMiddleware = (req: Request, res: Response, next: NextFunction) => void

export const setCookieUserId = (currentUserCookieId: string | undefined): setCookieMiddleware => (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.userId !== currentUserCookieId && currentUserCookieId) {
    req.cookies[ApplicationCookies.USER_ID] = currentUserCookieId;
    res.clearCookie(ApplicationCookies.USER_ID);
    res.cookie(ApplicationCookies.USER_ID, currentUserCookieId);
  }
  next();
}