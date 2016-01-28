import createCURD from '../../helpers/createCURD';

const { methods: { create }, createReducer } = createCURD('comment', 'C');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { create }