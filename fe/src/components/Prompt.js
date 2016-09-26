import React, { Component, PropTypes } from 'react';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { Link } from 'react-router';

export default class Page extends Component {
  render() {
    let
      { loading, loadData, loadError, loadingMsg, className } = this.props,
      toastMsg;

    if (loadError) {
      toastMsg = '网络错误，请稍后重试...';
    } else if (loadData && loadData.status.code != 0) {
      toastMsg = loadData.status.msg;
    }

    return (
      <div className={className}>
        {this.props.children}
        <Loading loading={loading} msg={loadingMsg} />
        <Toast loading={loading} msg={toastMsg} />
      </div>
    );
  }
}