import createCURD from '../../../helpers/createCURD';

const { methods: { create, update, load, del }, createReducer } = createCURD('admin/detail', 'CURD', 'user');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { create, update, load, del }