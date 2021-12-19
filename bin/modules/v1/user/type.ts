import joi from 'joi';
import 'joi-extract-type';
import { tokenDataJoi } from '../../../helpers/common';

const updateProfileJoi = joi.object({
  id: joi.string().required(),
  fullname: joi.string().required(),
  email: joi.string().trim().email({ minDomainSegments: 2 }).required(),
});
type UpdateProfile = joi.extractType<typeof updateProfileJoi>;

const changePasswordJoi = joi.object({
  id: joi.string().required(),
  oldpass: joi.string().required(),
  newpass: joi.string().required(),
  repass: joi.string().required(),
});
type ChangePassword = joi.extractType<typeof changePasswordJoi>;

const emailTypeJoi = joi.object({
  email: joi.string().trim().email({ minDomainSegments: 2 }).required(),
});
type EmailType = joi.extractType<typeof emailTypeJoi>;

export {
  tokenDataJoi, UpdateProfile, updateProfileJoi, ChangePassword, changePasswordJoi, EmailType, emailTypeJoi,
};
