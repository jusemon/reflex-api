import Joi from 'joi';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { FilterRequestParams } from '../models/common';
import { PostScoreRequestBody } from '../models/http';
import scoresService from '../services/score.service';

const ID_SCHEMA = Joi.string().uuid();
const BODY_SCHEMA = Joi.object<PostScoreRequestBody>({
  name: Joi.string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .max(50)
    .min(3)
    .required(),
  score: Joi.number().min(1).required(),
});

const router = new Router({ prefix: '/scores' });

router.post('/', koaBody(), async (ctx, next) => {
  const score = await BODY_SCHEMA.validateAsync(ctx.request.body, {
    stripUnknown: true,
  });
  ctx.body = await scoresService.create({ ...score, ip: ctx.request.ip });
  await next();
});

router.put('/:id', koaBody(), async (ctx, next) => {
  const id = await ID_SCHEMA.validateAsync(ctx.params.id);
  const score = await BODY_SCHEMA.validateAsync(ctx.request.body, {
    stripUnknown: true,
  });
  ctx.body = await scoresService.update(id, {
    ...score,
    ip: ctx.request.ip,
  });
  await next();
});

router.delete('/:id', async (ctx, next) => {
  const id = await ID_SCHEMA.validateAsync(ctx.params.id);
  ctx.body = await scoresService.remove(id);
  await next();
});

router.get('/:id', async (ctx, next) => {
  const id = await ID_SCHEMA.validateAsync(ctx.params.id);
  ctx.body = await scoresService.read(id);
  await next();
});

router.get('/', async (ctx, next) => {
  const { filter, page, pageSize } = ctx.request.query;
  const params: FilterRequestParams = {
    ...(filter ? { filter: filter.toString() } : {}),
    ...(page ? { page: Number(page) } : {}),
    ...(pageSize ? { pageSize: Number(pageSize) } : {}),
  };
  ctx.body = await scoresService.readAll(params);
  await next();
});

export default router;
