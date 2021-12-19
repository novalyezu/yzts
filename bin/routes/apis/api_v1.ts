import express from 'express';
import { verifyToken } from '../../helpers/middleware';

import * as authenticationHandler from '../../modules/v1/authentication/api_handler';
import * as userHandler from '../../modules/v1/user/api_handler';

const router = express.Router();

router.post('/auth/signup', authenticationHandler.signUp);
router.post('/auth/signin', authenticationHandler.signIn);
router.post('/auth/refresh-token', authenticationHandler.refreshToken);

router.get('/user/me', verifyToken, userHandler.getMe);
router.post('/user/update-profile', verifyToken, userHandler.updateProfile);
router.post('/user/change-password', verifyToken, userHandler.changePassword);
router.post('/user/forget-password', userHandler.forgetPassword);

export { router };
