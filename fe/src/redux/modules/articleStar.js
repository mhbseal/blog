import createCURD from '../../helpers/createCURD';

const { methods: { create }, createReducer } = createCURD('articleStar', 'C');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { create }