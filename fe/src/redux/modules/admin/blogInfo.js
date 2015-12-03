const LOAD = 'admin/blogInfo/LOAD';
const LOAD_SUCCESS = 'admin/blogInfo/LOAD_SUCCESS';
const LOAD_FAIL = 'admin/blogInfo/LOAD_FAIL';
const CREATE = 'admin/blogInfo/CREATE';
const CREATE_SUCCESS = 'admin/blogInfo/CREATE_SUCCESS';
const CREATE_FAIL = 'admin/blogInfo/CREATE_FAIL';
const UPDATE = 'admin/blogInfo/UPDATE';
const UPDATE_SUCCESS = 'admin/blogInfo/UPDATE_SUCCESS';
const UPDATE_FAIL = 'admin/blogInfo/UPDATE_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadData: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadError: action.error
      };
    case CREATE:
      return {
        ...state,
        editing: true
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        editing: false,
        editData: action.result
      };
    case CREATE_FAIL:
      return {
        ...state,
        editing: false,
        editError: action.error
      };
    case UPDATE:
      return {
        ...state,
        editing: true
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        editing: false,
        editData: action.result
      };
    case UPDATE_FAIL:
      return {
        ...state,
        editing: false,
        editError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.adminBlogInfo && globalState.adminBlogInfo.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/admin/blogInfo')
  };
}
export function create(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/admin/blogInfo', {data})
  };
}

export function update(params, data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.put('/admin/blogInfo', {params, data})
  };
}