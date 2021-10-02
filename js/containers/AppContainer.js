import * as reducers from '../reducers';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import Hexbusters from './Hexbusters.js';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  (next) => next
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
      </div>
    );
  }
}

AppContainer.propTypes = {
  chooseTile: PropTypes.func.isRequired
};
