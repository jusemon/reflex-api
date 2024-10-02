import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';

import config from './config';
import scoresRoute from './routes/scores.route';
import errorMiddleware from './middlewares/error.middleware';
import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import { Server } from 'http';
import { AddressInfo } from 'net';

const ALL_NETWORK_BINDING = '0.0.0.0';
const { server } = config;

function startServerLog(this: Server) {
  const { port, address: localAddress } = this.address() as AddressInfo;
  const net = Object.values(networkInterfaces())
    .flat()
    .filter(
      (v) =>
        v?.family === 'IPv4' &&
        (localAddress === ALL_NETWORK_BINDING || v.internal),
    )
    .sort((v) => (v!.internal ? -1 : 1)) as Array<NetworkInterfaceInfo>;

  console.info('Server started successfully!');
  console.info('You can now use the service.');

  net.forEach(({ internal, address }) =>
    console.info(
      `\t${(internal ? 'Local:' : 'On Your Network:').padEnd(
        20,
        ' ',
      )}http://${address}:${port}`,
    ),
  );
}

export const initializeServer = () => {
  const app = new Koa();
  app.proxy = true;

  // Middlewares
  app.use(json());
  app.use(logger());
  app.use(errorMiddleware());

  // Routes
  const router = new Router({ prefix: `/api/v${server.apiVersion}` });
  router.use(scoresRoute.routes());
  app.use(router.routes()).use(router.allowedMethods());
  app.listen(server.port, server.host, startServerLog);
};
