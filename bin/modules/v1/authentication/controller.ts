import validate from 'validate.js';
import { nanoid } from 'nanoid';
import {
  ReturnFunc, TokenData, wrapperError, wrapperData, generateHash, decryptHash,
} from '../../../helpers/common';
import {
  User,
} from '../../../databases/mysql/entities/index';
import {
  RefreshToken,
  SignIn,
  SignUp,
} from './type';
import * as middleware from '../../../helpers/middleware';
import * as userService from '../user/service';

const signUp = async (payload: SignUp): Promise<ReturnFunc> => {
  const rsEmail = await userService.findByEmail(payload.email);
  if (rsEmail.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (!validate.isEmpty(rsEmail.data)) {
    return wrapperError({ message: `${payload.email} already registered`, code: 1 });
  }

  const hashPassword = await generateHash(payload.password);
  if (hashPassword.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  const user = new User();
  user.id = nanoid(64);
  user.fullname = payload.fullname;
  user.email = payload.email;
  user.password = hashPassword.data;
  user.role = 'writer';

  const insertUser = await userService.insert(user);
  if (insertUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  const tokenData: TokenData = {
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
  };
  const token = await middleware.generateToken(tokenData);
  const refreshToken = await middleware.generateRefreshToken(tokenData);
  const {
    id, email, fullname, role,
  } = user;
  const data = {
    id, email, fullname, role, token, refresh_token: refreshToken,
  };
  return wrapperData(data);
};

const signIn = async (payload: SignIn): Promise<ReturnFunc> => {
  const rsUser = await userService.findByEmail(payload.email);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (validate.isEmpty(rsUser.data)) {
    return wrapperError({ message: 'Email are not registered', code: 1 });
  }

  const checkPassword = await decryptHash(payload.password, rsUser.data.password);
  if (checkPassword.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (!checkPassword.data) {
    return wrapperError({ message: 'Email or password is wrong. Try again', code: 1 });
  }

  const tokenData: TokenData = {
    id: rsUser.data.id,
    email: rsUser.data.email,
    fullname: rsUser.data.fullname,
    role: rsUser.data.role,
  };
  const token = await middleware.generateToken(tokenData);
  const refreshToken = await middleware.generateRefreshToken(tokenData);
  const {
    id, email, fullname, role,
  } = rsUser.data;
  const data = {
    id, email, fullname, role, token, refresh_token: refreshToken,
  };
  return wrapperData(data);
};

const refreshTheToken = async (payload: RefreshToken): Promise<ReturnFunc> => {
  const checkRefreshToken = middleware.verifyRefreshToken(payload.refresh_token);
  if (checkRefreshToken.err) {
    return checkRefreshToken;
  }

  const rsUser = await userService.findById(checkRefreshToken.data.id);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  const tokenData: TokenData = {
    id: rsUser.data.id,
    email: rsUser.data.email,
    fullname: rsUser.data.fullname,
    role: rsUser.data.role,
  };
  const token = await middleware.generateToken(tokenData);
  const refreshToken = await middleware.generateRefreshToken(tokenData);
  const {
    id, email, fullname, role,
  } = rsUser.data;
  const data = {
    id, email, fullname, role, token, refresh_token: refreshToken,
  };
  return wrapperData(data);
};

export {
  signUp,
  signIn,
  refreshTheToken,
};
