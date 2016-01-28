import createCURD from '../../../helpers/createCURD';

const LOGIN = 'admin/auth/LOGIN';
const LOGIN_SUCCESS = 'admin/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'admin/auth/LOGIN_FAIL';
const LOGOUT = 'admin/auth/LOGOUT';
const LOGOUT_SUCCESS = 'admin/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'admin/auth/LOGOUT_FAIL';
const { methods: { load }, createReducer } = createCURD('admin/auth', 'R');

export default function reducer(state = { loaded: false }, action = {}) {
  let stateCURB = createReducer(state, action);
  if (stateCURB) {
    return stateCURB;
  } else {
    switch (action.type) {
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
}

export { load }

export function isLoaded(globalState) {
  return globalState.adminAuth && globalState.adminAuth.loaded;
}

export function login(params) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.get('admin/auth', {params: {...params, action: 'in'}})
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('admin/auth', {params: {action: 'out'}})
  };
}