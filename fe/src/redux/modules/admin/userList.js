import createCURD from '../../../helpers/createCURD';

const { methods: { load }, createReducer } = createCURD('admin/list', 'R', 'user');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { load }