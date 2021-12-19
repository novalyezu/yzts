import { Request, Response } from 'express';
import * as controller from './controller';
import * as reqType from './type';
import * as common from '../../../helpers/common';
import { ReturnFunc } from '../../../helpers/common';

const signUp = async (req: Request, res: Response) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqType.signUpJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.signUp(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'SignUp fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'SignUp success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqType.signInJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.signIn(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'SignIn fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'SignIn success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

const refreshToken = async (req: Request, res: Response) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqType.refreshTokenJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.refreshTheToken(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'Refresh token fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'Refresh token success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

export {
  signUp,
  signIn,
  refreshToken,
};
