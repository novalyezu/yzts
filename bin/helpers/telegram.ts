import axios from 'axios';
import config from '../configs/config';
import { ReturnFunc, wrapperData, wrapperError } from './common';

const apiUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;

const broadcastInfo = async (message: string): Promise<ReturnFunc> => {
  const ctx = 'broadcastInfo';
  const postData = {
    chat_id: '-12345667',
    text: `***System Reminder***:\n${message}`,
    disable_notification: false,
    parse_mode: 'Markdown',
  };
  try {
    const result = await axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: postData,
    });
    return wrapperData(result.data);
  } catch (error) {
    console.log(`telegram.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

export {
  broadcastInfo,
};
