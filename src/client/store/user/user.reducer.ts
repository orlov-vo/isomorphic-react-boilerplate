import { always, clone, evolve } from 'ramda';
import { AnyAction } from 'redux';

import * as Type from './user.types';

export interface State {
    user: string;
}

const initialState: State = {
    user: 'anonymus',
};

export function reducer(state = initialState, action: AnyAction): State {
    switch (action.type) {
        case Type.SET: return evolve({
            user: always(action.payload),
        }, state);
        case Type.RESET: return clone(initialState);
        default: return state;
    }
}
