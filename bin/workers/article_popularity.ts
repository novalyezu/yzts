import validate from 'validate.js';
import { Message, PubSub } from '@google-cloud/pubsub';
import { getRepository } from 'typeorm';
import config from '../configs/config';
import { AvroArticleType } from '../helpers/common';
import * as common from '../helpers/common';
import {
  Article,
} from '../databases/mysql/entities';

const pubsub = new PubSub({
  projectId: config.google.googleCloudProjectId,
  keyFilename: `${__dirname}/../configs/pub-sub.json`,
});

const topicName = 'article-score';
const subName = 'article-score-sub';

export default async () => {
  try {
    console.log('[INFO] consumer article_popularity running...');
    // select a topic
    const topic = await pubsub.topic(topicName);

    // select a subscription on that topic
    const subscription = await topic.subscription(subName);

    // Receive callbacks for new messages on the subscription
    subscription.on('message', async (message: Message) => {
      const dataMsg: AvroArticleType = common.avroArticleSchema.fromBuffer(message.data);
      const articleRepo = getRepository(Article);
      const rsArticle = await articleRepo.findOne({
        id: dataMsg.article_id,
      });
      if (validate.isEmpty(rsArticle)) {
        message.ack();
        return;
      }
      if ((new Date().getTime() - new Date(rsArticle!.last_calc_time).getTime()) < 60000) {
        message.ack();
        return;
      }

      const article = new Article();
      article.id = dataMsg.article_id;
      article.popularity = 1;
      article.last_calc_time = new Date();
      await articleRepo.save(article);

      message.ack();
    });

    // Receive callbacks for errors on the subscription
    subscription.on('error', (error) => {
      console.error('Received error:', error);
    });
  } catch (error) {
    console.error('worker.article_popularity', 'with error', error);
  }
};
