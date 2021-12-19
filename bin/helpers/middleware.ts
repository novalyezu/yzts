import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../configs/config';
import { ReturnFunc, TokenData } from './common';

const generateToken = (payload: any): any => {
  const secretKey = config.secretKeyJwt!;
  const verifyOptions = {
    issuer: 'yzts',
    expiresIn: '7 days',
  };
  return jwt.sign(payload, secretKey, verifyOptions);
};

const generateRefreshToken = (payload: any): any => {
  const secretKey = config.secretKeyJwtRefresh!;
  const verifyOptions = {
    issuer: 'yzts',
    expiresIn: '14 days',
  };
  return jwt.sign(payload, secretKey, verifyOptions);
};

const getToken = (req: Request): any => {
  if (req.headers && req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    const parted = req.headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

/* eslint-disable-next-line consistent-return */
const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const secretKey = config.secretKeyJwt!;
  const verifyOptions = {
    issuer: 'yzts',
  };

  const token = getToken(req);
  if (!token) {
    return res.status(200).json({
      success: false,
      message: 'Invalid token!',
      data: '',
      error: 403,
    });
  }
  try {
    const decodedToken: any = jwt.verify(token, secretKey, verifyOptions);
    const decodedTokenType: TokenData = {
      ...decodedToken,
    };
    (req as any).decodedToken = decodedTokenType;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(200).json({
        success: false,
        message: 'Access token expired!',
        data: '',
        error: 401,
      });
    }
    return res.status(200).json({
      success: false,
      message: 'Token is not valid!',
      data: '',
      error: 401,
    });
  }
};

const verifyRefreshToken = (refreshToken: string): ReturnFunc => {
  const secretKey = config.secretKeyJwtRefresh!;
  const verifyOptions = {
    issuer: 'yzts',
  };

  const token = refreshToken;
  if (!token) {
    return {
      err: { message: 'Invalid token!', code: 403 },
      data: null,
    };
  }
  try {
    const decodedToken = jwt.verify(token, secretKey, verifyOptions);
    return {
      err: null,
      data: decodedToken,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        err: { message: 'Access token expired!', code: 401 },
        data: null,
      };
    }
    return {
      err: { message: 'Token is not valid!', code: 401 },
      data: null,
    };
  }
};

/* eslint-disable-next-line consistent-return */
const isAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const decodedToken: TokenData = {
    ...(req as any).decodedToken,
  };
  if (decodedToken.role !== 'admin') {
    return res.status(200).json({
      success: false,
      message: 'Access denied!',
      data: '',
      error: 403,
    });
  }
  next();
};

export {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  isAdmin,
};
