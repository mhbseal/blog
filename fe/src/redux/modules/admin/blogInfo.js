import createCURD from '../../../helpers/createCURD';

const { methods: { create, update, load }, createReducer } = createCURD('admin/blogInfo', 'CUR');

export default function reducer(state = { loaded: false }, action = {}) {
  return createReducer(state, action) || state;
}

export { create, update, load }

export function isLoaded(globalState) {
  return globalState.adminBlogInfo && globalState.adminBlogInfo.loaded;
}