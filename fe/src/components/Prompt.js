import React, { Component, PropTypes } from 'react';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { Link } from 'react-router';

export default class Page extends Component {
  render() {
    let
      { loading, loadData, loadError, loadingMsg, className } = this.props,
      toastMsg, loginMsg;

    if (loadError) {
      toastMsg = '网络错误，请稍后重试...';
    } else if (loadData) {
      if (loadData.status.code == 1 && loadData.status.msg == '登陆验证失败') { // 后台登陆特殊逻辑
        loginMsg = <div className="main"><p>登陆验证失败,请 <Link to={ADMINPATH + 'login'}>登陆</Link></p></div>;
      } else if (loadData.status.code != 0) {
        toastMsg = loadData.status.msg;
      }
    }

    return (
      <div className={className}>
        {this.props.children}
        <Loading loading={loading} msg={loadingMsg} />
        <Toast loading={loading} msg={toastMsg} />
        {loginMsg}
      </div>
    );
  }
}