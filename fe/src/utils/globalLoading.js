import { loadingStart, loadingEnd} from '../redux/modules/global';

export default function globalLoading (promise, dispatch) {
  dispatch(loadingStart());
  return promise.then((data)=> {
    dispatch(loadingEnd(data.status.code != 0 ? data.status.msg : ''));
    window.scrollTo(0, 0);  // 切换路由时回到顶部
  },()=> {
    dispatch(loadingEnd('网络错误，请稍后重试...'));
  });
};