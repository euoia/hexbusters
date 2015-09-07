import React, { Component } from 'react';
import HBApp from './HBApp.js';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import * as reducers from '../reducers';

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  // Provides support for DevTools:
  devTools(),
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

export class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <HBApp />}
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store}
                    monitor={LogMonitor}
                    visibleOnLoad={true} />
        </DebugPanel>
      </div>
    );
  }
}
