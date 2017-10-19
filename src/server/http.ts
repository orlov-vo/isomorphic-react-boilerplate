import * as express from 'express';
import * as url from 'url';

import { curry } from 'ramda';

export const addMiddleware = curry((
    middleware: express.Handler,
    http: express.Application,
): Promise<express.Application> => {
    http.use(middleware);
    return Promise.resolve(http);
});

export const addRouter = curry((
    path: string,
    router: express.Router,
    http: express.Application,
): Promise<express.Application> => {
    http.use(path, router);
    return Promise.resolve(http);
});

export const normalizePort = (val: number | string): number => {
    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    return (port >= 0) ? port : null;
};

export const listen = (http: express.Application): Promise<express.Application> => {
    const port: number = normalizePort(process.env.PORT || 8080);
    http.set('port', port);

    return new Promise((resolve, reject) => {
        http.listen(port, (err: Error) => (err) ? reject(err) : resolve(http));
    });
};
