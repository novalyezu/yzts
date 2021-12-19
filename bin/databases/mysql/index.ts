import { createConnection } from 'typeorm';
import {
  User, UserNotification, Article,
} from './entities';
import config from '../../configs/config';

createConnection({
  type: 'mysql',
  host: config.mysql.mysqlHost,
  port: 3306,
  username: config.mysql.mysqlUser,
  password: config.mysql.mysqlPassword,
  database: config.mysql.mysqlDb,
  entities: [
    User, UserNotification, Article,
  ],
  synchronize: true,
  logging: false,
})
  .then(() => {
    // here you can start to work with your entities
    console.log('Database is connected!');
  })
  .catch((error) => console.error(error));
