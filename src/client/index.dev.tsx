import * as React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './containers/app/app.component';
import { AppState } from './store/state';
import { configureStore } from './store/store';

const renderApp = (Component: any) => {
    // Grab the state from a global variable injected into the server-generated HTML
    const initialState: AppState = window.__PRELOADED_STATE__
        ? window.__PRELOADED_STATE__
        : ({
            user: 'client at dev',
        });

    // Allow the passed state to be garbage-collected
    delete window.__PRELOADED_STATE__;

    // Let the reducers handle initial state
    const store = configureStore(initialState);

    hydrate(
        <AppContainer>
            <Provider store={store}>
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        document.getElementById('app'),
    );
};

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./containers/app/app.component', () => {
        renderApp(App);
    });
}
