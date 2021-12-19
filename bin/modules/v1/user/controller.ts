import validate from 'validate.js';
// import fs from 'fs';
import {
  ReturnFunc, TokenData, wrapperError, wrapperData, generateHash, decryptHash,
} from '../../../helpers/common';
import {
  User,
} from '../../../databases/mysql/entities/index';
import {
  ChangePassword,
  EmailType,
  UpdateProfile,
} from './type';
// import * as mailer from '../../../helpers/mailer';
import * as userService from './service';

const getMe = async (payload: TokenData): Promise<ReturnFunc> => {
  const rsUser = await userService.findById(payload.id);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  delete rsUser.data.password;
  return wrapperData(rsUser.data);
};

const updateProfile = async (payload: UpdateProfile): Promise<ReturnFunc> => {
  const userId = payload.id;
  const rsUser = await userService.findById(userId);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  /* if user change email */
  if (payload.email !== rsUser.data.email) {
    const rsEmail = await userService.findByEmail(payload.email);
    if (rsEmail.err) {
      return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
    }
    if (!validate.isEmpty(rsEmail.data) && rsEmail.data.id !== userId) {
      return wrapperError({ message: `${payload.email} already registered`, code: 1 });
    }
  }

  const user = new User();
  user.id = userId;
  user.fullname = payload.fullname;
  user.email = payload.email;
  const rsUpdateUser = await userService.update(user);
  if (rsUpdateUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  return wrapperData(user);
};

const changePassword = async (payload: ChangePassword): Promise<ReturnFunc> => {
  const userId = payload.id;
  const rsUser = await userService.findById(userId);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (payload.newpass !== payload.repass) {
    return wrapperError({ message: 'Password didn\'t match. Try again', code: 1 });
  }

  const checkPassword = await decryptHash(payload.oldpass, rsUser.data.password);
  if (checkPassword.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (!checkPassword.data) {
    return wrapperError({ message: 'Password is wrong. Try again', code: 1 });
  }

  const hashPassword = await generateHash(payload.newpass);
  if (hashPassword.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  const user = new User();
  user.id = userId;
  user.password = hashPassword.data;
  const rsUpdateUser = await userService.update(user);
  if (rsUpdateUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  return wrapperData('');
};

const forgetPassword = async (payload: EmailType): Promise<ReturnFunc> => {
  const rsEmail = await userService.findByEmail(payload.email);
  if (rsEmail.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (!validate.isEmpty(rsEmail.data)) {
    return wrapperError({ message: `${payload.email} already registered`, code: 1 });
  }

  // const resetPassword = new ResetPassword();
  // resetPassword.id = nanoid(64);
  // resetPassword.user_id = rsUser.data.user_id;

  // const rsInsertResetPass = await userService.insertResetPassword(resetPassword);
  // if (rsInsertResetPass.err) {
  //   return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  // }

  // fs.readFile('bin/helpers/email-template/forgot-password.html', 'utf8', (error, data) => {
  //   if (error) {
  //     console.error('fs.readFile', 'with error', error);
  //   } else {
  //     const htmlString = data.replace('{{reset-password-url}}', `https://www.novalyezu.com/reset-password?id=${resetPassword.id}`);
  //     mailer.send(payload.email, 'Reset your password', htmlString);
  //   }
  // });

  return wrapperData('');
};

export {
  getMe,
  updateProfile,
  changePassword,
  forgetPassword,
};
