import 'reflect-metadata';
import express, {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import timeout from 'connect-timeout';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import config from './configs/config';
import * as routes from './routes/index';
// import articlePopularityWorker from './workers/article_popularity';
import './databases/mysql/index';

const server = express();

Sentry.init({
  dsn: config.sentryDsn,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app: server }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const haltOnTimedout = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).timedout) next();
};

const create = () => {
  const corsOption = {
    maxAge: 5,
    allowedHeaders: ['Authorization'],
    exposedHeaders: ['Authorization'],
  };

  // Server settings
  server.set('env', config.env);
  server.set('port', config.port);
  server.set('hostname', config.hostname);

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  server.use(Sentry.Handlers.requestHandler() as RequestHandler);
  // TracingHandler creates a trace for every incoming request
  server.use(Sentry.Handlers.tracingHandler());

  // Returns middleware that parses json
  server.use(timeout('30s'));
  server.use(morgan('dev'));
  server.use(fileUpload());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  server.use(haltOnTimedout);
  server.options('*', cors());
  server.use(cors(corsOption));
  server.use(compression());
  server.use('/images', express.static(path.join(__dirname, 'public/images')));

  // Set up routes
  routes.init(server);
};

const start = () => {
  const hostname = server.get('hostname');
  const port = server.get('port');

  server.listen(port, () => {
    console.log(`Initiate App, server-listen on - http://${hostname}:${port}`);

    // Workers
    // articlePopularityWorker();

    process.on('uncaughtException', (e) => {
      console.log('An error has occured. error is: %s and stack trace is: %s', e, e.stack);
      console.log('Process will restart now.');
      process.exit(1);
    });
  });
};

create();
start();
