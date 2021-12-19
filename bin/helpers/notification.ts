import axios from 'axios';
import validate from 'validate.js';
import { UserNotification } from '../databases/mysql/entities';
import * as userService from '../modules/v1/user/service';
import { ReturnFunc, wrapperData, wrapperError } from './common';

interface Notification {
  user_id: string,
  engagement: string,
  image: string,
  title: string,
  short: string,
  message: string,
  ref_id: string,
}

const create = async (payload: Notification): Promise<ReturnFunc> => {
  const userNotification = new UserNotification();
  userNotification.user_id = payload.user_id;
  userNotification.engagement = payload.engagement;
  userNotification.image = payload.image;
  userNotification.title = payload.title;
  userNotification.short = payload.short;
  userNotification.message = payload.message;
  userNotification.ref_id = payload.ref_id;

  const rsInsertNotif = await userService.insertNotification(userNotification);
  if (rsInsertNotif.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  return wrapperData(userNotification);
};

const push = async (payload: Notification): Promise<ReturnFunc> => {
  const ctx = 'push';
  const rsUser = await userService.findById(payload.user_id);
  if (rsUser.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
  if (validate.isEmpty(rsUser.data)) {
    return wrapperError({ message: 'User not found', code: 1 });
  }

  try {
    const result = await axios({
      method: 'POST',
      url: 'https://api-01.moengage.com/v2/transaction/sendpush',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        appId: 'appId',
        campaignName: 'PUSH_NOTIF_BACKEND',
        signature: 'signature',
        requestType: 'push',
        targetPlatform: [
          'ANDROID',
        ],
        targetAudience: 'User',
        targetUserAttributes: {
          attribute: 'USER_ATTRIBUTE_USER_EMAIL',
          comparisonParameter: 'is',
          attributeValue: rsUser.data.email,
        },
        payload: {
          ANDROID: {
            message: payload.message,
            title: payload.short,
            defaultAction: {
              type: 'deeplinking',
              value: 'yzts://notif',
            },
          },
        },
        campaignDelivery: {
          type: 'soon',
        },
        advancedSettings: {
          ignoreFC: 'true',
          sendAtHighPriority: 'true',
        },
      },
    });
    return wrapperData(result.data);
  } catch (error) {
    console.log(`notification.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const createAndPush = async (payload: Notification): Promise<ReturnFunc> => {
  const rsInsertNotif = await create(payload);
  if (rsInsertNotif.err) {
    return rsInsertNotif;
  }

  const rsPushNotif = await push(payload);
  if (rsPushNotif.err) {
    return rsPushNotif;
  }

  return wrapperData(rsInsertNotif.data);
};

const remove = async (payload: { user_id: string, engagement: string, ref_id: string }): Promise<ReturnFunc> => {
  const rsDeleteNotif = await userService.deleteNotification(payload);
  if (rsDeleteNotif.err) {
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }

  return wrapperData('Success remove notification');
};

export {
  Notification,
  create,
  push,
  createAndPush,
  remove,
};
