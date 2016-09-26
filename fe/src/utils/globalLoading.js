import { loadingStart, loadingEnd} from '../redux/modules/global';
import { push } from 'react-router-redux';

let Timer;

export default function globalLoading (promise, dispatch) {
  dispatch(loadingStart());
  return promise.then((data)=> {
    let msg = '';
    if (data.status.code != 0) {
      msg = data.status.msg;
    } else if (data.status.code == 0 && data.data && data.data.logined === false) { // 博客信息page特殊逻辑
      msg = '登陆验证失败';
    }
    dispatch(loadingEnd(msg));
    if (msg == '登陆验证失败') { // 后台登陆特殊逻辑
      clearTimeout(Timer);
      Timer = setTimeout(() => {
        dispatch(push(ADMINPATH + 'login'));
      }, 1500);
    }
  },()=> {
    dispatch(loadingEnd('网络错误，请稍后重试...'));
  });
};