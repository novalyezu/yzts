import path from 'path';
import { Storage } from '@google-cloud/storage';
import { ReturnFunc, wrapperData, wrapperError } from './common';
import config from '../configs/config';

const storage = new Storage({
  projectId: config.google.googleCloudProjectId,
  keyFilename: './bin/configs/cloud_storage.json',
});
const bucketName = 'yzts-bucket';
const bucket = storage.bucket(bucketName);

const saveToStorage = (file: { filename: string, data: any, mimetype: string }): Promise<any> => new Promise((resolve, reject) => {
  const fileStream = bucket.file(file.filename);
  fileStream.save(file.data, {
    contentType: file.mimetype,
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  }, (err) => {
    if (!err) {
      fileStream.makePublic();
      resolve(`https://storage.googleapis.com/${bucketName}/${file.filename}`);
    }
    reject(err);
  });
});

const upload = async (file: { filename: string, data: any, mimetype: string }): Promise<ReturnFunc> => {
  const ctx = 'upload';
  try {
    const saveFile = await saveToStorage(file);
    return wrapperData(saveFile);
  } catch (error) {
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const remove = async (filename: string): Promise<ReturnFunc> => {
  const ctx = 'remove';
  try {
    await bucket.file(path.basename(filename)).delete();
    return wrapperData(true);
  } catch (error) {
    console.error(ctx, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

export {
  upload,
  remove,
};
