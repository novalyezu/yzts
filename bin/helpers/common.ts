import validate from 'validate.js';
import bcrypt from 'bcryptjs';
import avro from 'avsc';
import stripAttr from 'strip-attributes';
import * as entities from 'html-entities';
import * as Sentry from '@sentry/node';
import joi from 'joi';
import 'joi-extract-type';

interface ReturnFunc {
  err: null | {
    message: string;
    code: number;
  };
  data: null | any;
}

const tokenDataJoi = joi.object({
  id: joi.string().required(),
  fullname: joi.string().required(),
  email: joi.string().required(),
  role: joi.string().required(),
}).unknown();
type TokenData = joi.extractType<typeof tokenDataJoi>;

const imageJoi = joi.object({
  name: joi.string().required(),
  data: joi.binary().required(),
  size: joi.any().optional(),
  encoding: joi.any().optional(),
  tempFilePath: joi.any().optional(),
  truncated: joi.any().optional(),
  mimetype: joi.string().required(),
  md5: joi.any().optional(),
  mv: joi.any().optional(),
});

interface AvroArticleType {
  action: string,
  article_id: string,
}

const avroArticleSchema = avro.Type.forSchema({
  type: 'record',
  name: 'article',
  fields: [
    {
      name: 'action', type: { type: 'enum', name: 'action', symbols: ['like', 'comment', 'share'] },
    },
    {
      name: 'article_id', type: 'string',
    },
  ],
});

const isValidPayload = (payload: any, constraint: any): ReturnFunc => {
  const { value, error } = constraint.validate(payload);
  if (!validate.isEmpty(error)) {
    return {
      err: { message: error.details[0].message, code: 400 },
      data: null,
    };
  }
  return {
    err: null,
    data: value,
  };
};

const generateHash = async (content: string): Promise<ReturnFunc> => {
  const ctx = 'generateHash';
  try {
    const saltRounds = 10;
    const result = await bcrypt.hash(content, saltRounds);
    return {
      err: null,
      data: result,
    };
  } catch (error) {
    Sentry.captureException(error);
    console.log(ctx, error, 'unknown error');
    return {
      err: { message: 'Something went wrong, please try again later', code: 500 },
      data: null,
    };
  }
};

const decryptHash = async (plainText: string, hash: string): Promise<ReturnFunc> => {
  const ctx = 'decryptHash';
  try {
    const result = await bcrypt.compare(plainText, hash);
    return {
      err: null,
      data: result,
    };
  } catch (error) {
    Sentry.captureException(error);
    console.log(ctx, error, 'unknown error');
    return {
      err: { message: 'Something went wrong, please try again later', code: 500 },
      data: null,
    };
  }
};

const safelyParseJSON = (json: string): ReturnFunc => {
  const ctx = 'safelyParseJSON';
  try {
    const parsed = JSON.parse(json);
    return {
      err: null,
      data: parsed,
    };
  } catch (error) {
    console.log(ctx, error, 'unknown error');
    return {
      err: { message: 'Something went wrong, please try again later', code: 500 },
      data: null,
    };
  }
};

const wrapperError = (error: { message: string; code?: number; }): ReturnFunc => ({
  err: { message: error.message, code: error.code || 500 },
  data: null,
});

const wrapperData = (data: any): ReturnFunc => ({
  err: null,
  data,
});

const getDefaultProfilePic = (): string => {
  const defaultList = [
    'https://gcloud.storage.id/assets/img/Default_Profile_1.png',
    'https://gcloud.storage.id/assets/img/Default_Profile_2.png',
    'https://gcloud.storage.id/assets/img/Default_Profile_3.png',
    'https://gcloud.storage.id/assets/img/Default_Profile_4.png',
    'https://gcloud.storage.id/assets/img/Default_Profile_5.png',
    'https://gcloud.storage.id/assets/img/Default_Profile_6.png',
  ];
  return defaultList[Math.floor(Math.random() * defaultList.length)];
};

const uniqArray = (array: any[], key: string): ReturnFunc => {
  const ctx = 'uniqArray';
  try {
    const seen: any = {};
    const out: any[] = [];
    for (let i = 0; i < array.length; i += 1) {
      const item = array[i][key];
      if (seen[item] !== 1) {
        seen[item] = 1;
        out.push(array[i]);
      }
    }
    return {
      err: null,
      data: out,
    };
  } catch (error) {
    console.log(ctx, error, 'unknown error');
    return {
      err: { message: 'Something went wrong, please try again later', code: 500 },
      data: null,
    };
  }
};

const sortArray = (array: any[], key: string): ReturnFunc => {
  const ctx = 'sortArray';
  try {
    /* eslint-disable-next-line no-nested-ternary */
    const result = array.sort((a, b) => ((a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)));
    return wrapperData(result);
  } catch (error) {
    console.log(ctx, error, 'unknown error');
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const htmlSafe = (str: string): string => stripAttr(entities.decode(str), { keep: ['src', 'href'] });

const isValidYoutubeUrl = async (url: string): Promise<boolean> => {
  const ctx = 'isValidYoutubeUrl';
  try {
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/i;
    const result = regex.test(url);
    return result;
  } catch (error) {
    console.log(`common.${ctx}`, 'with error', error);
    return false;
  }
};

const isValidTiktokUrl = async (url: string): Promise<boolean> => {
  const ctx = 'isValidTiktokUrl';
  try {
    const regex = /^((?:https?:)?\/\/)?((?:www|vt)\.)?((?:tiktok\.com))(\/(?:@|[\w]+))([\w]+)(\S+)?$/i;
    const result = regex.test(url);
    return result;
  } catch (error) {
    console.log(`common.${ctx}`, 'with error', error);
    return false;
  }
};

const isValidInstagramUrl = async (url: string): Promise<boolean> => {
  const ctx = 'isValidInstagramUrl';
  try {
    const regex = /^((?:https?:)?\/\/)?((?:www)\.)?((?:instagram\.com))(\/(?:reel\/|p\/|tv\/|v\/))([\w]+)(\S+)?$/i;
    const result = regex.test(url);
    return result;
  } catch (error) {
    console.log(`common.${ctx}`, 'with error', error);
    return false;
  }
};

const formatRupiah = (value: number): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return formatter.format(value);
};

export {
  ReturnFunc,
  tokenDataJoi,
  TokenData,
  imageJoi,
  AvroArticleType,
  avroArticleSchema,
  isValidPayload,
  generateHash,
  decryptHash,
  safelyParseJSON,
  wrapperError,
  wrapperData,
  getDefaultProfilePic,
  uniqArray,
  sortArray,
  htmlSafe,
  isValidYoutubeUrl,
  isValidTiktokUrl,
  isValidInstagramUrl,
  formatRupiah,
};
