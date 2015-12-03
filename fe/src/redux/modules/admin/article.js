const LOAD = 'admin/article/LOAD';
const LOAD_SUCCESS = 'admin/article/LOAD_SUCCESS';
const LOAD_FAIL = 'admin/article/LOAD_FAIL';
const CREATE = 'admin/article/CREATE';
const CREATE_SUCCESS = 'admin/article/CREATE_SUCCESS';
const CREATE_FAIL = 'admin/article/CREATE_FAIL';
const UPDATE = 'admin/article/UPDATE';
const UPDATE_SUCCESS = 'admin/article/UPDATE_SUCCESS';
const UPDATE_FAIL = 'admin/article/UPDATE_FAIL';
const DELETE = 'admin/article/DELETE';
const DELETE_SUCCESS = 'admin/article/DELETE_SUCCESS';
const DELETE_FAIL = 'admin/article/DELETE_FAIL';

export default function reducer(state = {}, action = {}) {
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
        loadData: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
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
    case DELETE:
      return {
        ...state,
        deleteing: true
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        deleteing: false,
        deleteData: action.result
      };
    case DELETE_FAIL:
      return {
        ...state,
        deleteing: false,
        deleteError: action.error
      };
    default:
      return state;
  }
}

export function load(params) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/admin/article', {params})
  };
}

export function create(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/admin/article', {data})
  };
}

export function update(params, data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.put('/admin/article', {params, data})
  };
}

export function del(params) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del('/admin/article', {params})
  };
}