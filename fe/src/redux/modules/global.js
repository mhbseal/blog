const LOADING_START = 'global/LOADING_START';
const LOADING_END = 'global/LOADING_END';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {
      case LOADING_START:
        let a = {...state};
        a.loading = true;
        return a;
      case LOADING_END:
        let b = {...state};
        b.loading = false;
        b.toastMsg = action.toastMsg;
        return b;
      default:
        return state;
    }
}

// 全局loading启动
export function loadingStart() {
  return {
    type: LOADING_START
  };
}
// 全局loading结束
export function loadingEnd(toastMsg) {
  return {
    type: LOADING_END,
    toastMsg: toastMsg
  };
}