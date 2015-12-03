import { createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import transitionMiddleware from './middleware/transitionMiddleware';
import reducers from './modules/reducers';

export default function configureStore(reduxReactRouter, getRoutes, createHistory, client, data) {
  const middleware = [createMiddleware(client), transitionMiddleware];

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }

  const store = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore)(reducers, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducers', () => {
      store.replaceReducer(reducers);
    });
  }

  return store;
}