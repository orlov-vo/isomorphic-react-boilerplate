import * as React from 'react';

import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import { App } from './containers/app/app.component';
import { AppState } from './store/state';
import { configureStore } from './store/store';

export const RENDER_REDIRECT = 'REDIRECT';
export const RENDER_HTML = 'HTML';
declare type RenderType = 'REDIRECT' | 'HTML';

interface Context {
    status?: number;
    url?: string;
}

interface RenderResult {
    type: RenderType;
    url?: string;
    html?: string;
    state?: string;
}

export const renderApp = (url: string = '/'): RenderResult => {
    // Let the reducers handle initial state
    const initialState: AppState = {
        user: 'server',
    };
    const store = configureStore(initialState);

    const context: Context = {};

    const markup = renderToString(
        <Provider store={store}>
            <StaticRouter
                location={url}
                context={context}
            >
                <App />
            </StaticRouter>
        </Provider>,
    );

    const preloadedState = `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
    </script>`;

    return (context.url)
        ? ({
            type: RENDER_REDIRECT,
            url: context.url,
        })
        : ({
            html: markup,
            state: preloadedState,
            type: RENDER_HTML,
        });
};
