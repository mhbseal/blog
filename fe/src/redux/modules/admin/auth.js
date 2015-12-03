const LOAD = 'admin/auth/LOAD';
const LOAD_SUCCESS = 'admin/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'admin/auth/LOAD_FAIL';
const LOGIN = 'admin/auth/LOGIN';
const LOGIN_SUCCESS = 'admin/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'admin/auth/LOGIN_FAIL';
const LOGOUT = 'admin/auth/LOGOUT';
const LOGOUT_SUCCESS = 'admin/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'admin/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false
};

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
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginData: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        logoutData: action.result
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.adminAuth && globalState.adminAuth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/admin/auth')
  };
}

export function login(params) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.get('/admin/auth', {params: {...params, action: 'in'}})
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/admin/auth', {params: {action: 'out'}})
  };
}