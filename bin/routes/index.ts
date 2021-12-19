import {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';
import * as Sentry from '@sentry/node';
import { router as apiV1Route } from './apis/api_v1';

const init = (server: any) => {
  server.get('*', (_: Request, __: Response, next: NextFunction) => next());

  server.get('/', (_: Request, res: Response) => res.status(200).json({
    success: true,
    message: 'App is working ✅',
    data: '',
    error: null,
  }));

  server.use('/api/v1', apiV1Route);

  server.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  server.use(Sentry.Handlers.errorHandler() as ErrorRequestHandler);

  server.use((_: Request, res: Response) => {
    res.status(404).json({
      success: false, data: '', message: 'Page Not Found', error: 404,
    });
  });
};

export { init };
