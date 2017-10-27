import * as React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './containers/app/app.component';
import { AppState } from './store/state';
import { configureStore } from './store/store';

const renderApp = (Component: any) => {
    // Let the reducers handle initial state
    const initialState: AppState = (window as any).__PRELOADED_STATE__
        ? (window as any).__PRELOADED_STATE__
        : ({
            user: 'client at dev',
        });
    const store = configureStore(initialState);

    hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </Provider>,
        document.getElementById('app'),
    );
};

renderApp(App);
