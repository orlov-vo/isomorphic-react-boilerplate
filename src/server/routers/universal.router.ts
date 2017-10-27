import { readFile } from 'fs';
import { resolve } from 'path';

import { NextFunction, Request, Response, Router } from 'express';

import { RENDER_HTML, RENDER_REDIRECT, renderApp } from '../../client/index.server';
import { publicPath } from '../paths';

export const router = Router();
export const universalRouter = router;

const appSelector = /(<div\s.*id\s*=\s*["']app["'][^>]*>)(.*)(<\/div>)/i;

router.use((req: Request, res: Response) => {
    return getHtmlLayout()
        .then((data: string) => {
            const rendered = renderApp(req.url);
            switch (rendered.type) {
                case RENDER_REDIRECT: return res.status(301).redirect(rendered.url || '/');
                case RENDER_HTML: return res.send(
                    data.replace(appSelector, `$1${rendered.html}$3${rendered.state}`));
            }
        }, () => res.status(404).end());
});

function getHtmlLayout() {
    const filePath = resolve(publicPath, 'index.html');
    return new Promise((res, rej) => {
        readFile(filePath, 'utf8', (err, data) => err ? rej(err) : res(data));
    });
}
