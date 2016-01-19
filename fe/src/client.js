/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import configureStore from './redux/configureStore';
import ApiClient from './helpers/ApiClient';
import { Provider } from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';

import getRoutes from './routes';
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe';

const client = new ApiClient();

const dest = document.getElementById('app');
const store = configureStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), createHistory, client, window.__data);

const component = (
  <ReduxRouter routes={getRoutes(store)} />
);

render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__) {
  const DevTools = require('./containers/DevTools');
  render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
