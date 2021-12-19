import axios from 'axios';
import * as Sentry from '@sentry/node';
import { PubSub } from '@google-cloud/pubsub';
import { ReturnFunc, wrapperData, wrapperError } from './common';
import config from '../configs/config';

const pubsub = new PubSub({
  projectId: config.google.googleCloudProjectId,
  keyFilename: `${__dirname}/../configs/pub-sub.json`,
});

const getUserByIdToken = async (id_token: string): Promise<ReturnFunc> => {
  const ctx = 'getUserByIdToken';
  try {
    const result = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    return wrapperData(result.data);
  } catch (error) {
    Sentry.captureException(error);
    console.log(`google.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const publishMessage = async (topicName: string, message: Buffer): Promise<ReturnFunc> => {
  const ctx = 'publishMessage';
  try {
    const topic = await pubsub.topic(topicName).publish(message);
    return wrapperData(topic);
  } catch (error) {
    Sentry.captureException(error);
    console.log(`google.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const findPlaceByLatLng = async (lat: string, lng: string): Promise<ReturnFunc> => {
  const ctx = 'findPlaceByLatLng';
  try {
    const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}
      &language=id&key=${config.google.googleApiKey}`);
    return wrapperData(result.data);
  } catch (error) {
    Sentry.captureException(error);
    console.log(`google.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

const searchPlace = async (query: string): Promise<ReturnFunc> => {
  const ctx = 'searchPlace';
  try {
    const result = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}
      &inputtype=textquery&fields=place_id,formatted_address,name,geometry&language=id&key=${config.google.googleApiKey}`);
    return wrapperData(result.data);
  } catch (error) {
    Sentry.captureException(error);
    console.log(`google.${ctx}`, 'with error', error);
    return wrapperError({ message: 'Something went wrong, please try again later', code: 1 });
  }
};

export {
  getUserByIdToken,
  publishMessage,
  findPlaceByLatLng,
  searchPlace,
};
