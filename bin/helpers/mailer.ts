import sgMail from '@sendgrid/mail';
import config from '../configs/config';
import { ReturnFunc, wrapperData, wrapperError } from './common';

sgMail.setApiKey(config.sendgridApiKey);

const send = async (toEmail: string, subject: string, body: string): Promise<ReturnFunc> => {
  const ctx = 'send';
  /* eslint-disable no-control-regex */
  const msg = {
    to: toEmail,
    from: 'Yzts <no-reply@novalyezu.com>',
    subject,
    text: 'Please use html enable email client to read this messages',
    html: body,
    category: `yzts : ${subject.replace(/[^\x00-\x7F]/g, '')}`,
  };
  /* eslint-enable no-control-regex */

  try {
    await sgMail.send(msg);
    return wrapperData('Sent');
  } catch (error) {
    console.error(`mailer.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

export {
  send,
};
