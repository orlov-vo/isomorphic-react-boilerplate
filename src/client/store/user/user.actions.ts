import { Action } from 'redux';
import * as Type from './user.types';

export class SetUser implements Action {
    public readonly type = Type.SET;
    constructor(public payload: string) { }
}

export class ResetUser implements Action {
    public readonly type = Type.RESET;
}
