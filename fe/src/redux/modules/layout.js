import createCURD from '../../helpers/createCURD';

const { methods: { load }, createReducer } = createCURD('layout', 'R');

export default function reducer(state = { loaded: false }, action = {}) {
  return createReducer(state, action) || state;
}

export { load }

export function isLoaded(globalState) {
  return globalState.layout && globalState.layout.loaded;
}