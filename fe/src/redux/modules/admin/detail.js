const LOAD = 'admin/detail/LOAD';
const LOAD_SUCCESS = 'admin/detail/LOAD_SUCCESS';
const LOAD_FAIL = 'admin/detail/LOAD_FAIL';
const CREATE = 'admin/detail/CREATE';
const CREATE_SUCCESS = 'admin/detail/CREATE_SUCCESS';
const CREATE_FAIL = 'admin/detail/CREATE_FAIL';
const UPDATE = 'admin/detail/UPDATE';
const UPDATE_SUCCESS = 'admin/detail/UPDATE_SUCCESS';
const UPDATE_FAIL = 'admin/detail/UPDATE_FAIL';
const DELETE = 'admin/detail/DELETE';
const DELETE_SUCCESS = 'admin/detail/DELETE_SUCCESS';
const DELETE_FAIL = 'admin/detail/DELETE_FAIL';

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
    promise: (client) => client.get('/admin/detail', {params})
  };
}

export function create(params, data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/admin/detail', {params, data})
  };
}

export function update(params, data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.put('/admin/detail', {params, data})
  };
}

export function del(params) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del('/admin/detail', {params})
  };
}