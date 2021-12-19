import joi from 'joi';
import 'joi-extract-type';
import { tokenDataJoi } from '../../../helpers/common';

const signUpJoi = joi.object({
  fullname: joi.string().required(),
  email: joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required(),
});
type SignUp = joi.extractType<typeof signUpJoi>;

const signInJoi = joi.object({
  email: joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required(),
});
type SignIn = joi.extractType<typeof signInJoi>;

const refreshTokenJoi = joi.object({
  refresh_token: joi.string().required(),
});
type RefreshToken = joi.extractType<typeof refreshTokenJoi>;

export {
  tokenDataJoi, SignUp, signUpJoi, SignIn, signInJoi, RefreshToken, refreshTokenJoi,
};
