// import * as jwt from 'jsonwebtoken';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

import { NextFunction, Request, Response } from 'express';

import ErrorResponse from './interfaces/ErrorResponse';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

export const SECRET_KEY: Secret = 'dance';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const getBearerToken = (rawToken: string) => {
  return rawToken?.replace('Bearer ', '');
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  /*
  * Add header functionality with cookies.
  */
  try {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // get the session cookie from request header

    if (!token) {
      return res.status(402).send({ 
        messsage: 'Sorry your token has expired .', status: 402, 
      });
    } // if there is no cookie from request header, send an unauthorized response.

    if (!token) {
      res.status(502).send({ messsage: "Sorry this use isn't authenticated.", status: 502 });
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send({ message: 'Please authenticate', status: 401 });
  }
};