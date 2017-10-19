import { resolve } from 'path';

export const distPath = resolve(process.cwd(), 'dist');
export const publicPath = resolve(distPath, 'public');

export const indexFile = resolve(distPath, 'index.html');
