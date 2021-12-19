import { Request, Response } from 'express';
import * as controller from './controller';
import * as reqType from './type';
import * as common from '../../../helpers/common';
import { ReturnFunc } from '../../../helpers/common';

const getMe = async (req: Request, res: Response) => {
  const payload = {
    ...(req as any).decodedToken,
  };
  const validatePayload = await common.isValidPayload(payload, reqType.tokenDataJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.getMe(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'Get me fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'Get me success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

const updateProfile = async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    id: (req as any).decodedToken.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqType.updateProfileJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.updateProfile(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'Update profile fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'Update profile success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

const changePassword = async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    id: (req as any).decodedToken.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqType.changePasswordJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.changePassword(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'Change password fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'Change password success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

const forgetPassword = async (req: Request, res: Response) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqType.emailTypeJoi);
  const postRequest = async (result: ReturnFunc): Promise<ReturnFunc> => (result.err
    ? result
    : controller.forgetPassword(result.data));
  const sendResponse = async (result: ReturnFunc) => (result.err
    ? res.status(200).json({
      success: false, message: result.err.message || 'Forget password fail', data: '', error: result.err.code,
    })
    : res.status(200).json({
      success: true, message: 'Forget password success', data: result.data, error: null,
    }));
  sendResponse(await postRequest(validatePayload));
};

export {
  getMe,
  updateProfile,
  changePassword,
  forgetPassword,
};
