import createCURD from '../../helpers/createCURD';

const INSERT_COMMENT = 'article/INSERT_COMMENT';
const ADD_STAR = 'article/ADD_STAR';
const { methods: { load }, createReducer } = createCURD('article', 'R');

export default function reducer(state = {}, action = {}) {
  let stateCURB = createReducer(state, action);
  if (stateCURB) {
    return stateCURB;
  } else {
    switch (action.type) {
      case INSERT_COMMENT:
        let a = {...state};
        a.loadData.data.comments.unshift(action.comment);
        return a;
      case ADD_STAR:
        let b = {...state};
        b.loadData.data.article.stars++;
        return b;
      default:
        return state;
    }
  }
}

export { load }

export function insertComment(comment) {  // 插入comment接口返回的数据到article页面,与article接口无关
  return {
    type: INSERT_COMMENT,
    comment: comment
  };
}

export function addStar() {  // 插入star到article页面,与article接口无关
  return {
    type: ADD_STAR
  };
}