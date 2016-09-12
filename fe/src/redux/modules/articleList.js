import createCURD from '../../helpers/createCURD';

const ADD_STAR = 'articleList/ADD_STAR';
const { methods: { load }, createReducer } = createCURD('articleList', 'R');

export default function reducer(state = {}, action = {}) {
  let stateCURB = createReducer(state, action);
  if (stateCURB) {
    return stateCURB;
  } else {
    switch (action.type) {
      case ADD_STAR:
        let b = {...state};
        b.loadData.data.articles[action.i].stars++;
        return b;
      default:
        return state;
    }
  }
}

export { load }

export function addStar(i) {  // 插入star到articleList页面,与articleList接口无关
  return {
    type: ADD_STAR,
    i
  };
}