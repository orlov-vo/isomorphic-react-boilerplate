import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import { reducers } from './reducers';
import { AppState } from './state';

export function configureStore(initialState: AppState = {}) {
    // Create the store with middlewares
    const middlewares: Middleware[] = [
        //  sagaMiddleware,
        //  logger,
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    const store = createStore<AppState>(
        reducers,
        initialState,
        compose(...enhancers),
    );

    return store;
}
