import createCURD from '../../../helpers/createCURD';

const LOGIN = 'admin/auth/LOGIN';
const LOGIN_SUCCESS = 'admin/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'admin/auth/LOGIN_FAIL';
const LOGIN_CLEAR = 'admin/auth/LOGIN_CLEAR';
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
          logining: true
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          logining: false,
          logined: true,
          loginData: action.result,
          loginError: null
        };
      case LOGIN_FAIL:
        return {
          ...state,
          logining: false,
          logined: false,
          loginData: null,
          loginError: action.error
        };
      case LOGIN_CLEAR:
        let a = {...state};
        delete a.logining;
        delete a.logined;
        delete a.loginData;
        delete a.loginError;
        return a;
      case LOGOUT:
        return {
          ...state,
          logouting: true
        };
      case LOGOUT_SUCCESS:
        return {
          ...state,
          logouting: false,
          logouted: true,
          logoutData: action.result,
          logoutError: null
        };
      case LOGOUT_FAIL:
        return {
          ...state,
          logouting: false,
          logouted: false,
          logoutData: null,
          logoutError: action.error
        };
      default:
        return state;
    }
  }
}

export { load }

export function isLoaded(globalState) {
  return globalState.adminAuth && globalState.adminAuth.loadData && globalState.adminAuth.loadData.data && globalState.adminAuth.loadData.data.admin && globalState.adminAuth.loadData.data.admin.id;
}

export function clearLogin() {
  return {
    type: LOGIN_CLEAR
  };
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