import * as React from 'react';
import { connect } from 'react-redux';

import { AppProps } from './app.props';

class AppComponent extends React.Component<AppProps> {
    public render() {
        return (
            <div>Hello world, {this.props.user}!</div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    user: state.user,
});

export const App = connect(mapStateToProps)(AppComponent);
