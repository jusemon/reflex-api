import http, { RequestOptions } from 'http';
import https from 'https';

const get = <T>(url: string, params?: Record<string, string>): Promise<T> => {
  const { protocol, port, pathname, hostname } = new URL(url);
  const searchParams = new URLSearchParams(params);
  const httpModule = protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const options: RequestOptions = {
      hostname,
      method: 'GET',
      path: `${pathname}?${searchParams.toString()}`,
      port,
      protocol,
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data) as T);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

export default {
  get,
};
