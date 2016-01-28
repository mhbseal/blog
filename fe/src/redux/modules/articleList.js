import createCURD from '../../helpers/createCURD';

const { methods: { load }, createReducer } = createCURD('articleList', 'R');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { load }