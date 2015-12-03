const LOAD = 'article/LOAD';
const LOAD_SUCCESS = 'article/LOAD_SUCCESS';
const LOAD_FAIL = 'article/LOAD_FAIL';
const INSERT_COMMENT = 'article/INSERT_COMMENT';

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
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case INSERT_COMMENT:
      let state = Object.assign({}, state);
      state.data.data.comments.unshift(action.comment);
      return state;
    default:
      return state;
  }
}

export function load(params) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/article', {params})
  };
}

export function insertComment(comment) {
  return {
    type: INSERT_COMMENT,
    comment: comment
  };
}