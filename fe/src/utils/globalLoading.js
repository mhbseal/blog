import { loadingStart, loadingEnd} from '../redux/modules/global';

export default function globalLoading (promise, dispatch) {
  dispatch(loadingStart());
  return promise.then((data)=> {
    data.type.indexOf("SUCCESS") != -1 ? dispatch(dispatch(loadingEnd(data.status.code != 0 ? data.status.msg : '')) : dispatch(loadingEnd("服务器内部错误,请稍后重试..."));
    window.scrollTo(0, 0);  // 切换路由时回到顶部
  },()=> {
    dispatch(loadingEnd('网络错误，请稍后重试...'));
  });
};