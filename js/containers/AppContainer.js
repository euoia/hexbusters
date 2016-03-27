import * as reducers from '../reducers';
import React, { Component, PropTypes } from 'react';
import thunk from 'redux-thunk';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import Hexbusters from './Hexbusters.js';

const debug = false;

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  // Provides support for DevTools:
  debug ? devTools() : (next) => next,
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const reducer = combineReducers(reducers);
export const store = finalCreateStore(reducer);

if (module.hot) {
  module.hot.accept('../reducers', () =>
    store.replaceReducer(combineReducers(require('../reducers')))
  );
}

export class AppContainer extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Hexbusters chooseTile={this.props.chooseTile} />
        </Provider>
        {
          debug ?
            <DebugPanel bottom right top >
              <DevTools monitor={LogMonitor} store={store} visibleOnLoad />
            </DebugPanel>
            : <span />
        }
      </div>
    );
  }
}

AppContainer.propTypes = {
  chooseTile: PropTypes.func.isRequired
};
