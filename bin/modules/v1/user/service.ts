import {
  getRepository,
} from 'typeorm';
import * as Sentry from '@sentry/node';
import {
  User, UserNotification,
} from '../../../databases/mysql/entities';
import { ReturnFunc, wrapperData, wrapperError } from '../../../helpers/common';

const findByEmail = async (email: string): Promise<ReturnFunc> => {
  const ctx = 'findByEmail';
  try {
    const repo = getRepository(User);
    const result = await repo.findOne({
      where: {
        email,
      },
    });
    return wrapperData(result || {});
  } catch (error) {
    Sentry.captureException(error);
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

const findById = async (userId: string): Promise<ReturnFunc> => {
  const ctx = 'findById';
  try {
    const repo = getRepository(User);
    const result = await repo.findOne({
      where: {
        id: userId,
      },
    });
    return wrapperData(result || {});
  } catch (error) {
    Sentry.captureException(error);
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

const insert = async (payload: User): Promise<ReturnFunc> => {
  const ctx = 'insert';
  try {
    const repo = getRepository(User);
    const result = await repo.insert(payload);
    return wrapperData(result);
  } catch (error) {
    Sentry.captureException(error);
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

const update = async (payload: User): Promise<ReturnFunc> => {
  const ctx = 'update';
  try {
    const repo = getRepository(User);
    const result = await repo.update({ id: payload.id }, payload);
    return wrapperData(result);
  } catch (error) {
    Sentry.captureException(error);
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

const insertNotification = async (payload: UserNotification): Promise<ReturnFunc> => {
  const ctx = 'insertNotification';
  try {
    const repo = getRepository(UserNotification);
    const result = await repo.insert(payload);
    return wrapperData(result);
  } catch (error) {
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

const deleteNotification = async (payload: { user_id: string, engagement: string, ref_id: string }): Promise<ReturnFunc> => {
  const ctx = 'deleteNotification';
  try {
    const repo = getRepository(UserNotification);
    const result = await repo.delete({
      user_id: payload.user_id,
      engagement: payload.engagement,
      ref_id: payload.ref_id,
    });
    return wrapperData(result);
  } catch (error) {
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later' });
  }
};

export {
  findByEmail,
  findById,
  insert,
  update,
  insertNotification,
  deleteNotification,
};
