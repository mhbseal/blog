import createCURD from '../../helpers/createCURD';

const INSERT_COMMENT = 'article/INSERT_COMMENT';
const { methods: { load }, createReducer } = createCURD('article', 'R');

export default function reducer(state = {}, action = {}) {
  let stateCURB = createReducer(state, action);
  if (stateCURB) {
    return stateCURB;
  } else {
    switch (action.type) {
      case INSERT_COMMENT:
        let s = {...state};
        s.data.data.comments.unshift(action.comment);
        return s;
      default:
        return state;
    }
  }
}

export { load }

export function insertComment(comment) {
  return {
    type: INSERT_COMMENT,
    comment: comment
  };
}