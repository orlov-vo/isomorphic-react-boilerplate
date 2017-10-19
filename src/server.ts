import * as express from 'express';
import * as serveStatic from 'serve-static';

import { addMiddleware, addRouter, listen } from './server/http';
import { indexFile, publicPath } from './server/paths';
import { universalRouter } from './server/routers/universal.router';

Promise.resolve(express())
    .then(addMiddleware(serveStatic(publicPath, { index: indexFile })))
    .then(addRouter('/', universalRouter))
    .then(listen)
    .then((app) => console.log(`Listening on port: ${app.get('port')}`));
