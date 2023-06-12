import Joi from 'joi';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { FilterRequestParams } from '../models/common';
import { PostScoreRequestBody } from '../models/http';
import scoresService from '../services/score.service';
import { Next, ParameterizedContext } from 'koa';

const ID_SCHEMA = Joi.string().uuid().required();
const BODY_SCHEMA = Joi.object<PostScoreRequestBody>({
  id: ID_SCHEMA,
  name: Joi.string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .max(50)
    .min(3)
    .required(),
  score: Joi.number().min(1).required(),
});

const router = new Router({ prefix: '/scores' });

const upsert = async (
  ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
  next: Next,
) => {
  const id = ctx.params?.id || ctx.request.body.id;
  const score = await BODY_SCHEMA.validateAsync(
    { ...ctx.request.body, id },
    {
      stripUnknown: true,
    },
  );
  ctx.body = await scoresService.upsert({ ...score, ip: ctx.request.ip });
  await next();
};

router.post('/', koaBody(), upsert);
router.put('/:id', koaBody(), upsert);

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
