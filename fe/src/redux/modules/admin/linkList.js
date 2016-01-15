import createCURD from '../../../helpers/createCURD';

const { methods: { load }, createReducer } = createCURD('admin/list', 'R', 'link');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { load }