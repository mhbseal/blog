const CREATE = 'comment/CREATE';
const CREATE_SUCCESS = 'comment/CREATE_SUCCESS';
const CREATE_FAIL = 'comment/CREATE_FAIL';

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
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
    default:
      return state;
  }
}

export function create(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/comment', {data})
  };
}