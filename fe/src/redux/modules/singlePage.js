import createCURD from '../../helpers/createCURD';

const { methods: { load }, createReducer } = createCURD('singlePage', 'R');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { load }