import Router from 'koa-router';
import { isValidationError } from '../utils/type-guards';

export class AppError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

const errorMiddleware: () => Router.IMiddleware<any, {}> =
  () => async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log('error middleware', err);
      if (err && (err as AppError).status >= 500)
        console.log('Error handler:', err);
      if (isValidationError(err)) {
        ctx.status = 400;
      } else {
        ctx.status = (err as AppError).status || 500;
      }

      ctx.body = {
        status: 'failed',
        message: (err as AppError).message || 'Internal server error',
      };
    }
  };

export default errorMiddleware;
